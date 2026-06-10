/* ============================================================
   FLORES AGREGADOS — app.js  v2
   Datos completos Abr-May 2026 + filtro por mes
   ============================================================ */

// ═══════════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ═══════════════════════════════════════════════════════════
const STATE = {
  capitalInicial: 3000,
  ventas: [],
  gastos: [],
  compras: [],
  prestamos: [],
  diasTrabajados: 26,
  mesActivo: 'todos',   // 'todos' | '2026-04' | '2026-05' | ...
  editingVenta: null,
  editingGasto: null,
  editingCompra: null,
};

// ═══════════════════════════════════════════════════════════
//  DATOS INICIALES COMPLETOS DEL EXCEL (129 pedidos)
// ═══════════════════════════════════════════════════════════
const VENTAS_INICIALES = [
  // ── ABRIL 2026 ──
  {id:1,  fecha:"2026-04-23",cliente:"pedro",    pagado:"SI",material:"arena fina",       cantidad:2,  precioVenta:50,  totalVenta:100,  cantComprada:2,   costoM3:30, totalCosto:60,   ganancia:40},
  {id:2,  fecha:"2026-04-23",cliente:"pedro",    pagado:"SI",material:"arena gruesa",      cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:3,  fecha:"2026-04-23",cliente:"enoc",     pagado:"SI",material:"piedra chancada",   cantidad:12, precioVenta:85,  totalVenta:1020, cantComprada:10,  costoM3:80, totalCosto:800,  ganancia:220},
  {id:4,  fecha:"2026-04-23",cliente:"enoc",     pagado:"SI",material:"arena gruesa",      cantidad:12, precioVenta:50,  totalVenta:600,  cantComprada:10,  costoM3:38, totalCosto:380,  ganancia:220},
  {id:5,  fecha:"2026-04-23",cliente:"jardines", pagado:"SI",material:"ormigon",           cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:30},
  {id:6,  fecha:"2026-04-23",cliente:"yoja",     pagado:"SI",material:"ormigon",           cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:5.5, costoM3:45, totalCosto:247.5,ganancia:112.5},
  {id:7,  fecha:"2026-04-23",cliente:"pedro",    pagado:"SI",material:"ormigon",           cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:30},
  {id:8,  fecha:"2026-04-23",cliente:"lavan",    pagado:"SI",material:"ormigon",           cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:2.5, costoM3:45, totalCosto:112.5,ganancia:67.5},
  {id:9,  fecha:"2026-04-23",cliente:"consuelo", pagado:"SI",material:"arena gruesa",      cantidad:4,  precioVenta:50,  totalVenta:200,  cantComprada:3.5, costoM3:38, totalCosto:133,  ganancia:67},
  {id:10, fecha:"2026-04-23",cliente:"consuelo", pagado:"SI",material:"confitillo",        cantidad:4,  precioVenta:70,  totalVenta:280,  cantComprada:3.5, costoM3:50, totalCosto:175,  ganancia:105},
  {id:11, fecha:"2026-04-23",cliente:"duber",    pagado:"SI",material:"ormigon",           cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:3.5, costoM3:47, totalCosto:164.5,ganancia:75.5},
  {id:12, fecha:"2026-04-23",cliente:"duber",    pagado:"SI",material:"pilca",             cantidad:3,  precioVenta:70,  totalVenta:210,  cantComprada:2.5, costoM3:65, totalCosto:162.5,ganancia:47.5},
  {id:13, fecha:"2026-04-24",cliente:"duber",    pagado:"SI",material:"arena gruesa",      cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:14, fecha:"2026-04-24",cliente:"duver",    pagado:"SI",material:"confitillo",        cantidad:1.5,precioVenta:70,  totalVenta:105,  cantComprada:1.5, costoM3:50, totalCosto:75,   ganancia:30},
  {id:15, fecha:"2026-04-24",cliente:"darwin",   pagado:"SI",material:"confitillo",        cantidad:4,  precioVenta:70,  totalVenta:280,  cantComprada:4,   costoM3:50, totalCosto:200,  ganancia:80},
  {id:16, fecha:"2026-04-25",cliente:"darwin",   pagado:"NO",material:"arena gruesa",      cantidad:3,  precioVenta:55,  totalVenta:165,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:51},
  {id:17, fecha:"2026-04-25",cliente:"darwin",   pagado:"NO",material:"confitillo",        cantidad:2.5,precioVenta:70,  totalVenta:175,  cantComprada:2.5, costoM3:50, totalCosto:125,  ganancia:50},
  {id:18, fecha:"2026-04-27",cliente:"",         pagado:"SI",material:"desmonte",          cantidad:7,  precioVenta:100, totalVenta:700,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:700},
  {id:19, fecha:"2026-04-27",cliente:"lavan",    pagado:"SI",material:"piedra chancada",   cantidad:3,  precioVenta:90,  totalVenta:270,  cantComprada:3,   costoM3:90, totalCosto:270,  ganancia:0},
  {id:20, fecha:"2026-04-27",cliente:"silva",    pagado:"SI",material:"arena gruesa",      cantidad:2,  precioVenta:55,  totalVenta:110,  cantComprada:2,   costoM3:55, totalCosto:110,  ganancia:0},
  {id:21, fecha:"2026-04-27",cliente:"nailin",   pagado:"SI",material:"piedra chancada",   cantidad:4,  precioVenta:90,  totalVenta:360,  cantComprada:4,   costoM3:70, totalCosto:280,  ganancia:80},
  {id:22, fecha:"2026-04-28",cliente:"pedro",    pagado:"SI",material:"arena gruesa",      cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:23, fecha:"2026-04-28",cliente:"pedro",    pagado:"SI",material:"confitillo",        cantidad:2,  precioVenta:70,  totalVenta:140,  cantComprada:2,   costoM3:50, totalCosto:100,  ganancia:40},
  {id:24, fecha:"2026-04-28",cliente:"yoja",     pagado:"SI",material:"arena gruesa",      cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:6,   costoM3:60, totalCosto:360,  ganancia:0},
  {id:25, fecha:"2026-04-28",cliente:"desmonte", pagado:"SI",material:"desmonte",          cantidad:36, precioVenta:20,  totalVenta:720,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:720},
  {id:26, fecha:"2026-04-28",cliente:"consuelo", pagado:"SI",material:"arena fina",        cantidad:3,  precioVenta:50,  totalVenta:150,  cantComprada:3,   costoM3:30, totalCosto:90,   ganancia:60},
  {id:27, fecha:"2026-04-29",cliente:"zorro",    pagado:"SI",material:"ormigon",           cantidad:8,  precioVenta:58,  totalVenta:464,  cantComprada:8,   costoM3:47, totalCosto:376,  ganancia:88},
  {id:28, fecha:"2026-04-29",cliente:"desmonte", pagado:"SI",material:"desmonte",          cantidad:36, precioVenta:20,  totalVenta:720,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:720},
  {id:29, fecha:"2026-04-30",cliente:"desmonte", pagado:"SI",material:"desmonte",          cantidad:24, precioVenta:30,  totalVenta:720,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:720},
  // ── MAYO 2026 ──
  {id:30, fecha:"2026-05-01",cliente:"nayra",    pagado:"SI",material:"arena gruesa rio",  cantidad:12, precioVenta:60,  totalVenta:720,  cantComprada:1,   costoM3:100,totalCosto:100,  ganancia:620},
  {id:31, fecha:"2026-05-01",cliente:"naira",    pagado:"SI",material:"confitillo",        cantidad:10, precioVenta:70,  totalVenta:700,  cantComprada:10,  costoM3:55, totalCosto:550,  ganancia:150},
  {id:32, fecha:"2026-05-01",cliente:"nailin",   pagado:"SI",material:"arena fina",        cantidad:4,  precioVenta:50,  totalVenta:200,  cantComprada:4,   costoM3:30, totalCosto:120,  ganancia:80},
  {id:33, fecha:"2026-05-01",cliente:"consuelo", pagado:"SI",material:"arena gruesa",      cantidad:4,  precioVenta:50,  totalVenta:200,  cantComprada:4,   costoM3:38, totalCosto:152,  ganancia:48},
  {id:34, fecha:"2026-05-01",cliente:"carlos",   pagado:"NO",material:"piedra chancada",   cantidad:3,  precioVenta:80,  totalVenta:240,  cantComprada:3,   costoM3:70, totalCosto:210,  ganancia:30},
  {id:35, fecha:"2026-05-01",cliente:"carlos",   pagado:"NO",material:"arena gruesa",      cantidad:3,  precioVenta:50,  totalVenta:150,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:36},
  {id:36, fecha:"2026-05-01",cliente:"silva",    pagado:"SI",material:"arena fina",        cantidad:2,  precioVenta:50,  totalVenta:100,  cantComprada:2,   costoM3:30, totalCosto:60,   ganancia:40},
  {id:37, fecha:"2026-05-01",cliente:"pancho",   pagado:"SI",material:"piedra chancada",   cantidad:1.5,precioVenta:100, totalVenta:150,  cantComprada:1.5, costoM3:70, totalCosto:105,  ganancia:45},
  {id:38, fecha:"2026-05-01",cliente:"pancho",   pagado:"SI",material:"arena gruesa",      cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:66},
  {id:39, fecha:"2026-05-02",cliente:"jonatan",  pagado:"SI",material:"arena gruesa",      cantidad:7,  precioVenta:50,  totalVenta:350,  cantComprada:6.5, costoM3:38, totalCosto:247,  ganancia:103},
  {id:40, fecha:"2026-05-02",cliente:"jonatan",  pagado:"SI",material:"piedra chancada",   cantidad:7,  precioVenta:90,  totalVenta:630,  cantComprada:6,   costoM3:80, totalCosto:480,  ganancia:150},
  {id:41, fecha:"2026-05-02",cliente:"consuelo", pagado:"SI",material:"arena gruesa",      cantidad:3,  precioVenta:50,  totalVenta:150,  cantComprada:2.5, costoM3:38, totalCosto:95,   ganancia:55},
  {id:42, fecha:"2026-05-02",cliente:"consuelo", pagado:"SI",material:"piedra chancada",   cantidad:3,  precioVenta:80,  totalVenta:240,  cantComprada:2.5, costoM3:70, totalCosto:175,  ganancia:65},
  {id:43, fecha:"2026-05-02",cliente:"cruz",     pagado:"SI",material:"arena gruesa",      cantidad:7,  precioVenta:55,  totalVenta:385,  cantComprada:7,   costoM3:38, totalCosto:266,  ganancia:119},
  {id:44, fecha:"2026-05-02",cliente:"cruz",     pagado:"SI",material:"confitillo",        cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:50, totalCosto:100,  ganancia:20},
  {id:45, fecha:"2026-05-04",cliente:"pedro",    pagado:"SI",material:"arena gruesa",      cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:46, fecha:"2026-05-04",cliente:"neyra",    pagado:"SI",material:"ormigon",           cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:6,   costoM3:45, totalCosto:270,  ganancia:90},
  {id:47, fecha:"2026-05-04",cliente:"neyra",    pagado:"SI",material:"piedra pilca",      cantidad:4,  precioVenta:68,  totalVenta:272,  cantComprada:4,   costoM3:50, totalCosto:200,  ganancia:72},
  {id:48, fecha:"2026-05-04",cliente:"manuel",   pagado:"SI",material:"confitillo",        cantidad:12, precioVenta:68,  totalVenta:816,  cantComprada:11.5,costoM3:55, totalCosto:632.5,ganancia:183.5},
  {id:49, fecha:"2026-05-05",cliente:"pedro",    pagado:"SI",material:"ormigon",           cantidad:3.5,precioVenta:60,  totalVenta:210,  cantComprada:3.5, costoM3:45, totalCosto:157.5,ganancia:52.5},
  {id:50, fecha:"2026-05-05",cliente:"nayra",    pagado:"SI",material:"ormigon",           cantidad:5,  precioVenta:60,  totalVenta:300,  cantComprada:4.5, costoM3:45, totalCosto:202.5,ganancia:97.5},
  {id:51, fecha:"2026-05-05",cliente:"nayra",    pagado:"SI",material:"pilca",             cantidad:2,  precioVenta:75,  totalVenta:150,  cantComprada:1.5, costoM3:50, totalCosto:75,   ganancia:75},
  {id:52, fecha:"2026-05-05",cliente:"silva",    pagado:"SI",material:"arena gruesa",      cantidad:12, precioVenta:50,  totalVenta:600,  cantComprada:12,  costoM3:38, totalCosto:456,  ganancia:144},
  {id:53, fecha:"2026-05-05",cliente:"wilmer",   pagado:"SI",material:"ormigon",           cantidad:12, precioVenta:50,  totalVenta:600,  cantComprada:11,  costoM3:45, totalCosto:495,  ganancia:105},
  {id:54, fecha:"2026-05-05",cliente:"colorada", pagado:"SI",material:"ormigon",           cantidad:6,  precioVenta:68,  totalVenta:408,  cantComprada:6,   costoM3:45, totalCosto:270,  ganancia:138},
  {id:55, fecha:"2026-05-06",cliente:"wilmer",   pagado:"SI",material:"piedra pilca",      cantidad:12, precioVenta:70,  totalVenta:840,  cantComprada:10,  costoM3:28, totalCosto:280,  ganancia:560},
  {id:56, fecha:"2026-05-06",cliente:"neyra",    pagado:"SI",material:"arena gruesa",      cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:66},
  {id:57, fecha:"2026-05-06",cliente:"neyra",    pagado:"SI",material:"confitillo",        cantidad:1,  precioVenta:70,  totalVenta:70,   cantComprada:1,   costoM3:45, totalCosto:45,   ganancia:25},
  {id:58, fecha:"2026-05-06",cliente:"ing",      pagado:"SI",material:"piedra pilca",      cantidad:9,  precioVenta:80,  totalVenta:720,  cantComprada:9,   costoM3:68, totalCosto:612,  ganancia:108},
  {id:59, fecha:"2026-05-07",cliente:"colorada", pagado:"SI",material:"ormigon",           cantidad:1,  precioVenta:60,  totalVenta:60,   cantComprada:1,   costoM3:45, totalCosto:45,   ganancia:15},
  {id:60, fecha:"2026-05-07",cliente:"yojan",    pagado:"SI",material:"arena gruesa",      cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:4,   costoM3:38, totalCosto:152,  ganancia:208},
  {id:61, fecha:"2026-05-07",cliente:"yojan",    pagado:"SI",material:"confitillo",        cantidad:3,  precioVenta:70,  totalVenta:210,  cantComprada:2.5, costoM3:45, totalCosto:112.5,ganancia:97.5},
  {id:62, fecha:"2026-05-07",cliente:"wilmer",   pagado:"SI",material:"pilca",             cantidad:8,  precioVenta:75,  totalVenta:600,  cantComprada:7,   costoM3:70, totalCosto:490,  ganancia:110},
  {id:63, fecha:"2026-05-08",cliente:"real plaza",pagado:"SI",material:"desmonte",         cantidad:12, precioVenta:12.5,totalVenta:150,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:150},
  {id:64, fecha:"2026-05-08",cliente:"real plaza",pagado:"SI",material:"afirmado",         cantidad:1,  precioVenta:700, totalVenta:700,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:700},
  {id:65, fecha:"2026-05-08",cliente:"yojan",    pagado:"SI",material:"ormigon",           cantidad:4,  precioVenta:70,  totalVenta:280,  cantComprada:3.5, costoM3:45, totalCosto:157.5,ganancia:122.5},
  {id:66, fecha:"2026-05-08",cliente:"yojan",    pagado:"SI",material:"pilca",             cantidad:4,  precioVenta:90,  totalVenta:360,  cantComprada:3.5, costoM3:70, totalCosto:245,  ganancia:115},
  {id:67, fecha:"2026-05-08",cliente:"pedro",    pagado:"SI",material:"piedra chancada",   cantidad:1,  precioVenta:80,  totalVenta:80,   cantComprada:1,   costoM3:70, totalCosto:70,   ganancia:10},
  {id:68, fecha:"2026-05-08",cliente:"pedro",    pagado:"SI",material:"arena gruesa",      cantidad:1,  precioVenta:60,  totalVenta:60,   cantComprada:1,   costoM3:38, totalCosto:38,   ganancia:22},
  {id:69, fecha:"2026-05-09",cliente:"union",    pagado:"SI",material:"arena gruesa",      cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:4,   costoM3:38, totalCosto:152,  ganancia:88},
  {id:70, fecha:"2026-05-11",cliente:"cruz",     pagado:"SI",material:"ormigon",           cantidad:15, precioVenta:60,  totalVenta:900,  cantComprada:15,  costoM3:45, totalCosto:675,  ganancia:225},
  {id:71, fecha:"2026-05-11",cliente:"wilmer",   pagado:"SI",material:"arena gruesa",      cantidad:10, precioVenta:50,  totalVenta:500,  cantComprada:9.5, costoM3:38, totalCosto:361,  ganancia:139},
  {id:72, fecha:"2026-05-11",cliente:"raul",     pagado:"SI",material:"arena gruesa",      cantidad:7,  precioVenta:50,  totalVenta:350,  cantComprada:6.5, costoM3:38, totalCosto:247,  ganancia:103},
  {id:73, fecha:"2026-05-07",cliente:"confitillo",pagado:"SI",material:"tiki",             cantidad:4.5,precioVenta:60,  totalVenta:270,  cantComprada:4.5, costoM3:50, totalCosto:225,  ganancia:45},
  {id:74, fecha:"2026-05-11",cliente:"raul",     pagado:"SI",material:"confitillo",        cantidad:5,  precioVenta:70,  totalVenta:350,  cantComprada:5,   costoM3:45, totalCosto:225,  ganancia:125},
  {id:75, fecha:"2026-05-12",cliente:"cruz",     pagado:"SI",material:"desmonte",          cantidad:1,  precioVenta:350, totalVenta:350,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:350},
  {id:76, fecha:"2026-05-12",cliente:"josue",    pagado:"SI",material:"arena de chacra",   cantidad:1,  precioVenta:300, totalVenta:300,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:300},
  {id:77, fecha:"2026-05-12",cliente:"cesar",    pagado:"SI",material:"ormigon",           cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:3.5, costoM3:45, totalCosto:157.5,ganancia:82.5},
  {id:78, fecha:"2026-05-12",cliente:"pedro",    pagado:"SI",material:"arena gruesa",      cantidad:3.5,precioVenta:60,  totalVenta:210,  cantComprada:3.5, costoM3:38, totalCosto:133,  ganancia:77},
  {id:79, fecha:"2026-05-12",cliente:"pedro",    pagado:"SI",material:"piedra chancada",   cantidad:3,  precioVenta:100, totalVenta:300,  cantComprada:3,   costoM3:80, totalCosto:240,  ganancia:60},
  {id:80, fecha:"2026-05-13",cliente:"silva",    pagado:"SI",material:"arena fina",        cantidad:2,  precioVenta:50,  totalVenta:100,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:24},
  {id:81, fecha:"2026-05-13",cliente:"huaman",   pagado:"SI",material:"ormigon",           cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:45, totalCosto:135,  ganancia:45},
  {id:82, fecha:"2026-05-13",cliente:"zona industrial",pagado:"SI",material:"arena fina",  cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:30, totalCosto:60,   ganancia:60},
  {id:83, fecha:"2026-05-14",cliente:"tierra chacra",pagado:"SI",material:"tierra de chacra",cantidad:18,precioVenta:50, totalVenta:900,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:900},
  {id:84, fecha:"2026-05-14",cliente:"huaman",   pagado:"SI",material:"ormigon",           cantidad:7,  precioVenta:60,  totalVenta:420,  cantComprada:7,   costoM3:45, totalCosto:315,  ganancia:105},
  {id:85, fecha:"2026-05-15",cliente:"desmonte", pagado:"SI",material:"desmonte",          cantidad:48, precioVenta:20,  totalVenta:960,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:960},
  {id:86, fecha:"2026-05-15",cliente:"silva",    pagado:"SI",material:"relleno",           cantidad:1,  precioVenta:100, totalVenta:100,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:100},
  {id:87, fecha:"2026-05-15",cliente:"talledo",  pagado:"SI",material:"arena gruesa",      cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:4,   costoM3:38, totalCosto:152,  ganancia:88},
  {id:88, fecha:"2026-05-15",cliente:"talledo",  pagado:"SI",material:"piedra chancada",   cantidad:4,  precioVenta:100, totalVenta:400,  cantComprada:4,   costoM3:80, totalCosto:320,  ganancia:80},
  {id:89, fecha:"2026-05-15",cliente:"emilio",   pagado:"SI",material:"ormigon",           cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:6,   costoM3:45, totalCosto:270,  ganancia:90},
  {id:90, fecha:"2026-05-16",cliente:"nuevo talarita",pagado:"SI",material:"ormigon",      cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:45, totalCosto:135,  ganancia:45},
  {id:91, fecha:"2026-05-16",cliente:"emilio",   pagado:"SI",material:"piedra over",       cantidad:5.5,precioVenta:80,  totalVenta:440,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:440},
  {id:92, fecha:"2026-05-16",cliente:"raul",     pagado:"SI",material:"arena gruesa",      cantidad:2,  precioVenta:50,  totalVenta:100,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:24},
  {id:93, fecha:"2026-05-16",cliente:"raul",     pagado:"SI",material:"confitillo",        cantidad:2,  precioVenta:70,  totalVenta:140,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:50},
  {id:94, fecha:"2026-05-18",cliente:"pedro",    pagado:"SI",material:"piedra chancada",   cantidad:3.5,precioVenta:100, totalVenta:350,  cantComprada:3.5, costoM3:80, totalCosto:280,  ganancia:70},
  {id:95, fecha:"2026-05-18",cliente:"pedro",    pagado:"SI",material:"arena gruesa",      cantidad:3.5,precioVenta:60,  totalVenta:210,  cantComprada:3.5, costoM3:38, totalCosto:133,  ganancia:77},
  {id:96, fecha:"2026-05-18",cliente:"wilmer",   pagado:"SI",material:"ormigon",           cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:6,   costoM3:45, totalCosto:270,  ganancia:90},
  {id:97, fecha:"2026-05-18",cliente:"wilmer",   pagado:"SI",material:"piedra opilca",     cantidad:4,  precioVenta:90,  totalVenta:360,  cantComprada:4,   costoM3:70, totalCosto:280,  ganancia:80},
  {id:98, fecha:"2026-05-18",cliente:"manuel",   pagado:"SI",material:"confitillo",        cantidad:12, precioVenta:80,  totalVenta:960,  cantComprada:12,  costoM3:55, totalCosto:660,  ganancia:300},
  {id:99, fecha:"2026-05-18",cliente:"silva",    pagado:"NO",material:"arena gruesa",      cantidad:8,  precioVenta:60,  totalVenta:480,  cantComprada:8,   costoM3:38, totalCosto:304,  ganancia:176},
  {id:100,fecha:"2026-05-18",cliente:"silva",    pagado:"NO",material:"confitillo",        cantidad:8,  precioVenta:70,  totalVenta:560,  cantComprada:8,   costoM3:50, totalCosto:400,  ganancia:160},
  {id:101,fecha:"2026-05-19",cliente:"josue",    pagado:"SI",material:"confitillo",        cantidad:7,  precioVenta:70,  totalVenta:490,  cantComprada:7,   costoM3:55, totalCosto:385,  ganancia:105},
  {id:102,fecha:"2026-05-19",cliente:"josue",    pagado:"SI",material:"arena gruesa",      cantidad:7,  precioVenta:55,  totalVenta:385,  cantComprada:7,   costoM3:38, totalCosto:266,  ganancia:119},
  {id:103,fecha:"2026-05-19",cliente:"pedro",    pagado:"SI",material:"arena gruesa",      cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:104,fecha:"2026-05-19",cliente:"greda",    pagado:"SI",material:"greda",             cantidad:1,  precioVenta:200, totalVenta:200,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:200},
  {id:105,fecha:"2026-05-19",cliente:"evitamiento",pagado:"SI",material:"ormigon",         cantidad:4,  precioVenta:65,  totalVenta:260,  cantComprada:4,   costoM3:45, totalCosto:180,  ganancia:80},
  {id:106,fecha:"2026-05-19",cliente:"jorge",    pagado:"SI",material:"ormigon",           cantidad:10, precioVenta:55,  totalVenta:550,  cantComprada:10,  costoM3:45, totalCosto:450,  ganancia:100},
  {id:107,fecha:"2026-05-20",cliente:"huaman",   pagado:"SI",material:"ormigon",           cantidad:12, precioVenta:60,  totalVenta:720,  cantComprada:12,  costoM3:45, totalCosto:540,  ganancia:180},
  {id:108,fecha:"2026-05-20",cliente:"talledo",  pagado:"SI",material:"piedra chancada",   cantidad:3,  precioVenta:100, totalVenta:300,  cantComprada:3,   costoM3:80, totalCosto:240,  ganancia:60},
  {id:109,fecha:"2026-05-20",cliente:"silva",    pagado:"NO",material:"arena fina",        cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:30, totalCosto:60,   ganancia:60},
  {id:110,fecha:"2026-05-20",cliente:"rubio",    pagado:"SI",material:"arena fina",        cantidad:1.5,precioVenta:60,  totalVenta:90,   cantComprada:1.5, costoM3:30, totalCosto:45,   ganancia:45},
  {id:111,fecha:"2026-05-20",cliente:"pablo",    pagado:"SI",material:"arena fina",        cantidad:1,  precioVenta:60,  totalVenta:60,   cantComprada:1,   costoM3:30, totalCosto:30,   ganancia:30},
  {id:112,fecha:"2026-05-20",cliente:"pancho",   pagado:"SI",material:"ormigon",           cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:30},
  {id:113,fecha:"2026-05-20",cliente:"huaman",   pagado:"SI",material:"piedra pilca",      cantidad:4,  precioVenta:75,  totalVenta:300,  cantComprada:3.5, costoM3:70, totalCosto:245,  ganancia:55},
  {id:114,fecha:"2026-05-20",cliente:"pablo",    pagado:"SI",material:"confitillo",        cantidad:1,  precioVenta:70,  totalVenta:70,   cantComprada:1,   costoM3:55, totalCosto:55,   ganancia:15},
  {id:115,fecha:"2026-05-21",cliente:"huaman",   pagado:"SI",material:"pilca",             cantidad:3.5,precioVenta:75,  totalVenta:262.5,cantComprada:3,   costoM3:75, totalCosto:225,  ganancia:37.5},
  {id:116,fecha:"2026-05-21",cliente:"3 regiones",pagado:"NO",material:"arena gruesa",     cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:117,fecha:"2026-05-21",cliente:"centenario",pagado:"SI",material:"arena gruesa",     cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:66},
  {id:118,fecha:"2026-05-21",cliente:"centenario",pagado:"SI",material:"confitillo",       cantidad:3,  precioVenta:70,  totalVenta:210,  cantComprada:3,   costoM3:55, totalCosto:165,  ganancia:45},
  {id:119,fecha:"2026-05-21",cliente:"bulebar",  pagado:"SI",material:"arena gruesa",      cantidad:3,  precioVenta:65,  totalVenta:195,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:81},
  {id:120,fecha:"2026-05-21",cliente:"lucho ramires",pagado:"SI",material:"ormigon",       cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:66},
  {id:121,fecha:"2026-05-21",cliente:"cruz",     pagado:"NO",material:"arena gruesa",      cantidad:6,  precioVenta:55,  totalVenta:330,  cantComprada:6,   costoM3:38, totalCosto:228,  ganancia:102},
  {id:122,fecha:"2026-05-21",cliente:"wilmer",   pagado:"SI",material:"arena gruesa",      cantidad:3,  precioVenta:50,  totalVenta:150,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:36},
  {id:123,fecha:"2026-05-21",cliente:"wilmer",   pagado:"SI",material:"confitillo",        cantidad:1,  precioVenta:70,  totalVenta:70,   cantComprada:1,   costoM3:55, totalCosto:55,   ganancia:15},
  {id:124,fecha:"2026-05-21",cliente:"huaman",   pagado:"SI",material:"ormigon",           cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:4,   costoM3:45, totalCosto:180,  ganancia:60},
  {id:125,fecha:"2026-05-21",cliente:"huaman",   pagado:"SI",material:"pilca",             cantidad:2,  precioVenta:75,  totalVenta:150,  cantComprada:1.5, costoM3:70, totalCosto:105,  ganancia:45},
  {id:126,fecha:"2026-05-22",cliente:"huaman",   pagado:"SI",material:"ormigon",           cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:30},
  {id:127,fecha:"2026-05-22",cliente:"ruiis gallo",pagado:"SI",material:"desmonte",        cantidad:1,  precioVenta:210, totalVenta:210,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:210},
  {id:128,fecha:"2026-05-22",cliente:"atlantis", pagado:"SI",material:"ormigon",           cantidad:1,  precioVenta:60,  totalVenta:60,   cantComprada:1,   costoM3:45, totalCosto:45,   ganancia:15},
  {id:129,fecha:"2026-05-22",cliente:"por centenario",pagado:"SI",material:"arena gruesa", cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
];

const GASTOS_INICIALES = [
  {id:1,  fecha:"2026-04-23",descripcion:"Comida",           monto:50},
  {id:2,  fecha:"2026-04-23",descripcion:"Combustible",      monto:180},
  {id:3,  fecha:"2026-04-24",descripcion:"Puesta de faros",  monto:70},
  {id:4,  fecha:"2026-04-24",descripcion:"Focos",            monto:85},
  {id:5,  fecha:"2026-04-24",descripcion:"Comida",           monto:40},
  {id:6,  fecha:"2026-04-24",descripcion:"Electrostática",   monto:40},
  {id:7,  fecha:"2026-04-25",descripcion:"Pintura",          monto:1000},
  {id:8,  fecha:"2026-04-27",descripcion:"Comida",           monto:20},
  {id:9,  fecha:"2026-04-28",descripcion:"Petroleo",         monto:465},
  {id:10, fecha:"2026-04-28",descripcion:"Comida",           monto:50},
  {id:11, fecha:"2026-04-29",descripcion:"Comida",           monto:50},
  {id:12, fecha:"2026-04-30",descripcion:"Comida",           monto:50},
  {id:13, fecha:"2026-04-30",descripcion:"Pintura",          monto:1000},
  {id:14, fecha:"2026-04-30",descripcion:"Parabrisa",        monto:400},
  {id:15, fecha:"2026-05-01",descripcion:"Comida",           monto:60},
  {id:16, fecha:"2026-05-02",descripcion:"Comida",           monto:50},
  {id:17, fecha:"2026-05-04",descripcion:"Petroleo",         monto:532.79},
  {id:18, fecha:"2026-05-04",descripcion:"Comida",           monto:40},
  {id:19, fecha:"2026-05-05",descripcion:"Pintura",          monto:900},
  {id:20, fecha:"2026-05-05",descripcion:"Comida",           monto:30},
  {id:21, fecha:"2026-05-05",descripcion:"Petroleo",         monto:140},
  {id:22, fecha:"2026-05-06",descripcion:"Petroleo",         monto:470},
  {id:23, fecha:"2026-05-06",descripcion:"Comida",           monto:45},
  {id:24, fecha:"2026-05-07",descripcion:"Comida",           monto:50},
  {id:25, fecha:"2026-05-08",descripcion:"Petroleo",         monto:468},
  {id:26, fecha:"2026-05-08",descripcion:"Comida",           monto:30},
  {id:27, fecha:"2026-05-09",descripcion:"Comida",           monto:40},
  {id:28, fecha:"2026-05-09",descripcion:"Cableado",         monto:600},
  {id:29, fecha:"2026-05-11",descripcion:"Electrico",        monto:800},
  {id:30, fecha:"2026-05-11",descripcion:"Comida",           monto:20},
  {id:31, fecha:"2026-05-11",descripcion:"Comida",           monto:40},
  {id:32, fecha:"2026-05-12",descripcion:"Petroleo",         monto:319},
  {id:33, fecha:"2026-05-13",descripcion:"Comida",           monto:30},
  {id:34, fecha:"2026-05-14",descripcion:"Comida",           monto:30},
  {id:35, fecha:"2026-05-14",descripcion:"Combustible",      monto:500},
  {id:36, fecha:"2026-05-15",descripcion:"Piso",             monto:700},
  {id:37, fecha:"2026-05-16",descripcion:"Petroleo",         monto:137},
  {id:38, fecha:"2026-05-16",descripcion:"Comida",           monto:50},
  {id:39, fecha:"2026-05-16",descripcion:"Filtros carro",    monto:684},
  {id:40, fecha:"2026-05-18",descripcion:"Petroleo",         monto:212},
  {id:41, fecha:"2026-05-18",descripcion:"Comida",           monto:30},
  {id:42, fecha:"2026-05-19",descripcion:"Comida",           monto:40},
  {id:43, fecha:"2026-05-19",descripcion:"Petroleo",         monto:562.5},
  {id:44, fecha:"2026-05-20",descripcion:"Comida",           monto:40},
  {id:45, fecha:"2026-05-21",descripcion:"Comida",           monto:40},
  {id:46, fecha:"2026-05-21",descripcion:"Petroleo",         monto:220},
  {id:47, fecha:"2026-05-21",descripcion:"Soportes máquina", monto:200},
  {id:48, fecha:"2026-05-22",descripcion:"Comida",           monto:35},
];

const COMPRAS_INICIALES = [
  {id:1,  fecha:"2026-05-04",agregado:"arena gruesa", cantidad:22,   costo:820},
  {id:2,  fecha:"2026-05-04",agregado:"confitillo",   cantidad:8,    costo:280},
  {id:3,  fecha:"2026-05-05",agregado:"ormigon",      cantidad:22,   costo:900},
  {id:4,  fecha:"2026-05-05",agregado:"arena fina",   cantidad:22,   costo:650},
  {id:5,  fecha:"2026-05-05",agregado:"confitillo",   cantidad:22,   costo:900},
  {id:6,  fecha:"2026-05-06",agregado:"pilca",        cantidad:null, costo:280},
  {id:7,  fecha:"2026-05-06",agregado:"ormigon",      cantidad:22,   costo:900},
  {id:8,  fecha:"2026-05-06",agregado:"arena gruesa", cantidad:22,   costo:820},
  {id:9,  fecha:"2026-05-12",agregado:"ormigon",      cantidad:0,    costo:900},
  {id:10, fecha:"2026-05-14",agregado:"arena gruesa", cantidad:22,   costo:820},
  {id:11, fecha:"2026-05-18",agregado:"ormigon",      cantidad:22,   costo:900},
  {id:12, fecha:"2026-05-19",agregado:"arena gruesa", cantidad:null, costo:820},
  {id:13, fecha:"2026-05-19",agregado:"arena gruesa", cantidad:null, costo:820},
  {id:14, fecha:"2026-05-20",agregado:"confitillo",   cantidad:null, costo:1800},
  {id:15, fecha:"2026-05-21",agregado:"arena fina",   cantidad:null, costo:600},
];

const PRESTAMOS_INICIALES = [
  {id:1, nombre:"Préstamo 1", monto:2181, fecha:"2026-05-01"},
  {id:2, nombre:"Préstamo 2", monto:3790, fecha:"2026-05-01"},
  {id:3, nombre:"Préstamo 3", monto:700,  fecha:"2026-05-01"},
];

// ═══════════════════════════════════════════════════════════
//  PERSISTENCIA
// ═══════════════════════════════════════════════════════════
function loadData() {
  const saved = localStorage.getItem('flores-agregados-v2');
  if (saved) {
    const d = JSON.parse(saved);
    Object.assign(STATE, d);
  } else {
    STATE.ventas    = VENTAS_INICIALES.map(v => ({...v}));
    STATE.gastos    = GASTOS_INICIALES.map(g => ({...g}));
    STATE.compras   = COMPRAS_INICIALES.map(c => ({...c}));
    STATE.prestamos = PRESTAMOS_INICIALES.map(p => ({...p}));
  }
  STATE.mesActivo = STATE.mesActivo || 'todos';
}

function saveData() {
  localStorage.setItem('flores-agregados-v2', JSON.stringify({
    capitalInicial: STATE.capitalInicial,
    ventas:   STATE.ventas,
    gastos:   STATE.gastos,
    compras:  STATE.compras,
    prestamos:STATE.prestamos,
    diasTrabajados: STATE.diasTrabajados,
    mesActivo: STATE.mesActivo,
  }));
}

// ═══════════════════════════════════════════════════════════
//  FILTRO POR MES — funciones centrales
// ═══════════════════════════════════════════════════════════
function filterByMes(arr) {
  if (STATE.mesActivo === 'todos') return arr;
  return arr.filter(item => (item.fecha || '').startsWith(STATE.mesActivo));
}

function getMesesDisponibles() {
  const set = new Set();
  [...STATE.ventas, ...STATE.gastos, ...STATE.compras].forEach(item => {
    if (item.fecha) set.add(item.fecha.slice(0, 7));
  });
  return [...set].sort();
}

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function labelMes(ym) {
  if (ym === 'todos') return 'Todos los meses';
  const [y, m] = ym.split('-');
  return `${MESES_ES[+m-1]} ${y}`;
}

// ═══════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════
const fmt  = n => `S/ ${(+n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtN = n => (+n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});
function nextId(arr) { return arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1; }
function todayStr()  { return new Date().toISOString().slice(0,10); }
function formatDate(str) {
  if (!str) return '';
  const d = new Date(str+'T00:00:00');
  return d.toLocaleDateString('es-PE',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function cap(s) { return s ? s.charAt(0).toUpperCase()+s.slice(1) : ''; }

// ═══════════════════════════════════════════════════════════
//  CÁLCULOS FINANCIEROS (respetan filtro de mes)
// ═══════════════════════════════════════════════════════════
function calcFinancials(mes) {
  const ventas  = mes ? filterByMes(STATE.ventas)  : STATE.ventas;
  const gastos  = mes ? filterByMes(STATE.gastos)  : STATE.gastos;
  const compras = mes ? filterByMes(STATE.compras) : STATE.compras;

  const totalVentas    = ventas.reduce((s,v)  => s+(+v.totalVenta||0), 0);
  const totalCostos    = ventas.reduce((s,v)  => s+(+v.totalCosto||0), 0);
  const totalGastos    = gastos.reduce((s,g)  => s+(+g.monto||0), 0);
  const totalCompras   = compras.reduce((s,c) => s+(+c.costo||0), 0);
  const totalGanancias = ventas.reduce((s,v)  => s+(+v.ganancia||0), 0);
  const totalPrestamos = STATE.prestamos.reduce((s,p) => s+(+p.monto||0), 0);
  const descDiario     = STATE.diasTrabajados > 0 ? STATE.ventas.reduce((s,v)=>s+(+v.ganancia||0),0) / STATE.diasTrabajados : 0;
  const capitalActual  = STATE.capitalInicial + totalGanancias - totalGastos - totalCompras - totalPrestamos;

  return { totalVentas, totalCostos, totalGastos, totalCompras, totalGanancias, totalPrestamos, descDiario, capitalActual };
}

// ═══════════════════════════════════════════════════════════
//  MES SWITCHER — renderiza la barra de meses
// ═══════════════════════════════════════════════════════════
function renderMesSwitcher() {
  const meses = ['todos', ...getMesesDisponibles()];
  const bar = document.getElementById('mes-switcher');
  bar.innerHTML = meses.map(m => `
    <button class="mes-btn ${STATE.mesActivo===m?'active':''}" onclick="setMes('${m}')">
      ${labelMes(m)}
    </button>`).join('');
}

function setMes(m) {
  STATE.mesActivo = m;
  saveData();
  renderMesSwitcher();
  // Rerender el tab activo
  const active = document.querySelector('.nav-item.active');
  if (active) switchTab(active.dataset.tab);
}

// ═══════════════════════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════════════════════
const TITLES = {
  dashboard:'Dashboard', ventas:'Ventas / Pedidos',
  gastos:'Gastos Adicionales', stock:'Stock & Compras',
  prestamos:'Préstamos', resumen:'Resumen General',
};

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.remove('hidden');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('pageTitle').textContent = TITLES[tab];
  renderMesSwitcher();

  if (tab==='dashboard')  renderDashboard();
  if (tab==='ventas')     renderVentas();
  if (tab==='gastos')     renderGastos();
  if (tab==='stock')      renderStock();
  if (tab==='prestamos')  renderPrestamos();
  if (tab==='resumen')    renderResumen();
  updateSidebarCapital();
}

// ═══════════════════════════════════════════════════════════
//  CHARTS
// ═══════════════════════════════════════════════════════════
let charts = {};
function destroyChart(key) { if(charts[key]){charts[key].destroy();delete charts[key];} }

function renderDashboard() {
  const fin = calcFinancials(true);
  const ventasF  = filterByMes(STATE.ventas);

  document.getElementById('kpi-capital-inicial').textContent = fmt(STATE.capitalInicial);
  document.getElementById('kpi-ventas').textContent   = fmt(fin.totalVentas);
  document.getElementById('kpi-costos').textContent   = fmt(fin.totalCostos);
  document.getElementById('kpi-gastos').textContent   = fmt(fin.totalGastos);
  document.getElementById('kpi-compra-agr').textContent = fmt(fin.totalCompras);
  const capEl = document.getElementById('kpi-capital-actual');
  capEl.textContent = fmt(fin.capitalActual);
  capEl.closest('.kpi-card').className = `kpi-card ${fin.capitalActual>=0?'kpi-teal':'kpi-red'}`;

  // Label mes activo en kpis
  const mLabel = STATE.mesActivo==='todos' ? 'Todos los meses' : labelMes(STATE.mesActivo);
  document.getElementById('kpi-mes-label').textContent = mLabel;

  // Tabla reciente
  const recent = [...ventasF].sort((a,b)=>b.id-a.id).slice(0,10);
  document.getElementById('tbody-recent').innerHTML = recent.map(v => `
    <tr>
      <td class="num">${v.id}</td>
      <td>${formatDate(v.fecha)}</td>
      <td>${cap(v.cliente)}</td>
      <td>${cap(v.material)}</td>
      <td class="num">${v.cantidad}</td>
      <td class="num">${fmt(v.totalVenta)}</td>
      <td class="${+v.ganancia>=0?'pos':'neg'}">${fmt(v.ganancia)}</td>
      <td><span class="badge badge-${(v.pagado||'').toLowerCase()==='si'?'si':'no'}">${v.pagado||'—'}</span></td>
    </tr>`).join('');

  // Chart por día
  destroyChart('ventasDia');
  const vpd = {};
  ventasF.forEach(v => { vpd[v.fecha]=(vpd[v.fecha]||0)+(+v.ganancia||0); });
  const dias = Object.keys(vpd).sort().slice(-20);
  const ctx1 = document.getElementById('chartVentasDia').getContext('2d');
  charts.ventasDia = new Chart(ctx1,{
    type:'bar',
    data:{ labels:dias.map(d=>formatDate(d)), datasets:[{label:'Ganancia (S/)',data:dias.map(d=>vpd[d]),backgroundColor:'rgba(249,115,22,0.7)',borderColor:'#f97316',borderWidth:1,borderRadius:4}] },
    options:{ plugins:{legend:{display:false}}, scales:{ x:{ticks:{color:'#64748b',font:{size:10}},grid:{color:'#2a3347'}}, y:{ticks:{color:'#64748b'},grid:{color:'#2a3347'}} } }
  });

  // Chart material
  destroyChart('material');
  const mg={};
  ventasF.forEach(v=>{ const m=cap(v.material); mg[m]=(mg[m]||0)+(+v.ganancia||0); });
  const ms=Object.entries(mg).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const ctx2 = document.getElementById('chartMaterial').getContext('2d');
  const colors=['#f97316','#22c55e','#3b82f6','#a855f7','#14b8a6','#eab308','#ef4444','#fb923c'];
  charts.material = new Chart(ctx2,{
    type:'doughnut',
    data:{ labels:ms.map(([k])=>k), datasets:[{data:ms.map(([,v])=>v),backgroundColor:colors,borderColor:'#161b27',borderWidth:2}] },
    options:{ plugins:{ legend:{ position:'right', labels:{color:'#94a3b8',font:{size:11},padding:12} } } }
  });
}

// ═══════════════════════════════════════════════════════════
//  VENTAS
// ═══════════════════════════════════════════════════════════
const COSTOS_REF = {
  "arena fina":30,"arena gruesa":38,"arena gruesa rio":45,
  "piedra chancada":70,"confitillo":50,"ormigon":47,
  "pilca":65,"desmonte":0,"afirmado":0,
};

function renderVentas() {
  const ventas = filterByMes(STATE.ventas);
  const clientes = [...new Set(STATE.ventas.map(v=>v.cliente).filter(Boolean))];
  document.getElementById('list-clientes').innerHTML = clientes.map(c=>`<option value="${c}">`).join('');
  document.getElementById('filter-cliente').innerHTML = `<option value="">Todos los clientes</option>`+clientes.map(c=>`<option>${cap(c)}</option>`).join('');
  const mats = [...new Set(STATE.ventas.map(v=>v.material).filter(Boolean))];
  document.getElementById('filter-material').innerHTML = `<option value="">Todos los materiales</option>`+mats.map(m=>`<option>${cap(m)}</option>`).join('');
  renderVentasTable(ventas);
}

function renderVentasTable(ventas) {
  const tbody = document.getElementById('tbody-ventas');
  const tv=ventas.reduce((s,v)=>s+(+v.totalVenta||0),0);
  const tc=ventas.reduce((s,v)=>s+(+v.totalCosto||0),0);
  const tg=ventas.reduce((s,v)=>s+(+v.ganancia||0),0);
  tbody.innerHTML = ventas.map(v=>`
    <tr>
      <td class="num">${v.id}</td>
      <td>${formatDate(v.fecha)}</td>
      <td>${cap(v.cliente)}</td>
      <td><span class="badge badge-${(v.pagado||'').toLowerCase()==='si'?'si':'no'}">${v.pagado||'—'}</span></td>
      <td>${cap(v.material)}</td>
      <td class="num">${v.cantidad}</td>
      <td class="num">${fmtN(v.precioVenta)}</td>
      <td class="num">${fmt(v.totalVenta)}</td>
      <td class="num">${v.cantComprada??'—'}</td>
      <td class="num">${fmtN(v.costoM3)}</td>
      <td class="num">${fmt(v.totalCosto)}</td>
      <td class="${+v.ganancia>=0?'pos':'neg'}">${fmt(v.ganancia)}</td>
      <td>
        <button class="btn-icon" onclick="editVenta(${v.id})">✏️</button>
        <button class="btn-icon del" onclick="confirmDelete('venta',${v.id})">🗑️</button>
      </td>
    </tr>`).join('');
  document.getElementById('total-venta-sum').textContent = fmt(tv);
  document.getElementById('total-costo-sum').textContent = fmt(tc);
  document.getElementById('total-ganancia-sum').textContent = fmt(tg);
  document.getElementById('total-ganancia-sum').className = `fw-bold ${tg>=0?'pos':'neg'}`;
  const pagados   = ventas.filter(v=>(v.pagado||'').toUpperCase()==='SI').reduce((s,v)=>s+(+v.totalVenta||0),0);
  const pendientes= ventas.filter(v=>(v.pagado||'').toUpperCase()!=='SI').reduce((s,v)=>s+(+v.totalVenta||0),0);
  document.getElementById('ventas-stats').innerHTML = `
    <div class="stat-pill green"><span>Ganancias:</span><span class="pill-val">${fmt(tg)}</span></div>
    <div class="stat-pill orange"><span>Cobrado:</span><span class="pill-val">${fmt(pagados)}</span></div>
    <div class="stat-pill red"><span>Pendiente cobro:</span><span class="pill-val">${fmt(pendientes)}</span></div>
    <div class="stat-pill"><span>Pedidos:</span><span class="pill-val">${ventas.length}</span></div>`;
}

function filterVentas() {
  const desde  = document.getElementById('filter-fecha-desde').value;
  const hasta  = document.getElementById('filter-fecha-hasta').value;
  const cliente= document.getElementById('filter-cliente').value.toLowerCase();
  const mat    = document.getElementById('filter-material').value.toLowerCase();
  let r = filterByMes(STATE.ventas);
  if (desde)   r = r.filter(v=>v.fecha>=desde);
  if (hasta)   r = r.filter(v=>v.fecha<=hasta);
  if (cliente) r = r.filter(v=>(v.cliente||'').toLowerCase().includes(cliente));
  if (mat)     r = r.filter(v=>(v.material||'').toLowerCase().includes(mat));
  renderVentasTable(r);
}

function clearFilters() {
  ['filter-fecha-desde','filter-fecha-hasta','filter-cliente','filter-material'].forEach(id=>document.getElementById(id).value='');
  renderVentasTable(filterByMes(STATE.ventas));
}

function autoFillCosto() {
  const mat = document.getElementById('v-material').value;
  const cr  = COSTOS_REF[mat]??'';
  if (cr!=='') { document.getElementById('v-costo-m3').value=cr; calcVenta(); }
}

function calcVenta() {
  const cant  = parseFloat(document.getElementById('v-cantidad').value)||0;
  const pv    = parseFloat(document.getElementById('v-precio-venta').value)||0;
  const cantC = parseFloat(document.getElementById('v-cant-comprada').value)||cant;
  const cm3   = parseFloat(document.getElementById('v-costo-m3').value)||0;
  document.getElementById('v-total-venta').value = (cant*pv).toFixed(2);
  document.getElementById('v-total-costo').value = (cantC*cm3).toFixed(2);
  document.getElementById('v-ganancia').value    = (cant*pv - cantC*cm3).toFixed(2);
}

function calcCostoM3() {
  const cant  = parseFloat(document.getElementById('c-cantidad').value)||0;
  const costo = parseFloat(document.getElementById('c-costo').value)||0;
  document.getElementById('c-costo-m3').value = cant>0?(costo/cant).toFixed(2):'';
}

// ═══════════════════════════════════════════════════════════
//  GASTOS
// ═══════════════════════════════════════════════════════════
function renderGastos() {
  const gastos = filterByMes(STATE.gastos);
  const sorted = [...gastos].sort((a,b)=>b.fecha.localeCompare(a.fecha));
  document.getElementById('tbody-gastos').innerHTML = sorted.map(g=>`
    <tr>
      <td>${formatDate(g.fecha)}</td>
      <td>${cap(g.descripcion)}</td>
      <td class="num neg">${fmt(g.monto)}</td>
      <td>
        <button class="btn-icon" onclick="editGasto(${g.id})">✏️</button>
        <button class="btn-icon del" onclick="confirmDelete('gasto',${g.id})">🗑️</button>
      </td>
    </tr>`).join('');
  const total = gastos.reduce((s,g)=>s+(+g.monto||0),0);
  document.getElementById('total-gastos-sum').textContent = fmt(total);
  document.getElementById('total-gastos-sum').className = 'fw-bold neg';

  const cats={};
  gastos.forEach(g=>{ const k=cap(g.descripcion); cats[k]=(cats[k]||0)+(+g.monto||0); });
  const cs=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,10);
  document.getElementById('gastos-categorias').innerHTML = cs.map(([k,v])=>`
    <div class="cat-row"><span>${k}</span><span class="cat-val">${fmt(v)}</span></div>`).join('');

  destroyChart('gastos');
  const colors=['#f97316','#ef4444','#3b82f6','#22c55e','#a855f7','#eab308','#14b8a6','#fb923c','#94a3b8','#64748b'];
  charts.gastos = new Chart(document.getElementById('chartGastos').getContext('2d'),{
    type:'pie',
    data:{ labels:cs.map(([k])=>k), datasets:[{data:cs.map(([,v])=>v),backgroundColor:colors,borderColor:'#161b27',borderWidth:2}] },
    options:{ plugins:{ legend:{ position:'bottom', labels:{color:'#94a3b8',font:{size:11},padding:8} } } }
  });
}

// ═══════════════════════════════════════════════════════════
//  STOCK
// ═══════════════════════════════════════════════════════════
function renderStock() {
  const compras = filterByMes(STATE.compras);
  const ventas  = filterByMes(STATE.ventas);

  const compradas={}, vendidas={};
  compras.forEach(c=>{ const k=(c.agregado||'').toLowerCase().trim(); compradas[k]=(compradas[k]||0)+(+c.cantidad||0); });
  ventas.forEach(v=>{ const k=(v.material||'').toLowerCase().trim(); vendidas[k]=(vendidas[k]||0)+(+v.cantComprada||0); });
  const mats=[...new Set([...Object.keys(compradas),...Object.keys(vendidas)])];

  document.getElementById('stock-cards').innerHTML = mats.map(m=>{
    const stock=(compradas[m]||0)-(vendidas[m]||0);
    const lc=[...STATE.compras].filter(c=>(c.agregado||'').toLowerCase().trim()===m).sort((a,b)=>b.fecha.localeCompare(a.fecha))[0];
    const cM3 = lc&&lc.cantidad? (lc.costo/lc.cantidad).toFixed(1):'—';
    return `<div class="stock-card">
      <div class="stock-name">${cap(m)}</div>
      <div class="stock-qty ${stock<0?'neg':''}">${stock.toFixed(1)}</div>
      <div class="stock-unit">m³ estimado en stock</div>
      <div class="stock-cost">Ult. costo: S/${cM3}/m³</div>
    </div>`;
  }).join('');

  const sorted=[...compras].sort((a,b)=>b.fecha.localeCompare(a.fecha));
  document.getElementById('tbody-compras').innerHTML = sorted.map(c=>{
    const cM3=c.cantidad?(c.costo/c.cantidad).toFixed(2):'—';
    return `<tr>
      <td>${formatDate(c.fecha)}</td>
      <td>${cap(c.agregado)}</td>
      <td class="num">${c.cantidad??'—'}</td>
      <td class="num neg">${fmt(c.costo)}</td>
      <td class="num">${cM3!=='—'?'S/'+cM3:'—'}</td>
      <td>
        <button class="btn-icon" onclick="editCompra(${c.id})">✏️</button>
        <button class="btn-icon del" onclick="confirmDelete('compra',${c.id})">🗑️</button>
      </td>
    </tr>`;
  }).join('');
  const total=compras.reduce((s,c)=>s+(+c.costo||0),0);
  document.getElementById('total-compras-sum').textContent = fmt(total);
  document.getElementById('total-compras-sum').className = 'fw-bold neg';
}

// ═══════════════════════════════════════════════════════════
//  PRÉSTAMOS
// ═══════════════════════════════════════════════════════════
function renderPrestamos() {
  const fin = calcFinancials(false);
  document.getElementById('prestamos-list').innerHTML = STATE.prestamos.map(p=>`
    <div class="prestamo-card">
      <div class="prestamo-info">
        <div class="prestamo-nombre">${p.nombre}</div>
        <div class="prestamo-fecha">${formatDate(p.fecha)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="prestamo-monto">${fmt(p.monto)}</div>
        <button class="btn-icon del" onclick="confirmDelete('prestamo',${p.id})">🗑️</button>
      </div>
    </div>`).join('');
  const restante=fin.totalPrestamos-(fin.descDiario*STATE.diasTrabajados);
  const pct=fin.totalPrestamos>0?Math.min(100,Math.max(0,((fin.totalPrestamos-Math.max(0,restante))/fin.totalPrestamos*100))):0;
  document.getElementById('p-total-prestamos').textContent = fmt(fin.totalPrestamos);
  document.getElementById('p-dias').textContent = STATE.diasTrabajados;
  document.getElementById('p-desc-diario').textContent = fmt(fin.descDiario);
  document.getElementById('p-restante').textContent = fmt(Math.max(0,restante));
  document.getElementById('p-total-capital').textContent = fmt(fin.totalGanancias);
  document.getElementById('p-capital-favor').textContent = fmt(fin.totalGanancias-fin.totalPrestamos);
  document.getElementById('p-progress-bar').style.width = pct+'%';
  document.getElementById('p-progress-pct').textContent = pct.toFixed(1)+'%';
}

// ═══════════════════════════════════════════════════════════
//  RESUMEN
// ═══════════════════════════════════════════════════════════
function renderResumen() {
  const fin = calcFinancials(true);
  const ventasF = filterByMes(STATE.ventas);
  const gastosF = filterByMes(STATE.gastos);

  document.getElementById('resumen-balance').innerHTML = `
    <div class="balance-row"><span>Capital inicial</span><span class="num">${fmt(STATE.capitalInicial)}</span></div>
    <div class="balance-row"><span>+ Total ventas (${labelMes(STATE.mesActivo)})</span><span class="num pos">${fmt(fin.totalVentas)}</span></div>
    <div class="balance-row"><span>− Costos de venta</span><span class="num neg">${fmt(fin.totalCostos)}</span></div>
    <div class="balance-row"><span>− Gastos adicionales</span><span class="num neg">${fmt(fin.totalGastos)}</span></div>
    <div class="balance-row"><span>− Compra de agregados</span><span class="num neg">${fmt(fin.totalCompras)}</span></div>
    <div class="balance-row"><span>− Préstamos pendientes</span><span class="num neg">${fmt(fin.totalPrestamos)}</span></div>
    <div class="balance-row total-row"><span>Capital Actual</span><span class="num ${fin.capitalActual>=0?'pos':'neg'}">${fmt(fin.capitalActual)}</span></div>
    <div class="balance-row"><span>Ganancias brutas</span><span class="num pos">${fmt(fin.totalGanancias)}</span></div>`;

  // Comparativa por mes
  const meses = getMesesDisponibles();
  if (meses.length > 1) {
    const rows = meses.map(m => {
      const vM = STATE.ventas.filter(v=>(v.fecha||'').startsWith(m));
      const gM = STATE.gastos.filter(g=>(g.fecha||'').startsWith(m));
      const cM = STATE.compras.filter(c=>(c.fecha||'').startsWith(m));
      const ganancias = vM.reduce((s,v)=>s+(+v.ganancia||0),0);
      const gastos2   = gM.reduce((s,g)=>s+(+g.monto||0),0);
      const compras2  = cM.reduce((s,c)=>s+(+c.costo||0),0);
      const neto      = ganancias - gastos2 - compras2;
      return `<div class="balance-row">
        <span>${labelMes(m)}</span>
        <span class="num ${neto>=0?'pos':'neg'}">${fmt(neto)} neto</span>
      </div>`;
    }).join('');
    document.getElementById('resumen-comparativa').innerHTML = rows;
    document.getElementById('resumen-comparativa-block').style.display='';
  } else {
    document.getElementById('resumen-comparativa-block').style.display='none';
  }

  // Top clientes
  const cg={};
  ventasF.forEach(v=>{ const c=cap(v.cliente)||'Sin nombre'; cg[c]=(cg[c]||0)+(+v.ganancia||0); });
  document.getElementById('resumen-clientes').innerHTML = Object.entries(cg).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i)=>`
    <div class="rank-item"><div class="rank-num">${i+1}</div><div class="rank-name">${k}</div><div class="rank-val">${fmt(v)}</div></div>`).join('');

  // Top materiales
  const mg={};
  ventasF.forEach(v=>{ const m=cap(v.material); mg[m]=(mg[m]||0)+(+v.ganancia||0); });
  document.getElementById('resumen-materiales').innerHTML = Object.entries(mg).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i)=>`
    <div class="rank-item"><div class="rank-num">${i+1}</div><div class="rank-name">${k}</div><div class="rank-val">${fmt(v)}</div></div>`).join('');

  // Chart semanal
  destroyChart('semana');
  const sem={};
  ventasF.forEach(v=>{ const wk=getWeekKey(v.fecha); sem[wk]=(sem[wk]||0)+(+v.ganancia||0); });
  const wks=Object.keys(sem).sort().slice(-10);
  charts.semana = new Chart(document.getElementById('chartSemana').getContext('2d'),{
    type:'line',
    data:{ labels:wks, datasets:[{label:'Ganancia semanal',data:wks.map(k=>sem[k]),borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,.1)',tension:0.4,fill:true,pointBackgroundColor:'#22c55e',pointRadius:4}] },
    options:{ plugins:{legend:{display:false}}, scales:{ x:{ticks:{color:'#64748b',font:{size:10}},grid:{color:'#2a3347'}}, y:{ticks:{color:'#64748b'},grid:{color:'#2a3347'}} } }
  });
}

function getWeekKey(str) {
  if (!str) return '';
  const d=new Date(str+'T00:00:00'), day=d.getDay();
  d.setDate(d.getDate()-day+(day===0?-6:1));
  return d.toISOString().slice(0,10);
}

// ═══════════════════════════════════════════════════════════
//  SIDEBAR CAPITAL
// ═══════════════════════════════════════════════════════════
function updateSidebarCapital() {
  const fin = calcFinancials(false);
  const el = document.getElementById('sidebar-capital');
  el.textContent = fmt(fin.capitalActual);
  el.style.color = fin.capitalActual>=0?'var(--teal)':'var(--red)';
}

// ═══════════════════════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════════════════════
function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  STATE.editingVenta=STATE.editingGasto=STATE.editingCompra=null;
  if(id==='modal-venta')  resetVentaForm();
  if(id==='modal-gasto')  resetGastoForm();
  if(id==='modal-compra') resetCompraForm();
}

function resetVentaForm() {
  ['v-numero','v-fecha','v-cliente','v-material','v-cantidad','v-precio-venta',
   'v-total-venta','v-cant-comprada','v-costo-m3','v-total-costo','v-ganancia'].forEach(id=>{ const e=document.getElementById(id); if(e)e.value=''; });
  document.getElementById('v-pagado').value='SI';
  document.getElementById('v-fecha').value=todayStr();
  document.getElementById('v-numero').value=nextId(STATE.ventas);
  document.getElementById('modal-venta-title').textContent='Nuevo Pedido';
}
function resetGastoForm() {
  document.getElementById('g-fecha').value=todayStr();
  document.getElementById('g-descripcion').value='';
  document.getElementById('g-monto').value='';
  document.getElementById('modal-gasto-title').textContent='Nuevo Gasto';
}
function resetCompraForm() {
  document.getElementById('c-fecha').value=todayStr();
  ['c-agregado','c-cantidad','c-costo','c-costo-m3'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('modal-compra-title').textContent='Registrar Compra de Agregado';
}

// ═══════════════════════════════════════════════════════════
//  SAVE / EDIT
// ═══════════════════════════════════════════════════════════
function saveVenta() {
  const fecha=document.getElementById('v-fecha').value;
  const cliente=document.getElementById('v-cliente').value.trim().toLowerCase();
  const pagado=document.getElementById('v-pagado').value;
  const material=document.getElementById('v-material').value;
  const cantidad=parseFloat(document.getElementById('v-cantidad').value);
  const precioVenta=parseFloat(document.getElementById('v-precio-venta').value);
  const cantComprada=parseFloat(document.getElementById('v-cant-comprada').value)||cantidad;
  const costoM3=parseFloat(document.getElementById('v-costo-m3').value)||0;
  if(!fecha||!material||isNaN(cantidad)||isNaN(precioVenta)){showToast('⚠️ Completa todos los campos obligatorios','error');return;}
  const totalVenta=cantidad*precioVenta, totalCosto=cantComprada*costoM3, ganancia=totalVenta-totalCosto;
  if(STATE.editingVenta!==null){
    const idx=STATE.ventas.findIndex(v=>v.id===STATE.editingVenta);
    if(idx!==-1){STATE.ventas[idx]={...STATE.ventas[idx],fecha,cliente,pagado,material,cantidad,precioVenta,totalVenta,cantComprada,costoM3,totalCosto,ganancia};showToast('✅ Pedido actualizado');}
  } else {
    STATE.ventas.push({id:nextId(STATE.ventas),fecha,cliente,pagado,material,cantidad,precioVenta,totalVenta,cantComprada,costoM3,totalCosto,ganancia});
    showToast('✅ Pedido registrado');
  }
  saveData(); closeModal('modal-venta'); renderVentas(); updateSidebarCapital();
}

function editVenta(id) {
  const v=STATE.ventas.find(x=>x.id===id); if(!v)return;
  STATE.editingVenta=id;
  document.getElementById('modal-venta-title').textContent='Editar Pedido #'+id;
  document.getElementById('v-numero').value=v.id;
  document.getElementById('v-fecha').value=v.fecha;
  document.getElementById('v-cliente').value=v.cliente;
  document.getElementById('v-pagado').value=v.pagado;
  document.getElementById('v-material').value=v.material;
  document.getElementById('v-cantidad').value=v.cantidad;
  document.getElementById('v-precio-venta').value=v.precioVenta;
  document.getElementById('v-total-venta').value=v.totalVenta;
  document.getElementById('v-cant-comprada').value=v.cantComprada;
  document.getElementById('v-costo-m3').value=v.costoM3;
  document.getElementById('v-total-costo').value=v.totalCosto;
  document.getElementById('v-ganancia').value=v.ganancia;
  openModal('modal-venta');
}

function saveGasto() {
  const fecha=document.getElementById('g-fecha').value;
  const desc=document.getElementById('g-descripcion').value.trim();
  const monto=parseFloat(document.getElementById('g-monto').value);
  if(!fecha||!desc||isNaN(monto)||monto<=0){showToast('⚠️ Completa todos los campos','error');return;}
  if(STATE.editingGasto!==null){
    const idx=STATE.gastos.findIndex(g=>g.id===STATE.editingGasto);
    if(idx!==-1){STATE.gastos[idx]={...STATE.gastos[idx],fecha,descripcion:desc,monto};showToast('✅ Gasto actualizado');}
  } else { STATE.gastos.push({id:nextId(STATE.gastos),fecha,descripcion:desc,monto});showToast('✅ Gasto registrado'); }
  saveData(); closeModal('modal-gasto'); renderGastos(); updateSidebarCapital();
}

function editGasto(id) {
  const g=STATE.gastos.find(x=>x.id===id); if(!g)return;
  STATE.editingGasto=id;
  document.getElementById('modal-gasto-title').textContent='Editar Gasto';
  document.getElementById('g-fecha').value=g.fecha;
  document.getElementById('g-descripcion').value=g.descripcion;
  document.getElementById('g-monto').value=g.monto;
  openModal('modal-gasto');
}

function saveCompra() {
  const fecha=document.getElementById('c-fecha').value;
  const agregado=document.getElementById('c-agregado').value;
  const cantidad=parseFloat(document.getElementById('c-cantidad').value)||null;
  const costo=parseFloat(document.getElementById('c-costo').value);
  if(!fecha||!agregado||isNaN(costo)||costo<=0){showToast('⚠️ Completa todos los campos','error');return;}
  if(STATE.editingCompra!==null){
    const idx=STATE.compras.findIndex(c=>c.id===STATE.editingCompra);
    if(idx!==-1){STATE.compras[idx]={...STATE.compras[idx],fecha,agregado,cantidad,costo};showToast('✅ Compra actualizada');}
  } else { STATE.compras.push({id:nextId(STATE.compras),fecha,agregado,cantidad,costo});showToast('✅ Compra registrada'); }
  saveData(); closeModal('modal-compra'); renderStock(); updateSidebarCapital();
}

function editCompra(id) {
  const c=STATE.compras.find(x=>x.id===id); if(!c)return;
  STATE.editingCompra=id;
  document.getElementById('modal-compra-title').textContent='Editar Compra';
  document.getElementById('c-fecha').value=c.fecha;
  document.getElementById('c-agregado').value=c.agregado;
  document.getElementById('c-cantidad').value=c.cantidad??'';
  document.getElementById('c-costo').value=c.costo;
  calcCostoM3(); openModal('modal-compra');
}

function savePrestamo() {
  const nombre=document.getElementById('p-nombre').value.trim()||'Préstamo';
  const monto=parseFloat(document.getElementById('p-monto').value);
  const fecha=document.getElementById('p-fecha').value||todayStr();
  if(isNaN(monto)||monto<=0){showToast('⚠️ Ingresa un monto válido','error');return;}
  STATE.prestamos.push({id:nextId(STATE.prestamos),nombre,monto,fecha});
  saveData(); closeModal('modal-prestamo'); renderPrestamos(); updateSidebarCapital();
  showToast('✅ Préstamo añadido');
}

// ═══════════════════════════════════════════════════════════
//  ELIMINAR
// ═══════════════════════════════════════════════════════════
function confirmDelete(type,id) {
  openModal('modal-confirm');
  document.getElementById('confirm-delete-btn').onclick=()=>doDelete(type,id);
}
function doDelete(type,id) {
  if(type==='venta')    STATE.ventas    =STATE.ventas.filter(v=>v.id!==id);
  if(type==='gasto')    STATE.gastos    =STATE.gastos.filter(g=>g.id!==id);
  if(type==='compra')   STATE.compras   =STATE.compras.filter(c=>c.id!==id);
  if(type==='prestamo') STATE.prestamos =STATE.prestamos.filter(p=>p.id!==id);
  saveData(); closeModal('modal-confirm'); showToast('🗑️ Registro eliminado');
  if(type==='venta')    renderVentas();
  if(type==='gasto')    renderGastos();
  if(type==='compra')   renderStock();
  if(type==='prestamo') renderPrestamos();
  updateSidebarCapital();
}

// ═══════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg,type='success') {
  const t=document.getElementById('toast');
  t.textContent=msg; t.className=`toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{t.className='toast hidden';},3000);
}

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
function init() {
  loadData();
  document.getElementById('currentDate').textContent =
    new Date().toLocaleDateString('es-PE',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.addEventListener('click',()=>{
      switchTab(btn.dataset.tab);
      if(window.innerWidth<900) document.getElementById('sidebar').classList.remove('open');
    });
  });

  document.getElementById('menuToggle').addEventListener('click',()=>
    document.getElementById('sidebar').classList.toggle('open'));

  document.querySelectorAll('.modal-overlay').forEach(overlay=>{
    overlay.addEventListener('click',e=>{
      if(e.target===overlay){ overlay.classList.add('hidden'); STATE.editingVenta=STATE.editingGasto=STATE.editingCompra=null; }
    });
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m=>m.classList.add('hidden'));
  });

  document.getElementById('v-fecha').value=todayStr();
  document.getElementById('g-fecha').value=todayStr();
  document.getElementById('c-fecha').value=todayStr();
  document.getElementById('p-fecha').value=todayStr();
  document.getElementById('v-numero').value=nextId(STATE.ventas);

  renderMesSwitcher();
  renderDashboard();
  updateSidebarCapital();
}

document.addEventListener('DOMContentLoaded',init);