/* ================================================================
   FLORES AGREGADOS — db.js
   Base de datos: Firebase Realtime Database (REST API)
   + localStorage como caché offline
   Los datos viven en Firebase → accesibles desde cualquier
   dispositivo que tenga la URL de tu proyecto.
================================================================ */

/* ── Configura tu Firebase aquí ──────────────────────────────
   1. Ve a https://console.firebase.google.com
   2. Crea un proyecto (o usa uno existente)
   3. Ve a "Realtime Database" → "Crear base de datos"
      (elige "Modo de prueba" para empezar)
   4. Copia la URL que aparece (termina en .firebaseio.com)
   5. Pégala abajo en FIREBASE_URL
   ──────────────────────────────────────────────────────────── */
const FIREBASE_URL = localStorage.getItem('fb_url') || '';

/* Tablas en Firebase */
const TABLES = ['ventas','gastos','compras','prestamos','config'];

/* ── Estado de conexión ──────────────────────────────────────── */
const DB_STATUS = { online: false, configured: !!FIREBASE_URL };

/* ── Helpers REST ────────────────────────────────────────────── */
const fbUrl = (table, id = '') =>
  `${FIREBASE_URL}/${table}${id ? '/'+id : ''}.json`;

async function fbGet(table) {
  const res = await fetch(fbUrl(table));
  if (!res.ok) throw new Error(`Firebase GET error ${res.status}`);
  const data = await res.json();
  if (!data) return [];
  return Object.values(data);
}

async function fbPut(table, record) {
  const res = await fetch(fbUrl(table, record.id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(`Firebase PUT error ${res.status}`);
  return res.json();
}

async function fbDelete(table, id) {
  const res = await fetch(fbUrl(table, id), { method: 'DELETE' });
  if (!res.ok) throw new Error(`Firebase DELETE error ${res.status}`);
}

async function fbSet(table, record) { return fbPut(table, record); }

/* ── Cache local (para funcionar offline) ─────────────────────── */
const LS_KEY = 'flores_cache_v3';

function cacheRead() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
function cacheSave(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
function cacheGet(table)          { return cacheRead()[table] || []; }
function cacheSet(table, arr)     { const c=cacheRead(); c[table]=arr; cacheSave(c); }
function cacheUpsert(table, rec)  { const arr=cacheGet(table); const i=arr.findIndex(r=>r.id===rec.id); if(i>=0)arr[i]=rec; else arr.push(rec); cacheSet(table,arr); }
function cacheDel(table, id)      { cacheSet(table, cacheGet(table).filter(r=>r.id!==id)); }

/* ── API pública ─────────────────────────────────────────────── */
const DB = {
  /* Verifica si Firebase está configurado y accesible */
  async init() {
    if (!FIREBASE_URL) {
      DB_STATUS.online     = false;
      DB_STATUS.configured = false;
      updateSyncUI('offline');
      return false;
    }
    try {
      const res = await fetch(fbUrl('config'));
      DB_STATUS.online     = res.ok;
      DB_STATUS.configured = true;
      updateSyncUI(res.ok ? 'online' : 'offline');
      return res.ok;
    } catch {
      DB_STATUS.online = false;
      updateSyncUI('offline');
      return false;
    }
  },

  isOnline() { return DB_STATUS.online; },

  /* ── Getters ── */
  async getAll(table) {
    if (!DB_STATUS.online) return cacheGet(table);
    try {
      updateSyncUI('syncing');
      const data = await fbGet(table);
      cacheSet(table, data);
      updateSyncUI('online');
      return data.sort((a,b)=> (a.id||0)-(b.id||0));
    } catch(e) {
      console.warn('[DB] fallback cache', e.message);
      updateSyncUI('offline');
      return cacheGet(table);
    }
  },

  getVentas:   () => DB.getAll('ventas'),
  getGastos:   () => DB.getAll('gastos'),
  getCompras:  () => DB.getAll('compras'),
  getPrestamos:() => DB.getAll('prestamos'),

  /* Config especial */
  async getConfig() {
    if (!DB_STATUS.online) {
      const c = cacheGet('config');
      return c.find(r=>r.key==='settings') || { key:'settings', capitalInicial:3000, diasTrabajados:26, mesActivo:'todos' };
    }
    try {
      const res = await fetch(fbUrl('config','settings'));
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (data) { cacheUpsert('config', data); return data; }
    } catch {}
    const c = cacheGet('config');
    return c.find(r=>r.key==='settings') || { key:'settings', capitalInicial:3000, diasTrabajados:26, mesActivo:'todos' };
  },

  /* ── Savers ── */
  async save(table, record) {
    cacheUpsert(table, record);                   // siempre guardar local primero
    if (!DB_STATUS.online) return record;
    try {
      updateSyncUI('syncing');
      await fbPut(table, record);
      updateSyncUI('online');
    } catch(e) {
      console.warn('[DB] save offline queued', e.message);
      updateSyncUI('offline');
    }
    return record;
  },

  saveVenta:   r => DB.save('ventas',   r),
  saveGasto:   r => DB.save('gastos',   r),
  saveCompra:  r => DB.save('compras',  r),
  savePrestamo:r => DB.save('prestamos',r),
  saveConfig:  r => DB.save('config',   { key:'settings', ...r }),

  /* ── Deleters ── */
  async del(table, id) {
    cacheDel(table, id);
    if (!DB_STATUS.online) return;
    try { await fbDelete(table, id); }
    catch(e) { console.warn('[DB] delete offline', e.message); }
  },

  deleteVenta:   id => DB.del('ventas',   id),
  deleteGasto:   id => DB.del('gastos',   id),
  deleteCompra:  id => DB.del('compras',  id),
  deletePrestamo:id => DB.del('prestamos',id),

  /* ── Sincronizar cache pendiente → Firebase ── */
  async syncPending() {
    if (!DB_STATUS.online) return;
    updateSyncUI('syncing');
    try {
      const cache = cacheRead();
      for (const table of TABLES) {
        const arr = cache[table] || [];
        for (const rec of arr) await fbPut(table, rec);
      }
      updateSyncUI('online');
    } catch(e) {
      updateSyncUI('offline');
    }
  },

  /* ── Export/Import completo ── */
  async exportAll() {
    const [v,g,c,p,cfg] = await Promise.all([
      DB.getVentas(), DB.getGastos(), DB.getCompras(),
      DB.getPrestamos(), DB.getConfig(),
    ]);
    return { ventas:v, gastos:g, compras:c, prestamos:p, config:cfg, exportDate: new Date().toISOString() };
  },

  async importAll(data) {
    const tables = { ventas:'ventas', gastos:'gastos', compras:'compras', prestamos:'prestamos' };
    for (const [key, table] of Object.entries(tables)) {
      if (!data[key]) continue;
      cacheSet(table, data[key]);
      if (DB_STATUS.online) {
        for (const rec of data[key]) await fbPut(table, rec);
      }
    }
    if (data.config) await DB.saveConfig(data.config);
  },

  /* ── Guardar URL de Firebase ── */
  setFirebaseUrl(url) {
    localStorage.setItem('fb_url', url.trim().replace(/\/$/, ''));
    location.reload();
  },
};

/* ── UI de estado de conexión ─────────────────────────────────── */
function updateSyncUI(state) {
  DB_STATUS.online = (state === 'online');
  const el = document.getElementById('sync-status');
  if (!el) return;
  el.className = `sync-status ${state}`;
  el.querySelector('.dot-label').textContent =
    state === 'online'  ? '🟢 Firebase OK' :
    state === 'syncing' ? '🟡 Sincronizando...' : '🔴 Sin conexión (caché)';
}

/* ── Datos semilla (solo se usan si Firebase está vacío) ──────── */
const SEED = {
  ventas: [
    {id:1,  fecha:'2026-04-23',cliente:'pedro',       pagado:'SI', material:'arena fina',        cantidad:2,   precioVenta:50,  totalVenta:100,   cantComprada:2,   costoM3:30,   totalCosto:60,    ganancia:40},
    {id:2,  fecha:'2026-04-23',cliente:'pedro',       pagado:'SI', material:'arena gruesa',       cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:46},
    {id:3,  fecha:'2026-04-23',cliente:'enoc',        pagado:'SI', material:'piedra chancada',    cantidad:12,  precioVenta:85,  totalVenta:1020,  cantComprada:10,  costoM3:68,   totalCosto:680,   ganancia:340},
    {id:4,  fecha:'2026-04-23',cliente:'enoc',        pagado:'SI', material:'arena gruesa',       cantidad:12,  precioVenta:50,  totalVenta:600,   cantComprada:10,  costoM3:37,   totalCosto:370,   ganancia:230},
    {id:5,  fecha:'2026-04-23',cliente:'jardines',    pagado:'SI', material:'ormigon',            cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:45,   totalCosto:90,    ganancia:30},
    {id:6,  fecha:'2026-04-23',cliente:'yoja',        pagado:'SI', material:'ormigon',            cantidad:6,   precioVenta:60,  totalVenta:360,   cantComprada:5.5, costoM3:45,   totalCosto:247.5, ganancia:112.5},
    {id:7,  fecha:'2026-04-23',cliente:'pedro',       pagado:'SI', material:'ormigon',            cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:45,   totalCosto:90,    ganancia:30},
    {id:8,  fecha:'2026-04-23',cliente:'lavan',       pagado:'SI', material:'ormigon',            cantidad:3,   precioVenta:60,  totalVenta:180,   cantComprada:2.5, costoM3:45,   totalCosto:112.5, ganancia:67.5},
    {id:9,  fecha:'2026-04-23',cliente:'consuelo',    pagado:'SI', material:'arena gruesa',       cantidad:4,   precioVenta:50,  totalVenta:200,   cantComprada:3.5, costoM3:37,   totalCosto:129.5, ganancia:70.5},
    {id:10, fecha:'2026-04-23',cliente:'consuelo',    pagado:'SI', material:'confitillo',         cantidad:4,   precioVenta:70,  totalVenta:280,   cantComprada:3.5, costoM3:36,   totalCosto:126,   ganancia:154},
    {id:11, fecha:'2026-04-23',cliente:'duber',       pagado:'SI', material:'ormigon',            cantidad:4,   precioVenta:60,  totalVenta:240,   cantComprada:3.5, costoM3:45,   totalCosto:157.5, ganancia:82.5},
    {id:12, fecha:'2026-04-23',cliente:'duber',       pagado:'SI', material:'pilca',              cantidad:3,   precioVenta:70,  totalVenta:210,   cantComprada:2.5, costoM3:65,   totalCosto:162.5, ganancia:47.5},
    {id:13, fecha:'2026-04-24',cliente:'duber',       pagado:'SI', material:'arena gruesa',       cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:46},
    {id:14, fecha:'2026-04-24',cliente:'duver',       pagado:'SI', material:'confitillo',         cantidad:1.5, precioVenta:70,  totalVenta:105,   cantComprada:1.5, costoM3:36,   totalCosto:54,    ganancia:51},
    {id:15, fecha:'2026-04-24',cliente:'darwin',      pagado:'SI', material:'confitillo',         cantidad:4,   precioVenta:70,  totalVenta:280,   cantComprada:4,   costoM3:36,   totalCosto:144,   ganancia:136},
    {id:16, fecha:'2026-04-25',cliente:'darwin',      pagado:'NO', material:'arena gruesa',       cantidad:3,   precioVenta:55,  totalVenta:165,   cantComprada:3,   costoM3:37,   totalCosto:111,   ganancia:54},
    {id:17, fecha:'2026-04-25',cliente:'darwin',      pagado:'NO', material:'confitillo',         cantidad:2.5, precioVenta:70,  totalVenta:175,   cantComprada:2.5, costoM3:36,   totalCosto:90,    ganancia:85},
    {id:18, fecha:'2026-04-27',cliente:'',            pagado:'SI', material:'desmonte',           cantidad:7,   precioVenta:100, totalVenta:700,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:700},
    {id:19, fecha:'2026-04-27',cliente:'lavan',       pagado:'SI', material:'piedra chancada',    cantidad:3,   precioVenta:90,  totalVenta:270,   cantComprada:3,   costoM3:68,   totalCosto:204,   ganancia:66},
    {id:20, fecha:'2026-04-27',cliente:'silva',       pagado:'SI', material:'arena gruesa',       cantidad:2,   precioVenta:55,  totalVenta:110,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:36},
    {id:21, fecha:'2026-04-27',cliente:'nailin',      pagado:'SI', material:'piedra chancada',    cantidad:4,   precioVenta:90,  totalVenta:360,   cantComprada:4,   costoM3:68,   totalCosto:272,   ganancia:88},
    {id:22, fecha:'2026-04-28',cliente:'pedro',       pagado:'SI', material:'arena gruesa',       cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:46},
    {id:23, fecha:'2026-04-28',cliente:'pedro',       pagado:'SI', material:'confitillo',         cantidad:2,   precioVenta:70,  totalVenta:140,   cantComprada:2,   costoM3:36,   totalCosto:72,    ganancia:68},
    {id:24, fecha:'2026-04-28',cliente:'yoja',        pagado:'SI', material:'arena gruesa',       cantidad:6,   precioVenta:60,  totalVenta:360,   cantComprada:6,   costoM3:37,   totalCosto:222,   ganancia:138},
    {id:25, fecha:'2026-04-28',cliente:'desmonte',    pagado:'SI', material:'desmonte',           cantidad:36,  precioVenta:20,  totalVenta:720,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:720},
    {id:26, fecha:'2026-04-28',cliente:'consuelo',    pagado:'SI', material:'arena fina',         cantidad:3,   precioVenta:50,  totalVenta:150,   cantComprada:3,   costoM3:30,   totalCosto:90,    ganancia:60},
    {id:27, fecha:'2026-04-29',cliente:'zorro',       pagado:'SI', material:'ormigon',            cantidad:8,   precioVenta:58,  totalVenta:464,   cantComprada:8,   costoM3:45,   totalCosto:360,   ganancia:104},
    {id:28, fecha:'2026-04-29',cliente:'desmonte',    pagado:'SI', material:'desmonte',           cantidad:36,  precioVenta:20,  totalVenta:720,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:720},
    {id:29, fecha:'2026-04-30',cliente:'desmonte',    pagado:'SI', material:'desmonte',           cantidad:24,  precioVenta:30,  totalVenta:720,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:720},
    {id:30, fecha:'2026-05-01',cliente:'nayra',       pagado:'SI', material:'arena gruesa rio',   cantidad:12,  precioVenta:60,  totalVenta:720,   cantComprada:1,   costoM3:100,  totalCosto:100,   ganancia:620},
    {id:31, fecha:'2026-05-01',cliente:'naira',       pagado:'SI', material:'confitillo',         cantidad:10,  precioVenta:70,  totalVenta:700,   cantComprada:10,  costoM3:36,   totalCosto:360,   ganancia:340},
    {id:32, fecha:'2026-05-01',cliente:'nailin',      pagado:'SI', material:'arena fina',         cantidad:4,   precioVenta:50,  totalVenta:200,   cantComprada:4,   costoM3:30,   totalCosto:120,   ganancia:80},
    {id:33, fecha:'2026-05-01',cliente:'consuelo',    pagado:'SI', material:'arena gruesa',       cantidad:4,   precioVenta:50,  totalVenta:200,   cantComprada:4,   costoM3:37,   totalCosto:148,   ganancia:52},
    {id:34, fecha:'2026-05-01',cliente:'carlos',      pagado:'NO', material:'piedra chancada',    cantidad:3,   precioVenta:80,  totalVenta:240,   cantComprada:3,   costoM3:68,   totalCosto:204,   ganancia:36},
    {id:35, fecha:'2026-05-01',cliente:'carlos',      pagado:'NO', material:'arena gruesa',       cantidad:3,   precioVenta:50,  totalVenta:150,   cantComprada:3,   costoM3:37,   totalCosto:111,   ganancia:39},
    {id:36, fecha:'2026-05-01',cliente:'silva',       pagado:'SI', material:'arena fina',         cantidad:2,   precioVenta:50,  totalVenta:100,   cantComprada:2,   costoM3:30,   totalCosto:60,    ganancia:40},
    {id:37, fecha:'2026-05-01',cliente:'pancho',      pagado:'SI', material:'piedra chancada',    cantidad:1.5, precioVenta:100, totalVenta:150,   cantComprada:1.5, costoM3:68,   totalCosto:102,   ganancia:48},
    {id:38, fecha:'2026-05-01',cliente:'pancho',      pagado:'SI', material:'arena gruesa',       cantidad:3,   precioVenta:60,  totalVenta:180,   cantComprada:3,   costoM3:37,   totalCosto:111,   ganancia:69},
    {id:39, fecha:'2026-05-02',cliente:'jonatan',     pagado:'SI', material:'arena gruesa',       cantidad:7,   precioVenta:50,  totalVenta:350,   cantComprada:6.5, costoM3:37,   totalCosto:240.5, ganancia:109.5},
    {id:40, fecha:'2026-05-02',cliente:'jonatan',     pagado:'SI', material:'piedra chancada',    cantidad:7,   precioVenta:90,  totalVenta:630,   cantComprada:6,   costoM3:68,   totalCosto:408,   ganancia:222},
    {id:41, fecha:'2026-05-02',cliente:'consuelo',    pagado:'SI', material:'arena gruesa',       cantidad:3,   precioVenta:50,  totalVenta:150,   cantComprada:2.5, costoM3:37,   totalCosto:92.5,  ganancia:57.5},
    {id:42, fecha:'2026-05-02',cliente:'consuelo',    pagado:'SI', material:'piedra chancada',    cantidad:3,   precioVenta:80,  totalVenta:240,   cantComprada:2.5, costoM3:68,   totalCosto:170,   ganancia:70},
    {id:43, fecha:'2026-05-02',cliente:'cruz',        pagado:'SI', material:'arena gruesa',       cantidad:7,   precioVenta:55,  totalVenta:385,   cantComprada:7,   costoM3:37,   totalCosto:259,   ganancia:126},
    {id:44, fecha:'2026-05-02',cliente:'cruz',        pagado:'SI', material:'confitillo',         cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:36,   totalCosto:72,    ganancia:48},
    {id:45, fecha:'2026-05-04',cliente:'pedro',       pagado:'SI', material:'arena gruesa',       cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:46},
    {id:46, fecha:'2026-05-04',cliente:'neyra',       pagado:'SI', material:'ormigon',            cantidad:6,   precioVenta:60,  totalVenta:360,   cantComprada:6,   costoM3:41,   totalCosto:246,   ganancia:114},
    {id:47, fecha:'2026-05-04',cliente:'neyra',       pagado:'SI', material:'piedra pilca',       cantidad:4,   precioVenta:68,  totalVenta:272,   cantComprada:4,   costoM3:0,    totalCosto:0,     ganancia:272},
    {id:48, fecha:'2026-05-04',cliente:'manuel',      pagado:'SI', material:'confitillo',         cantidad:12,  precioVenta:68,  totalVenta:816,   cantComprada:11.5,costoM3:36,   totalCosto:414,   ganancia:402},
    {id:49, fecha:'2026-05-05',cliente:'pedro',       pagado:'SI', material:'ormigon',            cantidad:3.5, precioVenta:60,  totalVenta:210,   cantComprada:3.5, costoM3:41,   totalCosto:143.5, ganancia:66.5},
    {id:50, fecha:'2026-05-05',cliente:'nayra',       pagado:'SI', material:'ormigon',            cantidad:5,   precioVenta:60,  totalVenta:300,   cantComprada:4.5, costoM3:41,   totalCosto:184.5, ganancia:115.5},
    {id:51, fecha:'2026-05-05',cliente:'nayra',       pagado:'SI', material:'pilca',              cantidad:2,   precioVenta:75,  totalVenta:150,   cantComprada:1.5, costoM3:65,   totalCosto:97.5,  ganancia:52.5},
    {id:52, fecha:'2026-05-05',cliente:'silva',       pagado:'SI', material:'arena gruesa',       cantidad:12,  precioVenta:50,  totalVenta:600,   cantComprada:12,  costoM3:37,   totalCosto:444,   ganancia:156},
    {id:53, fecha:'2026-05-05',cliente:'wilmer',      pagado:'SI', material:'ormigon',            cantidad:12,  precioVenta:50,  totalVenta:600,   cantComprada:11,  costoM3:41,   totalCosto:451,   ganancia:149},
    {id:54, fecha:'2026-05-05',cliente:'colorada',    pagado:'SI', material:'ormigon',            cantidad:6,   precioVenta:68,  totalVenta:408,   cantComprada:6,   costoM3:41,   totalCosto:246,   ganancia:162},
    {id:55, fecha:'2026-05-06',cliente:'wilmer',      pagado:'SI', material:'piedra pilca',       cantidad:12,  precioVenta:70,  totalVenta:840,   cantComprada:10,  costoM3:0,    totalCosto:0,     ganancia:840},
    {id:56, fecha:'2026-05-06',cliente:'neyra',       pagado:'SI', material:'arena gruesa',       cantidad:3,   precioVenta:60,  totalVenta:180,   cantComprada:3,   costoM3:37,   totalCosto:111,   ganancia:69},
    {id:57, fecha:'2026-05-06',cliente:'neyra',       pagado:'SI', material:'confitillo',         cantidad:1,   precioVenta:70,  totalVenta:70,    cantComprada:1,   costoM3:41,   totalCosto:41,    ganancia:29},
    {id:58, fecha:'2026-05-06',cliente:'ing',         pagado:'SI', material:'piedra pilca',       cantidad:9,   precioVenta:80,  totalVenta:720,   cantComprada:9,   costoM3:0,    totalCosto:0,     ganancia:720},
    {id:59, fecha:'2026-05-07',cliente:'colorada',    pagado:'SI', material:'ormigon',            cantidad:1,   precioVenta:60,  totalVenta:60,    cantComprada:1,   costoM3:41,   totalCosto:41,    ganancia:19},
    {id:60, fecha:'2026-05-07',cliente:'yojan',       pagado:'SI', material:'arena gruesa',       cantidad:6,   precioVenta:60,  totalVenta:360,   cantComprada:4,   costoM3:37,   totalCosto:148,   ganancia:212},
    {id:61, fecha:'2026-05-07',cliente:'yojan',       pagado:'SI', material:'confitillo',         cantidad:3,   precioVenta:70,  totalVenta:210,   cantComprada:2.5, costoM3:41,   totalCosto:102.5, ganancia:107.5},
    {id:62, fecha:'2026-05-07',cliente:'wilmer',      pagado:'SI', material:'pilca',              cantidad:8,   precioVenta:75,  totalVenta:600,   cantComprada:7,   costoM3:65,   totalCosto:455,   ganancia:145},
    {id:63, fecha:'2026-05-08',cliente:'real plaza',  pagado:'SI', material:'desmonte',           cantidad:12,  precioVenta:12.5,totalVenta:150,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:150},
    {id:64, fecha:'2026-05-08',cliente:'real plaza',  pagado:'SI', material:'afirmado',           cantidad:1,   precioVenta:700, totalVenta:700,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:700},
    {id:65, fecha:'2026-05-08',cliente:'yojan',       pagado:'SI', material:'ormigon',            cantidad:4,   precioVenta:70,  totalVenta:280,   cantComprada:3.5, costoM3:41,   totalCosto:143.5, ganancia:136.5},
    {id:66, fecha:'2026-05-08',cliente:'yojan',       pagado:'SI', material:'pilca',              cantidad:4,   precioVenta:90,  totalVenta:360,   cantComprada:3.5, costoM3:65,   totalCosto:227.5, ganancia:132.5},
    {id:67, fecha:'2026-05-08',cliente:'pedro',       pagado:'SI', material:'piedra chancada',    cantidad:1,   precioVenta:80,  totalVenta:80,    cantComprada:1,   costoM3:68,   totalCosto:68,    ganancia:12},
    {id:68, fecha:'2026-05-08',cliente:'pedro',       pagado:'SI', material:'arena gruesa',       cantidad:1,   precioVenta:60,  totalVenta:60,    cantComprada:1,   costoM3:37,   totalCosto:37,    ganancia:23},
    {id:69, fecha:'2026-05-09',cliente:'union',       pagado:'SI', material:'arena gruesa',       cantidad:4,   precioVenta:60,  totalVenta:240,   cantComprada:4,   costoM3:37,   totalCosto:148,   ganancia:92},
    {id:70, fecha:'2026-05-11',cliente:'cruz',        pagado:'SI', material:'ormigon',            cantidad:15,  precioVenta:60,  totalVenta:900,   cantComprada:15,  costoM3:41,   totalCosto:615,   ganancia:285},
    {id:71, fecha:'2026-05-11',cliente:'wilmer',      pagado:'SI', material:'arena gruesa',       cantidad:10,  precioVenta:50,  totalVenta:500,   cantComprada:9.5, costoM3:37,   totalCosto:351.5, ganancia:148.5},
    {id:72, fecha:'2026-05-11',cliente:'raul',        pagado:'SI', material:'arena gruesa',       cantidad:7,   precioVenta:50,  totalVenta:350,   cantComprada:6.5, costoM3:37,   totalCosto:240.5, ganancia:109.5},
    {id:73, fecha:'2026-05-07',cliente:'confitillo',  pagado:'SI', material:'tiki',               cantidad:4.5, precioVenta:60,  totalVenta:270,   cantComprada:4.5, costoM3:50,   totalCosto:225,   ganancia:45},
    {id:74, fecha:'2026-05-11',cliente:'raul',        pagado:'SI', material:'confitillo',         cantidad:5,   precioVenta:70,  totalVenta:350,   cantComprada:5,   costoM3:41,   totalCosto:205,   ganancia:145},
    {id:75, fecha:'2026-05-12',cliente:'cruz',        pagado:'SI', material:'desmonte',           cantidad:1,   precioVenta:350, totalVenta:350,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:350},
    {id:76, fecha:'2026-05-12',cliente:'josue',       pagado:'SI', material:'arena de chacra',    cantidad:1,   precioVenta:300, totalVenta:300,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:300},
    {id:77, fecha:'2026-05-12',cliente:'cesar',       pagado:'SI', material:'ormigon',            cantidad:4,   precioVenta:60,  totalVenta:240,   cantComprada:3.5, costoM3:41,   totalCosto:143.5, ganancia:96.5},
    {id:78, fecha:'2026-05-12',cliente:'pedro',       pagado:'SI', material:'arena gruesa',       cantidad:3.5, precioVenta:60,  totalVenta:210,   cantComprada:3.5, costoM3:37,   totalCosto:129.5, ganancia:80.5},
    {id:79, fecha:'2026-05-12',cliente:'pedro',       pagado:'SI', material:'piedra chancada',    cantidad:3,   precioVenta:100, totalVenta:300,   cantComprada:3,   costoM3:68,   totalCosto:204,   ganancia:96},
    {id:80, fecha:'2026-05-13',cliente:'silva',       pagado:'SI', material:'arena fina',         cantidad:2,   precioVenta:50,  totalVenta:100,   cantComprada:2,   costoM3:30,   totalCosto:60,    ganancia:40},
    {id:81, fecha:'2026-05-13',cliente:'huaman',      pagado:'SI', material:'ormigon',            cantidad:3,   precioVenta:60,  totalVenta:180,   cantComprada:3,   costoM3:41,   totalCosto:123,   ganancia:57},
    {id:82, fecha:'2026-05-13',cliente:'zona industrial',pagado:'SI',material:'arena fina',       cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:30,   totalCosto:60,    ganancia:60},
    {id:83, fecha:'2026-05-14',cliente:'tierra chacra',pagado:'SI',material:'tierra de chacra',   cantidad:18,  precioVenta:50,  totalVenta:900,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:900},
    {id:84, fecha:'2026-05-14',cliente:'huaman',      pagado:'SI', material:'ormigon',            cantidad:7,   precioVenta:60,  totalVenta:420,   cantComprada:7,   costoM3:41,   totalCosto:287,   ganancia:133},
    {id:85, fecha:'2026-05-15',cliente:'desmonte',    pagado:'SI', material:'desmonte',           cantidad:48,  precioVenta:20,  totalVenta:960,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:960},
    {id:86, fecha:'2026-05-15',cliente:'silva',       pagado:'SI', material:'relleno',            cantidad:1,   precioVenta:100, totalVenta:100,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:100},
    {id:87, fecha:'2026-05-15',cliente:'talledo',     pagado:'SI', material:'arena gruesa',       cantidad:4,   precioVenta:60,  totalVenta:240,   cantComprada:4,   costoM3:37,   totalCosto:148,   ganancia:92},
    {id:88, fecha:'2026-05-15',cliente:'talledo',     pagado:'SI', material:'piedra chancada',    cantidad:4,   precioVenta:100, totalVenta:400,   cantComprada:4,   costoM3:68,   totalCosto:272,   ganancia:128},
    {id:89, fecha:'2026-05-15',cliente:'emilio',      pagado:'SI', material:'ormigon',            cantidad:6,   precioVenta:60,  totalVenta:360,   cantComprada:6,   costoM3:41,   totalCosto:246,   ganancia:114},
    {id:90, fecha:'2026-05-16',cliente:'nuevo talarita',pagado:'SI',material:'ormigon',           cantidad:3,   precioVenta:60,  totalVenta:180,   cantComprada:3,   costoM3:41,   totalCosto:123,   ganancia:57},
    {id:91, fecha:'2026-05-16',cliente:'emilio',      pagado:'SI', material:'piedra over',        cantidad:5.5, precioVenta:80,  totalVenta:440,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:440},
    {id:92, fecha:'2026-05-16',cliente:'raul',        pagado:'SI', material:'arena gruesa',       cantidad:2,   precioVenta:50,  totalVenta:100,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:26},
    {id:93, fecha:'2026-05-16',cliente:'raul',        pagado:'SI', material:'confitillo',         cantidad:2,   precioVenta:70,  totalVenta:140,   cantComprada:2,   costoM3:41,   totalCosto:82,    ganancia:58},
    {id:94, fecha:'2026-05-18',cliente:'pedro',       pagado:'SI', material:'piedra chancada',    cantidad:3.5, precioVenta:100, totalVenta:350,   cantComprada:3.5, costoM3:68,   totalCosto:238,   ganancia:112},
    {id:95, fecha:'2026-05-18',cliente:'pedro',       pagado:'SI', material:'arena gruesa',       cantidad:3.5, precioVenta:60,  totalVenta:210,   cantComprada:3.5, costoM3:37,   totalCosto:129.5, ganancia:80.5},
    {id:96, fecha:'2026-05-18',cliente:'wilmer',      pagado:'SI', material:'ormigon',            cantidad:6,   precioVenta:60,  totalVenta:360,   cantComprada:6,   costoM3:41,   totalCosto:246,   ganancia:114},
    {id:97, fecha:'2026-05-18',cliente:'wilmer',      pagado:'SI', material:'piedra opilca',      cantidad:4,   precioVenta:90,  totalVenta:360,   cantComprada:4,   costoM3:65,   totalCosto:260,   ganancia:100},
    {id:98, fecha:'2026-05-18',cliente:'manuel',      pagado:'SI', material:'confitillo',         cantidad:12,  precioVenta:80,  totalVenta:960,   cantComprada:12,  costoM3:41,   totalCosto:492,   ganancia:468},
    {id:99, fecha:'2026-05-18',cliente:'silva',       pagado:'NO', material:'arena gruesa',       cantidad:8,   precioVenta:60,  totalVenta:480,   cantComprada:8,   costoM3:37,   totalCosto:296,   ganancia:184},
    {id:100,fecha:'2026-05-18',cliente:'silva',       pagado:'NO', material:'confitillo',         cantidad:8,   precioVenta:70,  totalVenta:560,   cantComprada:8,   costoM3:41,   totalCosto:328,   ganancia:232},
    {id:101,fecha:'2026-05-19',cliente:'josue',       pagado:'SI', material:'confitillo',         cantidad:7,   precioVenta:70,  totalVenta:490,   cantComprada:7,   costoM3:41,   totalCosto:287,   ganancia:203},
    {id:102,fecha:'2026-05-19',cliente:'josue',       pagado:'SI', material:'arena gruesa',       cantidad:7,   precioVenta:55,  totalVenta:385,   cantComprada:7,   costoM3:37,   totalCosto:259,   ganancia:126},
    {id:103,fecha:'2026-05-19',cliente:'pedro',       pagado:'SI', material:'arena gruesa',       cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:46},
    {id:104,fecha:'2026-05-19',cliente:'greda',       pagado:'SI', material:'greda',              cantidad:1,   precioVenta:200, totalVenta:200,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:200},
    {id:105,fecha:'2026-05-19',cliente:'evitamiento', pagado:'SI', material:'ormigon',            cantidad:4,   precioVenta:65,  totalVenta:260,   cantComprada:4,   costoM3:41,   totalCosto:164,   ganancia:96},
    {id:106,fecha:'2026-05-19',cliente:'jorge',       pagado:'SI', material:'ormigon',            cantidad:10,  precioVenta:55,  totalVenta:550,   cantComprada:10,  costoM3:41,   totalCosto:410,   ganancia:140},
    {id:107,fecha:'2026-05-20',cliente:'huaman',      pagado:'SI', material:'ormigon',            cantidad:12,  precioVenta:60,  totalVenta:720,   cantComprada:12,  costoM3:41,   totalCosto:492,   ganancia:228},
    {id:108,fecha:'2026-05-20',cliente:'talledo',     pagado:'SI', material:'piedra chancada',    cantidad:3,   precioVenta:100, totalVenta:300,   cantComprada:3,   costoM3:68,   totalCosto:204,   ganancia:96},
    {id:109,fecha:'2026-05-20',cliente:'silva',       pagado:'NO', material:'arena fina',         cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:30,   totalCosto:60,    ganancia:60},
    {id:110,fecha:'2026-05-20',cliente:'rubio',       pagado:'SI', material:'arena fina',         cantidad:1.5, precioVenta:60,  totalVenta:90,    cantComprada:1.5, costoM3:30,   totalCosto:45,    ganancia:45},
    {id:111,fecha:'2026-05-20',cliente:'pablo',       pagado:'SI', material:'arena fina',         cantidad:1,   precioVenta:60,  totalVenta:60,    cantComprada:1,   costoM3:30,   totalCosto:30,    ganancia:30},
    {id:112,fecha:'2026-05-20',cliente:'pancho',      pagado:'SI', material:'ormigon',            cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:41,   totalCosto:82,    ganancia:38},
    {id:113,fecha:'2026-05-20',cliente:'huaman',      pagado:'SI', material:'piedra pilca',       cantidad:4,   precioVenta:75,  totalVenta:300,   cantComprada:3.5, costoM3:65,   totalCosto:227.5, ganancia:72.5},
    {id:114,fecha:'2026-05-20',cliente:'pablo',       pagado:'SI', material:'confitillo',         cantidad:1,   precioVenta:70,  totalVenta:70,    cantComprada:1,   costoM3:41,   totalCosto:41,    ganancia:29},
    {id:115,fecha:'2026-05-21',cliente:'huaman',      pagado:'SI', material:'pilca',              cantidad:3.5, precioVenta:75,  totalVenta:262.5, cantComprada:3,   costoM3:65,   totalCosto:195,   ganancia:67.5},
    {id:116,fecha:'2026-05-21',cliente:'3 regiones',  pagado:'NO', material:'arena gruesa',       cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:46},
    {id:117,fecha:'2026-05-21',cliente:'centenario',  pagado:'SI', material:'arena gruesa',       cantidad:3,   precioVenta:60,  totalVenta:180,   cantComprada:3,   costoM3:37,   totalCosto:111,   ganancia:69},
    {id:118,fecha:'2026-05-21',cliente:'centenario',  pagado:'SI', material:'confitillo',         cantidad:3,   precioVenta:70,  totalVenta:210,   cantComprada:3,   costoM3:41,   totalCosto:123,   ganancia:87},
    {id:119,fecha:'2026-05-21',cliente:'bulebar',     pagado:'SI', material:'arena gruesa',       cantidad:3,   precioVenta:65,  totalVenta:195,   cantComprada:3,   costoM3:37,   totalCosto:111,   ganancia:84},
    {id:120,fecha:'2026-05-21',cliente:'lucho ramires',pagado:'SI',material:'ormigon',            cantidad:3,   precioVenta:60,  totalVenta:180,   cantComprada:3,   costoM3:41,   totalCosto:123,   ganancia:57},
    {id:121,fecha:'2026-05-21',cliente:'cruz',        pagado:'NO', material:'arena gruesa',       cantidad:6,   precioVenta:55,  totalVenta:330,   cantComprada:6,   costoM3:37,   totalCosto:222,   ganancia:108},
    {id:122,fecha:'2026-05-21',cliente:'wilmer',      pagado:'SI', material:'arena gruesa',       cantidad:3,   precioVenta:50,  totalVenta:150,   cantComprada:3,   costoM3:37,   totalCosto:111,   ganancia:39},
    {id:123,fecha:'2026-05-21',cliente:'wilmer',      pagado:'SI', material:'confitillo',         cantidad:1,   precioVenta:70,  totalVenta:70,    cantComprada:1,   costoM3:41,   totalCosto:41,    ganancia:29},
    {id:124,fecha:'2026-05-21',cliente:'huaman',      pagado:'SI', material:'ormigon',            cantidad:4,   precioVenta:60,  totalVenta:240,   cantComprada:4,   costoM3:41,   totalCosto:164,   ganancia:76},
    {id:125,fecha:'2026-05-21',cliente:'huaman',      pagado:'SI', material:'pilca',              cantidad:2,   precioVenta:75,  totalVenta:150,   cantComprada:1.5, costoM3:65,   totalCosto:97.5,  ganancia:52.5},
    {id:126,fecha:'2026-05-22',cliente:'huaman',      pagado:'SI', material:'ormigon',            cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:41,   totalCosto:82,    ganancia:38},
    {id:127,fecha:'2026-05-22',cliente:'ruiis gallo', pagado:'SI', material:'desmonte',           cantidad:1,   precioVenta:210, totalVenta:210,   cantComprada:0,   costoM3:0,    totalCosto:0,     ganancia:210},
    {id:128,fecha:'2026-05-22',cliente:'atlantis',    pagado:'SI', material:'ormigon',            cantidad:1,   precioVenta:60,  totalVenta:60,    cantComprada:1,   costoM3:41,   totalCosto:41,    ganancia:19},
    {id:129,fecha:'2026-05-22',cliente:'por centenario',pagado:'SI',material:'arena gruesa',      cantidad:2,   precioVenta:60,  totalVenta:120,   cantComprada:2,   costoM3:37,   totalCosto:74,    ganancia:46},
  ],
  gastos: [
    {id:1,fecha:'2026-04-23',descripcion:'Comida',monto:50},{id:2,fecha:'2026-04-23',descripcion:'Combustible',monto:180},
    {id:3,fecha:'2026-04-24',descripcion:'Puesta de faros',monto:70},{id:4,fecha:'2026-04-24',descripcion:'Focos',monto:85},
    {id:5,fecha:'2026-04-24',descripcion:'Comida',monto:40},{id:6,fecha:'2026-04-24',descripcion:'Electrostática',monto:40},
    {id:7,fecha:'2026-04-25',descripcion:'Pintura',monto:1000},{id:8,fecha:'2026-04-27',descripcion:'Comida',monto:20},
    {id:9,fecha:'2026-04-28',descripcion:'Petroleo',monto:465},{id:10,fecha:'2026-04-28',descripcion:'Comida',monto:50},
    {id:11,fecha:'2026-04-29',descripcion:'Comida',monto:50},{id:12,fecha:'2026-04-30',descripcion:'Comida',monto:50},
    {id:13,fecha:'2026-04-30',descripcion:'Pintura',monto:1000},{id:14,fecha:'2026-04-30',descripcion:'Parabrisa',monto:400},
    {id:15,fecha:'2026-05-01',descripcion:'Comida',monto:60},{id:16,fecha:'2026-05-02',descripcion:'Comida',monto:50},
    {id:17,fecha:'2026-05-04',descripcion:'Petroleo',monto:532.79},{id:18,fecha:'2026-05-04',descripcion:'Comida',monto:40},
    {id:19,fecha:'2026-05-05',descripcion:'Pintura',monto:900},{id:20,fecha:'2026-05-05',descripcion:'Comida',monto:30},
    {id:21,fecha:'2026-05-05',descripcion:'Petroleo',monto:140},{id:22,fecha:'2026-05-06',descripcion:'Petroleo',monto:470},
    {id:23,fecha:'2026-05-06',descripcion:'Comida',monto:45},{id:24,fecha:'2026-05-07',descripcion:'Comida',monto:50},
    {id:25,fecha:'2026-05-08',descripcion:'Petroleo',monto:468},{id:26,fecha:'2026-05-08',descripcion:'Comida',monto:30},
    {id:27,fecha:'2026-05-09',descripcion:'Comida',monto:40},{id:28,fecha:'2026-05-09',descripcion:'Cableado',monto:600},
    {id:29,fecha:'2026-05-11',descripcion:'Electrico',monto:800},{id:30,fecha:'2026-05-11',descripcion:'Comida',monto:20},
    {id:31,fecha:'2026-05-11',descripcion:'Comida',monto:40},{id:32,fecha:'2026-05-12',descripcion:'Petroleo',monto:319},
    {id:33,fecha:'2026-05-13',descripcion:'Comida',monto:30},{id:34,fecha:'2026-05-14',descripcion:'Comida',monto:30},
    {id:35,fecha:'2026-05-14',descripcion:'Combustible',monto:500},{id:36,fecha:'2026-05-15',descripcion:'Piso',monto:700},
    {id:37,fecha:'2026-05-16',descripcion:'Petroleo',monto:137},{id:38,fecha:'2026-05-16',descripcion:'Comida',monto:50},
    {id:39,fecha:'2026-05-16',descripcion:'Filtros carro',monto:684},{id:40,fecha:'2026-05-18',descripcion:'Petroleo',monto:212},
    {id:41,fecha:'2026-05-18',descripcion:'Comida',monto:30},{id:42,fecha:'2026-05-19',descripcion:'Comida',monto:40},
    {id:43,fecha:'2026-05-19',descripcion:'Petroleo',monto:562.5},{id:44,fecha:'2026-05-20',descripcion:'Comida',monto:40},
    {id:45,fecha:'2026-05-21',descripcion:'Comida',monto:40},{id:46,fecha:'2026-05-21',descripcion:'Petroleo',monto:220},
    {id:47,fecha:'2026-05-21',descripcion:'Soportes máquina',monto:200},{id:48,fecha:'2026-05-22',descripcion:'Comida',monto:35},
  ],
  compras: [
    {id:1,fecha:'2026-04-23',agregado:'ormigon',cantidad:20,costo:900,costoM3:45},
    {id:2,fecha:'2026-04-23',agregado:'arena gruesa',cantidad:22,costo:820,costoM3:37.27},
    {id:3,fecha:'2026-04-23',agregado:'arena fina',cantidad:20,costo:600,costoM3:30},
    {id:4,fecha:'2026-04-23',agregado:'confitillo',cantidad:12,costo:430,costoM3:35.83},
    {id:5,fecha:'2026-04-23',agregado:'piedra chancada',cantidad:22,costo:1500,costoM3:68.18},
    {id:6,fecha:'2026-05-04',agregado:'arena gruesa',cantidad:22,costo:820,costoM3:37.27},
    {id:7,fecha:'2026-05-04',agregado:'confitillo',cantidad:8,costo:280,costoM3:35},
    {id:8,fecha:'2026-05-05',agregado:'ormigon',cantidad:22,costo:900,costoM3:40.91},
    {id:9,fecha:'2026-05-05',agregado:'arena fina',cantidad:22,costo:650,costoM3:29.55},
    {id:10,fecha:'2026-05-05',agregado:'confitillo',cantidad:22,costo:900,costoM3:40.91},
    {id:11,fecha:'2026-05-06',agregado:'pilca',cantidad:null,costo:280,costoM3:null},
    {id:12,fecha:'2026-05-06',agregado:'ormigon',cantidad:22,costo:900,costoM3:40.91},
    {id:13,fecha:'2026-05-06',agregado:'arena gruesa',cantidad:22,costo:820,costoM3:37.27},
    {id:14,fecha:'2026-05-12',agregado:'ormigon',cantidad:22,costo:900,costoM3:40.91},
    {id:15,fecha:'2026-05-14',agregado:'arena gruesa',cantidad:22,costo:820,costoM3:37.27},
    {id:16,fecha:'2026-05-18',agregado:'ormigon',cantidad:22,costo:900,costoM3:40.91},
    {id:17,fecha:'2026-05-19',agregado:'arena gruesa',cantidad:22,costo:820,costoM3:37.27},
    {id:18,fecha:'2026-05-19',agregado:'arena gruesa',cantidad:22,costo:820,costoM3:37.27},
    {id:19,fecha:'2026-05-20',agregado:'confitillo',cantidad:44,costo:1800,costoM3:40.91},
    {id:20,fecha:'2026-05-21',agregado:'arena fina',cantidad:22,costo:600,costoM3:27.27},
  ],
  prestamos: [
    {id:1,nombre:'Préstamo 1',monto:2181,fecha:'2026-05-01'},
    {id:2,nombre:'Préstamo 2',monto:3790,fecha:'2026-05-01'},
    {id:3,nombre:'Préstamo 3',monto:700, fecha:'2026-05-01'},
  ],
};

/* Función para cargar el seed en Firebase (solo primera vez) */
async function seedFirebase() {
  if (!DB_STATUS.online) return;
  try {
    const res = await fetch(fbUrl('ventas'));
    const existing = await res.json();
    if (existing && Object.keys(existing).length > 0) return; // Ya hay datos
    console.log('[DB] Cargando datos iniciales en Firebase...');
    for (const table of ['ventas','gastos','compras','prestamos']) {
      for (const rec of SEED[table]) await fbPut(table, rec);
    }
    await fbPut('config', { key:'settings', capitalInicial:3000, diasTrabajados:26, mesActivo:'todos' });
    console.log('[DB] Seed completado ✓');
  } catch(e) { console.warn('[DB] seed error', e.message); }
}

DB.seedFirebase = seedFirebase;