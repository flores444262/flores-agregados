/* ================================================================
   FLORES AGREGADOS — db.js v5
   Firebase ya enlazado — conecta automático en cualquier dispositivo
================================================================ */

const FIREBASE_URL = 'https://dbfloresagregados-default-rtdb.firebaseio.com';

const DB_STATUS = { online: false };

// ── REST helpers ─────────────────────────────────────────────────
const fbUrl = (table, id='') =>
  `${FIREBASE_URL}/${table}${id ? '/'+id : ''}.json`;

async function fbGet(table) {
  const res = await fetch(fbUrl(table));
  if (!res.ok) throw new Error('GET ' + res.status);
  const data = await res.json();
  if (!data) return [];
  return Object.values(data).filter(Boolean);
}

async function fbPut(table, record) {
  if (!record || record.id == null) return;
  const res = await fetch(fbUrl(table, record.id), {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('PUT ' + res.status);
}

async function fbDel(table, id) {
  const res = await fetch(fbUrl(table, id), {method:'DELETE'});
  if (!res.ok) throw new Error('DEL ' + res.status);
}

// ── API pública ──────────────────────────────────────────────────
const DB = {

  async init() {
    try {
      const res = await fetch(fbUrl('config', 'settings'));
      DB_STATUS.online = res.ok || res.status === 404; // 404 = vacío pero accesible
      return DB_STATUS.online;
    } catch(e) {
      DB_STATUS.online = false;
      return false;
    }
  },

  async getAll(table) {
    if (!DB_STATUS.online) return [];
    try { return await fbGet(table); }
    catch(e) { console.warn('[DB] getAll', table, e.message); return []; }
  },

  getVentas:    () => DB.getAll('ventas'),
  getGastos:    () => DB.getAll('gastos'),
  getCompras:   () => DB.getAll('compras'),
  getPrestamos: () => DB.getAll('prestamos'),

  async getConfig() {
    if (!DB_STATUS.online) return null;
    try {
      const res = await fetch(fbUrl('config','settings'));
      const d = await res.json();
      return d || null;
    } catch(e) { return null; }
  },

  async save(table, record) {
    if (!DB_STATUS.online || !record) return;
    try { await fbPut(table, record); }
    catch(e) { console.warn('[DB] save', e.message); }
  },

  async del(table, id) {
    if (!DB_STATUS.online) return;
    try { await fbDel(table, id); }
    catch(e) { console.warn('[DB] del', e.message); }
  },

  async saveConfig(obj) {
    if (!DB_STATUS.online) return;
    try { await fbPut('config', {id:'settings', key:'settings', ...obj}); }
    catch(e) { console.warn('[DB] saveConfig', e.message); }
  },

  setFirebaseUrl(url) {
    // No se usa (URL ya está fija en el código)
    console.log('URL fija en db.js:', FIREBASE_URL);
  },
};

// ── Actualizar UI de sincronización ─────────────────────────────
function updateSyncUI(state) {
  const pill = document.getElementById('sync-pill');
  if (pill) {
    pill.className = `sync-pill ${state}`;
    const pl = pill.querySelector('.pill-label');
    if (pl) pl.textContent =
      state==='online' ? 'Firebase OK' :
      state==='syncing'? 'Sincronizando...' : 'Local';
  }
  const ss = document.getElementById('sync-status');
  if (ss) {
    ss.className = `sync-status ${state}`;
    const lbl = ss.querySelector('#dot-label');
    if (lbl) lbl.textContent =
      state==='online'  ? '🟢 Firebase OK' :
      state==='syncing' ? '🟡 Sincronizando...' : '🔴 Local (sin Firebase)';
  }
}