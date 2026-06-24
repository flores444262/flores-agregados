/* ============================================================
   FLORES AGREGADOS — app.js v3
   Firebase-ready | Filtro de mes global | CRUD completo
   ============================================================ */

// ═══════════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ═══════════════════════════════════════════════════════════
const STATE = {
  capitalInicial: 3000,
  ventas:         [],
  gastos:         [],
  compras:        [],
  prestamos:      [],
  diasTrabajados: 26,
  mesActivo:      'todos',
  editingVenta:   null,
  editingGasto:   null,
  editingCompra:  null,
  editingPrestamo:null,
};

// ═══════════════════════════════════════════════════════════
//  DATOS INICIALES COMPLETOS (Abril–Mayo 2026)
// ═══════════════════════════════════════════════════════════
const VENTAS_INIT = [
  {id:1,  fecha:"2026-04-23",cliente:"pedro",    pagado:"SI",material:"arena fina",       cantidad:2,  precioVenta:50,  totalVenta:100,  cantComprada:2,   costoM3:30, totalCosto:60,   ganancia:40},
  {id:2,  fecha:"2026-04-23",cliente:"pedro",    pagado:"SI",material:"arena gruesa",     cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:3,  fecha:"2026-04-23",cliente:"enoc",     pagado:"SI",material:"piedra chancada",  cantidad:12, precioVenta:85,  totalVenta:1020, cantComprada:10,  costoM3:80, totalCosto:800,  ganancia:220},
  {id:4,  fecha:"2026-04-23",cliente:"enoc",     pagado:"SI",material:"arena gruesa",     cantidad:12, precioVenta:50,  totalVenta:600,  cantComprada:10,  costoM3:38, totalCosto:380,  ganancia:220},
  {id:5,  fecha:"2026-04-23",cliente:"jardines", pagado:"SI",material:"ormigon",          cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:30},
  {id:6,  fecha:"2026-04-23",cliente:"yoja",     pagado:"SI",material:"ormigon",          cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:5.5, costoM3:45, totalCosto:247.5,ganancia:112.5},
  {id:7,  fecha:"2026-04-23",cliente:"pedro",    pagado:"SI",material:"ormigon",          cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:30},
  {id:8,  fecha:"2026-04-23",cliente:"lavan",    pagado:"SI",material:"ormigon",          cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:2.5, costoM3:45, totalCosto:112.5,ganancia:67.5},
  {id:9,  fecha:"2026-04-23",cliente:"consuelo", pagado:"SI",material:"arena gruesa",     cantidad:4,  precioVenta:50,  totalVenta:200,  cantComprada:3.5, costoM3:38, totalCosto:133,  ganancia:67},
  {id:10, fecha:"2026-04-23",cliente:"consuelo", pagado:"SI",material:"confitillo",       cantidad:4,  precioVenta:70,  totalVenta:280,  cantComprada:3.5, costoM3:50, totalCosto:175,  ganancia:105},
  {id:11, fecha:"2026-04-23",cliente:"duber",    pagado:"SI",material:"ormigon",          cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:3.5, costoM3:47, totalCosto:164.5,ganancia:75.5},
  {id:12, fecha:"2026-04-23",cliente:"duber",    pagado:"SI",material:"pilca",            cantidad:3,  precioVenta:70,  totalVenta:210,  cantComprada:2.5, costoM3:65, totalCosto:162.5,ganancia:47.5},
  {id:13, fecha:"2026-04-24",cliente:"duber",    pagado:"SI",material:"arena gruesa",     cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:14, fecha:"2026-04-24",cliente:"duver",    pagado:"SI",material:"confitillo",       cantidad:1.5,precioVenta:70,  totalVenta:105,  cantComprada:1.5, costoM3:50, totalCosto:75,   ganancia:30},
  {id:15, fecha:"2026-04-24",cliente:"darwin",   pagado:"SI",material:"confitillo",       cantidad:4,  precioVenta:70,  totalVenta:280,  cantComprada:4,   costoM3:50, totalCosto:200,  ganancia:80},
  {id:16, fecha:"2026-04-25",cliente:"darwin",   pagado:"NO",material:"arena gruesa",     cantidad:3,  precioVenta:55,  totalVenta:165,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:51},
  {id:17, fecha:"2026-04-25",cliente:"darwin",   pagado:"NO",material:"confitillo",       cantidad:2.5,precioVenta:70,  totalVenta:175,  cantComprada:2.5, costoM3:50, totalCosto:125,  ganancia:50},
  {id:18, fecha:"2026-04-27",cliente:"",         pagado:"SI",material:"desmonte",         cantidad:7,  precioVenta:100, totalVenta:700,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:700},
  {id:19, fecha:"2026-04-27",cliente:"lavan",    pagado:"SI",material:"piedra chancada",  cantidad:3,  precioVenta:90,  totalVenta:270,  cantComprada:3,   costoM3:90, totalCosto:270,  ganancia:0},
  {id:20, fecha:"2026-04-27",cliente:"silva",    pagado:"SI",material:"arena gruesa",     cantidad:2,  precioVenta:55,  totalVenta:110,  cantComprada:2,   costoM3:55, totalCosto:110,  ganancia:0},
  {id:21, fecha:"2026-04-27",cliente:"nailin",   pagado:"SI",material:"piedra chancada",  cantidad:4,  precioVenta:90,  totalVenta:360,  cantComprada:4,   costoM3:70, totalCosto:280,  ganancia:80},
  {id:22, fecha:"2026-04-28",cliente:"pedro",    pagado:"SI",material:"arena gruesa",     cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:23, fecha:"2026-04-28",cliente:"pedro",    pagado:"SI",material:"confitillo",       cantidad:2,  precioVenta:70,  totalVenta:140,  cantComprada:2,   costoM3:50, totalCosto:100,  ganancia:40},
  {id:24, fecha:"2026-04-28",cliente:"yoja",     pagado:"SI",material:"arena gruesa",     cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:6,   costoM3:60, totalCosto:360,  ganancia:0},
  {id:25, fecha:"2026-04-28",cliente:"desmonte", pagado:"SI",material:"desmonte",         cantidad:36, precioVenta:20,  totalVenta:720,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:720},
  {id:26, fecha:"2026-04-28",cliente:"consuelo", pagado:"SI",material:"arena fina",       cantidad:3,  precioVenta:50,  totalVenta:150,  cantComprada:3,   costoM3:30, totalCosto:90,   ganancia:60},
  {id:27, fecha:"2026-04-29",cliente:"zorro",    pagado:"SI",material:"ormigon",          cantidad:8,  precioVenta:58,  totalVenta:464,  cantComprada:8,   costoM3:47, totalCosto:376,  ganancia:88},
  {id:28, fecha:"2026-04-29",cliente:"desmonte", pagado:"SI",material:"desmonte",         cantidad:36, precioVenta:20,  totalVenta:720,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:720},
  {id:29, fecha:"2026-04-30",cliente:"desmonte", pagado:"SI",material:"desmonte",         cantidad:24, precioVenta:30,  totalVenta:720,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:720},
  {id:30, fecha:"2026-05-01",cliente:"nayra",    pagado:"SI",material:"arena gruesa rio", cantidad:12, precioVenta:60,  totalVenta:720,  cantComprada:1,   costoM3:100,totalCosto:100,  ganancia:620},
  {id:31, fecha:"2026-05-01",cliente:"naira",    pagado:"SI",material:"confitillo",       cantidad:10, precioVenta:70,  totalVenta:700,  cantComprada:10,  costoM3:55, totalCosto:550,  ganancia:150},
  {id:32, fecha:"2026-05-01",cliente:"nailin",   pagado:"SI",material:"arena fina",       cantidad:4,  precioVenta:50,  totalVenta:200,  cantComprada:4,   costoM3:30, totalCosto:120,  ganancia:80},
  {id:33, fecha:"2026-05-01",cliente:"consuelo", pagado:"SI",material:"arena gruesa",     cantidad:4,  precioVenta:50,  totalVenta:200,  cantComprada:4,   costoM3:38, totalCosto:152,  ganancia:48},
  {id:34, fecha:"2026-05-01",cliente:"carlos",   pagado:"NO",material:"piedra chancada",  cantidad:3,  precioVenta:80,  totalVenta:240,  cantComprada:3,   costoM3:70, totalCosto:210,  ganancia:30},
  {id:35, fecha:"2026-05-01",cliente:"carlos",   pagado:"NO",material:"arena gruesa",     cantidad:3,  precioVenta:50,  totalVenta:150,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:36},
  {id:36, fecha:"2026-05-01",cliente:"silva",    pagado:"SI",material:"arena fina",       cantidad:2,  precioVenta:50,  totalVenta:100,  cantComprada:2,   costoM3:30, totalCosto:60,   ganancia:40},
  {id:37, fecha:"2026-05-01",cliente:"pancho",   pagado:"SI",material:"piedra chancada",  cantidad:1.5,precioVenta:100, totalVenta:150,  cantComprada:1.5, costoM3:70, totalCosto:105,  ganancia:45},
  {id:38, fecha:"2026-05-01",cliente:"pancho",   pagado:"SI",material:"arena gruesa",     cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:66},
  {id:39, fecha:"2026-05-02",cliente:"jonatan",  pagado:"SI",material:"arena gruesa",     cantidad:7,  precioVenta:50,  totalVenta:350,  cantComprada:6.5, costoM3:38, totalCosto:247,  ganancia:103},
  {id:40, fecha:"2026-05-02",cliente:"jonatan",  pagado:"SI",material:"piedra chancada",  cantidad:7,  precioVenta:90,  totalVenta:630,  cantComprada:6,   costoM3:80, totalCosto:480,  ganancia:150},
  {id:41, fecha:"2026-05-02",cliente:"consuelo", pagado:"SI",material:"arena gruesa",     cantidad:3,  precioVenta:50,  totalVenta:150,  cantComprada:2.5, costoM3:38, totalCosto:95,   ganancia:55},
  {id:42, fecha:"2026-05-02",cliente:"consuelo", pagado:"SI",material:"piedra chancada",  cantidad:3,  precioVenta:80,  totalVenta:240,  cantComprada:2.5, costoM3:70, totalCosto:175,  ganancia:65},
  {id:43, fecha:"2026-05-02",cliente:"cruz",     pagado:"SI",material:"arena gruesa",     cantidad:7,  precioVenta:55,  totalVenta:385,  cantComprada:7,   costoM3:38, totalCosto:266,  ganancia:119},
  {id:44, fecha:"2026-05-02",cliente:"cruz",     pagado:"SI",material:"confitillo",       cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:50, totalCosto:100,  ganancia:20},
  {id:45, fecha:"2026-05-04",cliente:"pedro",    pagado:"SI",material:"arena gruesa",     cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:46, fecha:"2026-05-04",cliente:"neyra",    pagado:"SI",material:"ormigon",          cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:6,   costoM3:45, totalCosto:270,  ganancia:90},
  {id:47, fecha:"2026-05-04",cliente:"neyra",    pagado:"SI",material:"piedra pilca",     cantidad:4,  precioVenta:68,  totalVenta:272,  cantComprada:4,   costoM3:50, totalCosto:200,  ganancia:72},
  {id:48, fecha:"2026-05-04",cliente:"manuel",   pagado:"SI",material:"confitillo",       cantidad:12, precioVenta:68,  totalVenta:816,  cantComprada:11.5,costoM3:55, totalCosto:632.5,ganancia:183.5},
  {id:49, fecha:"2026-05-05",cliente:"pedro",    pagado:"SI",material:"ormigon",          cantidad:3.5,precioVenta:60,  totalVenta:210,  cantComprada:3.5, costoM3:45, totalCosto:157.5,ganancia:52.5},
  {id:50, fecha:"2026-05-05",cliente:"nayra",    pagado:"SI",material:"ormigon",          cantidad:5,  precioVenta:60,  totalVenta:300,  cantComprada:4.5, costoM3:45, totalCosto:202.5,ganancia:97.5},
  {id:51, fecha:"2026-05-05",cliente:"nayra",    pagado:"SI",material:"pilca",            cantidad:2,  precioVenta:75,  totalVenta:150,  cantComprada:1.5, costoM3:50, totalCosto:75,   ganancia:75},
  {id:52, fecha:"2026-05-05",cliente:"silva",    pagado:"SI",material:"arena gruesa",     cantidad:12, precioVenta:50,  totalVenta:600,  cantComprada:12,  costoM3:38, totalCosto:456,  ganancia:144},
  {id:53, fecha:"2026-05-05",cliente:"wilmer",   pagado:"SI",material:"ormigon",          cantidad:12, precioVenta:50,  totalVenta:600,  cantComprada:11,  costoM3:45, totalCosto:495,  ganancia:105},
  {id:54, fecha:"2026-05-05",cliente:"colorada", pagado:"SI",material:"ormigon",          cantidad:6,  precioVenta:68,  totalVenta:408,  cantComprada:6,   costoM3:45, totalCosto:270,  ganancia:138},
  {id:55, fecha:"2026-05-06",cliente:"wilmer",   pagado:"SI",material:"piedra pilca",     cantidad:12, precioVenta:70,  totalVenta:840,  cantComprada:10,  costoM3:28, totalCosto:280,  ganancia:560},
  {id:56, fecha:"2026-05-06",cliente:"neyra",    pagado:"SI",material:"arena gruesa",     cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:66},
  {id:57, fecha:"2026-05-06",cliente:"neyra",    pagado:"SI",material:"confitillo",       cantidad:1,  precioVenta:70,  totalVenta:70,   cantComprada:1,   costoM3:45, totalCosto:45,   ganancia:25},
  {id:58, fecha:"2026-05-06",cliente:"ing",      pagado:"SI",material:"piedra pilca",     cantidad:9,  precioVenta:80,  totalVenta:720,  cantComprada:9,   costoM3:68, totalCosto:612,  ganancia:108},
  {id:59, fecha:"2026-05-07",cliente:"colorada", pagado:"SI",material:"ormigon",          cantidad:1,  precioVenta:60,  totalVenta:60,   cantComprada:1,   costoM3:45, totalCosto:45,   ganancia:15},
  {id:60, fecha:"2026-05-07",cliente:"yojan",    pagado:"SI",material:"arena gruesa",     cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:4,   costoM3:38, totalCosto:152,  ganancia:208},
  {id:61, fecha:"2026-05-07",cliente:"yojan",    pagado:"SI",material:"confitillo",       cantidad:3,  precioVenta:70,  totalVenta:210,  cantComprada:2.5, costoM3:45, totalCosto:112.5,ganancia:97.5},
  {id:62, fecha:"2026-05-07",cliente:"wilmer",   pagado:"SI",material:"pilca",            cantidad:8,  precioVenta:75,  totalVenta:600,  cantComprada:7,   costoM3:70, totalCosto:490,  ganancia:110},
  {id:63, fecha:"2026-05-08",cliente:"real plaza",pagado:"SI",material:"desmonte",        cantidad:12, precioVenta:12.5,totalVenta:150,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:150},
  {id:64, fecha:"2026-05-08",cliente:"real plaza",pagado:"SI",material:"afirmado",        cantidad:1,  precioVenta:700, totalVenta:700,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:700},
  {id:65, fecha:"2026-05-08",cliente:"yojan",    pagado:"SI",material:"ormigon",          cantidad:4,  precioVenta:70,  totalVenta:280,  cantComprada:3.5, costoM3:45, totalCosto:157.5,ganancia:122.5},
  {id:66, fecha:"2026-05-08",cliente:"yojan",    pagado:"SI",material:"pilca",            cantidad:4,  precioVenta:90,  totalVenta:360,  cantComprada:3.5, costoM3:70, totalCosto:245,  ganancia:115},
  {id:67, fecha:"2026-05-08",cliente:"pedro",    pagado:"SI",material:"piedra chancada",  cantidad:1,  precioVenta:80,  totalVenta:80,   cantComprada:1,   costoM3:70, totalCosto:70,   ganancia:10},
  {id:68, fecha:"2026-05-08",cliente:"pedro",    pagado:"SI",material:"arena gruesa",     cantidad:1,  precioVenta:60,  totalVenta:60,   cantComprada:1,   costoM3:38, totalCosto:38,   ganancia:22},
  {id:69, fecha:"2026-05-09",cliente:"union",    pagado:"SI",material:"arena gruesa",     cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:4,   costoM3:38, totalCosto:152,  ganancia:88},
  {id:70, fecha:"2026-05-11",cliente:"cruz",     pagado:"SI",material:"ormigon",          cantidad:15, precioVenta:60,  totalVenta:900,  cantComprada:15,  costoM3:45, totalCosto:675,  ganancia:225},
  {id:71, fecha:"2026-05-11",cliente:"wilmer",   pagado:"SI",material:"arena gruesa",     cantidad:10, precioVenta:50,  totalVenta:500,  cantComprada:9.5, costoM3:38, totalCosto:361,  ganancia:139},
  {id:72, fecha:"2026-05-11",cliente:"raul",     pagado:"SI",material:"arena gruesa",     cantidad:7,  precioVenta:50,  totalVenta:350,  cantComprada:6.5, costoM3:38, totalCosto:247,  ganancia:103},
  {id:73, fecha:"2026-05-07",cliente:"confitillo",pagado:"SI",material:"tiki",            cantidad:4.5,precioVenta:60,  totalVenta:270,  cantComprada:4.5, costoM3:50, totalCosto:225,  ganancia:45},
  {id:74, fecha:"2026-05-11",cliente:"raul",     pagado:"SI",material:"confitillo",       cantidad:5,  precioVenta:70,  totalVenta:350,  cantComprada:5,   costoM3:45, totalCosto:225,  ganancia:125},
  {id:75, fecha:"2026-05-12",cliente:"cruz",     pagado:"SI",material:"desmonte",         cantidad:1,  precioVenta:350, totalVenta:350,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:350},
  {id:76, fecha:"2026-05-12",cliente:"josue",    pagado:"SI",material:"arena de chacra",  cantidad:1,  precioVenta:300, totalVenta:300,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:300},
  {id:77, fecha:"2026-05-12",cliente:"cesar",    pagado:"SI",material:"ormigon",          cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:3.5, costoM3:45, totalCosto:157.5,ganancia:82.5},
  {id:78, fecha:"2026-05-12",cliente:"pedro",    pagado:"SI",material:"arena gruesa",     cantidad:3.5,precioVenta:60,  totalVenta:210,  cantComprada:3.5, costoM3:38, totalCosto:133,  ganancia:77},
  {id:79, fecha:"2026-05-12",cliente:"pedro",    pagado:"SI",material:"piedra chancada",  cantidad:3,  precioVenta:100, totalVenta:300,  cantComprada:3,   costoM3:80, totalCosto:240,  ganancia:60},
  {id:80, fecha:"2026-05-13",cliente:"silva",    pagado:"SI",material:"arena fina",       cantidad:2,  precioVenta:50,  totalVenta:100,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:24},
  {id:81, fecha:"2026-05-13",cliente:"huaman",   pagado:"SI",material:"ormigon",          cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:45, totalCosto:135,  ganancia:45},
  {id:82, fecha:"2026-05-13",cliente:"zona industrial",pagado:"SI",material:"arena fina", cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:30, totalCosto:60,   ganancia:60},
  {id:83, fecha:"2026-05-14",cliente:"tierra chacra",pagado:"SI",material:"tierra de chacra",cantidad:18,precioVenta:50,totalVenta:900, cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:900},
  {id:84, fecha:"2026-05-14",cliente:"huaman",   pagado:"SI",material:"ormigon",          cantidad:7,  precioVenta:60,  totalVenta:420,  cantComprada:7,   costoM3:45, totalCosto:315,  ganancia:105},
  {id:85, fecha:"2026-05-15",cliente:"desmonte", pagado:"SI",material:"desmonte",         cantidad:48, precioVenta:20,  totalVenta:960,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:960},
  {id:86, fecha:"2026-05-15",cliente:"silva",    pagado:"SI",material:"relleno",          cantidad:1,  precioVenta:100, totalVenta:100,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:100},
  {id:87, fecha:"2026-05-15",cliente:"talledo",  pagado:"SI",material:"arena gruesa",     cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:4,   costoM3:38, totalCosto:152,  ganancia:88},
  {id:88, fecha:"2026-05-15",cliente:"talledo",  pagado:"SI",material:"piedra chancada",  cantidad:4,  precioVenta:100, totalVenta:400,  cantComprada:4,   costoM3:80, totalCosto:320,  ganancia:80},
  {id:89, fecha:"2026-05-15",cliente:"emilio",   pagado:"SI",material:"ormigon",          cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:6,   costoM3:45, totalCosto:270,  ganancia:90},
  {id:90, fecha:"2026-05-16",cliente:"nuevo talarita",pagado:"SI",material:"ormigon",     cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:45, totalCosto:135,  ganancia:45},
  {id:91, fecha:"2026-05-16",cliente:"emilio",   pagado:"SI",material:"piedra over",      cantidad:5.5,precioVenta:80,  totalVenta:440,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:440},
  {id:92, fecha:"2026-05-16",cliente:"raul",     pagado:"SI",material:"arena gruesa",     cantidad:2,  precioVenta:50,  totalVenta:100,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:24},
  {id:93, fecha:"2026-05-16",cliente:"raul",     pagado:"SI",material:"confitillo",       cantidad:2,  precioVenta:70,  totalVenta:140,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:50},
  {id:94, fecha:"2026-05-18",cliente:"pedro",    pagado:"SI",material:"piedra chancada",  cantidad:3.5,precioVenta:100, totalVenta:350,  cantComprada:3.5, costoM3:80, totalCosto:280,  ganancia:70},
  {id:95, fecha:"2026-05-18",cliente:"pedro",    pagado:"SI",material:"arena gruesa",     cantidad:3.5,precioVenta:60,  totalVenta:210,  cantComprada:3.5, costoM3:38, totalCosto:133,  ganancia:77},
  {id:96, fecha:"2026-05-18",cliente:"wilmer",   pagado:"SI",material:"ormigon",          cantidad:6,  precioVenta:60,  totalVenta:360,  cantComprada:6,   costoM3:45, totalCosto:270,  ganancia:90},
  {id:97, fecha:"2026-05-18",cliente:"wilmer",   pagado:"SI",material:"piedra opilca",    cantidad:4,  precioVenta:90,  totalVenta:360,  cantComprada:4,   costoM3:70, totalCosto:280,  ganancia:80},
  {id:98, fecha:"2026-05-18",cliente:"manuel",   pagado:"SI",material:"confitillo",       cantidad:12, precioVenta:80,  totalVenta:960,  cantComprada:12,  costoM3:55, totalCosto:660,  ganancia:300},
  {id:99, fecha:"2026-05-18",cliente:"silva",    pagado:"NO",material:"arena gruesa",     cantidad:8,  precioVenta:60,  totalVenta:480,  cantComprada:8,   costoM3:38, totalCosto:304,  ganancia:176},
  {id:100,fecha:"2026-05-18",cliente:"silva",    pagado:"NO",material:"confitillo",       cantidad:8,  precioVenta:70,  totalVenta:560,  cantComprada:8,   costoM3:50, totalCosto:400,  ganancia:160},
  {id:101,fecha:"2026-05-19",cliente:"josue",    pagado:"SI",material:"confitillo",       cantidad:7,  precioVenta:70,  totalVenta:490,  cantComprada:7,   costoM3:55, totalCosto:385,  ganancia:105},
  {id:102,fecha:"2026-05-19",cliente:"josue",    pagado:"SI",material:"arena gruesa",     cantidad:7,  precioVenta:55,  totalVenta:385,  cantComprada:7,   costoM3:38, totalCosto:266,  ganancia:119},
  {id:103,fecha:"2026-05-19",cliente:"pedro",    pagado:"SI",material:"arena gruesa",     cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:104,fecha:"2026-05-19",cliente:"greda",    pagado:"SI",material:"greda",            cantidad:1,  precioVenta:200, totalVenta:200,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:200},
  {id:105,fecha:"2026-05-19",cliente:"evitamiento",pagado:"SI",material:"ormigon",        cantidad:4,  precioVenta:65,  totalVenta:260,  cantComprada:4,   costoM3:45, totalCosto:180,  ganancia:80},
  {id:106,fecha:"2026-05-19",cliente:"jorge",    pagado:"SI",material:"ormigon",          cantidad:10, precioVenta:55,  totalVenta:550,  cantComprada:10,  costoM3:45, totalCosto:450,  ganancia:100},
  {id:107,fecha:"2026-05-20",cliente:"huaman",   pagado:"SI",material:"ormigon",          cantidad:12, precioVenta:60,  totalVenta:720,  cantComprada:12,  costoM3:45, totalCosto:540,  ganancia:180},
  {id:108,fecha:"2026-05-20",cliente:"talledo",  pagado:"SI",material:"piedra chancada",  cantidad:3,  precioVenta:100, totalVenta:300,  cantComprada:3,   costoM3:80, totalCosto:240,  ganancia:60},
  {id:109,fecha:"2026-05-20",cliente:"silva",    pagado:"NO",material:"arena fina",       cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:30, totalCosto:60,   ganancia:60},
  {id:110,fecha:"2026-05-20",cliente:"rubio",    pagado:"SI",material:"arena fina",       cantidad:1.5,precioVenta:60,  totalVenta:90,   cantComprada:1.5, costoM3:30, totalCosto:45,   ganancia:45},
  {id:111,fecha:"2026-05-20",cliente:"pablo",    pagado:"SI",material:"arena fina",       cantidad:1,  precioVenta:60,  totalVenta:60,   cantComprada:1,   costoM3:30, totalCosto:30,   ganancia:30},
  {id:112,fecha:"2026-05-20",cliente:"pancho",   pagado:"SI",material:"ormigon",          cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:30},
  {id:113,fecha:"2026-05-20",cliente:"huaman",   pagado:"SI",material:"piedra pilca",     cantidad:4,  precioVenta:75,  totalVenta:300,  cantComprada:3.5, costoM3:70, totalCosto:245,  ganancia:55},
  {id:114,fecha:"2026-05-20",cliente:"pablo",    pagado:"SI",material:"confitillo",       cantidad:1,  precioVenta:70,  totalVenta:70,   cantComprada:1,   costoM3:55, totalCosto:55,   ganancia:15},
  {id:115,fecha:"2026-05-21",cliente:"huaman",   pagado:"SI",material:"pilca",            cantidad:3.5,precioVenta:75,  totalVenta:262.5,cantComprada:3,   costoM3:75, totalCosto:225,  ganancia:37.5},
  {id:116,fecha:"2026-05-21",cliente:"3 regiones",pagado:"NO",material:"arena gruesa",   cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
  {id:117,fecha:"2026-05-21",cliente:"centenario",pagado:"SI",material:"arena gruesa",   cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:66},
  {id:118,fecha:"2026-05-21",cliente:"centenario",pagado:"SI",material:"confitillo",     cantidad:3,  precioVenta:70,  totalVenta:210,  cantComprada:3,   costoM3:55, totalCosto:165,  ganancia:45},
  {id:119,fecha:"2026-05-21",cliente:"bulebar",  pagado:"SI",material:"arena gruesa",    cantidad:3,  precioVenta:65,  totalVenta:195,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:81},
  {id:120,fecha:"2026-05-21",cliente:"lucho ramires",pagado:"SI",material:"ormigon",     cantidad:3,  precioVenta:60,  totalVenta:180,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:66},
  {id:121,fecha:"2026-05-21",cliente:"cruz",     pagado:"NO",material:"arena gruesa",    cantidad:6,  precioVenta:55,  totalVenta:330,  cantComprada:6,   costoM3:38, totalCosto:228,  ganancia:102},
  {id:122,fecha:"2026-05-21",cliente:"wilmer",   pagado:"SI",material:"arena gruesa",    cantidad:3,  precioVenta:50,  totalVenta:150,  cantComprada:3,   costoM3:38, totalCosto:114,  ganancia:36},
  {id:123,fecha:"2026-05-21",cliente:"wilmer",   pagado:"SI",material:"confitillo",      cantidad:1,  precioVenta:70,  totalVenta:70,   cantComprada:1,   costoM3:55, totalCosto:55,   ganancia:15},
  {id:124,fecha:"2026-05-21",cliente:"huaman",   pagado:"SI",material:"ormigon",         cantidad:4,  precioVenta:60,  totalVenta:240,  cantComprada:4,   costoM3:45, totalCosto:180,  ganancia:60},
  {id:125,fecha:"2026-05-21",cliente:"huaman",   pagado:"SI",material:"pilca",           cantidad:2,  precioVenta:75,  totalVenta:150,  cantComprada:1.5, costoM3:70, totalCosto:105,  ganancia:45},
  {id:126,fecha:"2026-05-22",cliente:"huaman",   pagado:"SI",material:"ormigon",         cantidad:2,  precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:45, totalCosto:90,   ganancia:30},
  {id:127,fecha:"2026-05-22",cliente:"ruiis gallo",pagado:"SI",material:"desmonte",      cantidad:1,  precioVenta:210, totalVenta:210,  cantComprada:0,   costoM3:0,  totalCosto:0,    ganancia:210},
  {id:128,fecha:"2026-05-22",cliente:"atlantis", pagado:"SI",material:"ormigon",         cantidad:1,  precioVenta:60,  totalVenta:60,   cantComprada:1,   costoM3:45, totalCosto:45,   ganancia:15},
  {id:129,fecha:"2026-05-22",cliente:"por centenario",pagado:"SI",material:"arena gruesa",cantidad:2, precioVenta:60,  totalVenta:120,  cantComprada:2,   costoM3:38, totalCosto:76,   ganancia:44},
];

const GASTOS_INIT = [
  {id:1, fecha:"2026-04-23",descripcion:"Comida",           monto:50},
  {id:2, fecha:"2026-04-23",descripcion:"Combustible",      monto:180},
  {id:3, fecha:"2026-04-24",descripcion:"Puesta de faros",  monto:70},
  {id:4, fecha:"2026-04-24",descripcion:"Focos",            monto:85},
  {id:5, fecha:"2026-04-24",descripcion:"Comida",           monto:40},
  {id:6, fecha:"2026-04-24",descripcion:"Electrostática",   monto:40},
  {id:7, fecha:"2026-04-25",descripcion:"Pintura",          monto:1000},
  {id:8, fecha:"2026-04-27",descripcion:"Comida",           monto:20},
  {id:9, fecha:"2026-04-28",descripcion:"Petroleo",         monto:465},
  {id:10,fecha:"2026-04-28",descripcion:"Comida",           monto:50},
  {id:11,fecha:"2026-04-29",descripcion:"Comida",           monto:50},
  {id:12,fecha:"2026-04-30",descripcion:"Comida",           monto:50},
  {id:13,fecha:"2026-04-30",descripcion:"Pintura",          monto:1000},
  {id:14,fecha:"2026-04-30",descripcion:"Parabrisa",        monto:400},
  {id:15,fecha:"2026-05-01",descripcion:"Comida",           monto:60},
  {id:16,fecha:"2026-05-02",descripcion:"Comida",           monto:50},
  {id:17,fecha:"2026-05-04",descripcion:"Petroleo",         monto:532.79},
  {id:18,fecha:"2026-05-04",descripcion:"Comida",           monto:40},
  {id:19,fecha:"2026-05-05",descripcion:"Pintura",          monto:900},
  {id:20,fecha:"2026-05-05",descripcion:"Comida",           monto:30},
  {id:21,fecha:"2026-05-05",descripcion:"Petroleo",         monto:140},
  {id:22,fecha:"2026-05-06",descripcion:"Petroleo",         monto:470},
  {id:23,fecha:"2026-05-06",descripcion:"Comida",           monto:45},
  {id:24,fecha:"2026-05-07",descripcion:"Comida",           monto:50},
  {id:25,fecha:"2026-05-08",descripcion:"Petroleo",         monto:468},
  {id:26,fecha:"2026-05-08",descripcion:"Comida",           monto:30},
  {id:27,fecha:"2026-05-09",descripcion:"Comida",           monto:40},
  {id:28,fecha:"2026-05-09",descripcion:"Cableado",         monto:600},
  {id:29,fecha:"2026-05-11",descripcion:"Electrico",        monto:800},
  {id:30,fecha:"2026-05-11",descripcion:"Comida",           monto:20},
  {id:31,fecha:"2026-05-11",descripcion:"Comida",           monto:40},
  {id:32,fecha:"2026-05-12",descripcion:"Petroleo",         monto:319},
  {id:33,fecha:"2026-05-13",descripcion:"Comida",           monto:30},
  {id:34,fecha:"2026-05-14",descripcion:"Comida",           monto:30},
  {id:35,fecha:"2026-05-14",descripcion:"Combustible",      monto:500},
  {id:36,fecha:"2026-05-15",descripcion:"Piso",             monto:700},
  {id:37,fecha:"2026-05-16",descripcion:"Petroleo",         monto:137},
  {id:38,fecha:"2026-05-16",descripcion:"Comida",           monto:50},
  {id:39,fecha:"2026-05-16",descripcion:"Filtros carro",    monto:684},
  {id:40,fecha:"2026-05-18",descripcion:"Petroleo",         monto:212},
  {id:41,fecha:"2026-05-18",descripcion:"Comida",           monto:30},
  {id:42,fecha:"2026-05-19",descripcion:"Comida",           monto:40},
  {id:43,fecha:"2026-05-19",descripcion:"Petroleo",         monto:562.5},
  {id:44,fecha:"2026-05-20",descripcion:"Comida",           monto:40},
  {id:45,fecha:"2026-05-21",descripcion:"Comida",           monto:40},
  {id:46,fecha:"2026-05-21",descripcion:"Petroleo",         monto:220},
  {id:47,fecha:"2026-05-21",descripcion:"Soportes máquina", monto:200},
  {id:48,fecha:"2026-05-22",descripcion:"Comida",           monto:35},
];

const COMPRAS_INIT = [
  {id:1, fecha:"2026-04-23",agregado:"ormigon",       cantidad:20,  costo:900},
  {id:2, fecha:"2026-04-23",agregado:"arena gruesa",  cantidad:22,  costo:820},
  {id:3, fecha:"2026-04-23",agregado:"arena fina",    cantidad:20,  costo:600},
  {id:4, fecha:"2026-04-23",agregado:"confitillo",    cantidad:12,  costo:430},
  {id:5, fecha:"2026-04-23",agregado:"piedra chancada",cantidad:22, costo:1500},
  {id:6, fecha:"2026-05-04",agregado:"arena gruesa",  cantidad:22,  costo:820},
  {id:7, fecha:"2026-05-04",agregado:"confitillo",    cantidad:8,   costo:280},
  {id:8, fecha:"2026-05-05",agregado:"ormigon",       cantidad:22,  costo:900},
  {id:9, fecha:"2026-05-05",agregado:"arena fina",    cantidad:22,  costo:650},
  {id:10,fecha:"2026-05-05",agregado:"confitillo",    cantidad:22,  costo:900},
  {id:11,fecha:"2026-05-06",agregado:"pilca",         cantidad:null,costo:280},
  {id:12,fecha:"2026-05-06",agregado:"ormigon",       cantidad:22,  costo:900},
  {id:13,fecha:"2026-05-06",agregado:"arena gruesa",  cantidad:22,  costo:820},
  {id:14,fecha:"2026-05-12",agregado:"ormigon",       cantidad:22,  costo:900},
  {id:15,fecha:"2026-05-14",agregado:"arena gruesa",  cantidad:22,  costo:820},
  {id:16,fecha:"2026-05-18",agregado:"ormigon",       cantidad:22,  costo:900},
  {id:17,fecha:"2026-05-19",agregado:"arena gruesa",  cantidad:22,  costo:820},
  {id:18,fecha:"2026-05-19",agregado:"arena gruesa",  cantidad:22,  costo:820},
  {id:19,fecha:"2026-05-20",agregado:"confitillo",    cantidad:44,  costo:1800},
  {id:20,fecha:"2026-05-21",agregado:"arena fina",    cantidad:22,  costo:600},
];

const PRESTAMOS_INIT = [
  {id:1,nombre:"Préstamo 1",monto:2181,fecha:"2026-05-01"},
  {id:2,nombre:"Préstamo 2",monto:3790,fecha:"2026-05-01"},
  {id:3,nombre:"Préstamo 3",monto:700, fecha:"2026-05-01"},
];

// ═══════════════════════════════════════════════════════════
//  PERSISTENCIA LOCAL
// ═══════════════════════════════════════════════════════════
const LS_KEY = 'flores-agr-v5';

function loadData() {
  // Limpiar keys viejas corruptas
  ['flores-agr-v1','flores-agr-v2','flores-agr-v3','flores-agr-v4',
   'flores_cache_v3','flores_fb_cache_v3'].forEach(k => {
    try { localStorage.removeItem(k); } catch(e) {}
  });

  let loaded = false;
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const d = JSON.parse(saved);
      STATE.capitalInicial = d.capitalInicial ?? 3000;
      STATE.diasTrabajados = d.diasTrabajados ?? 26;
      STATE.mesActivo      = d.mesActivo      ?? 'todos';
      if (d.ventas    && d.ventas.length    > 0) { STATE.ventas    = d.ventas;    loaded = true; }
      if (d.gastos    && d.gastos.length    > 0)   STATE.gastos    = d.gastos;
      if (d.compras   && d.compras.length   > 0)   STATE.compras   = d.compras;
      if (d.prestamos && d.prestamos.length > 0)   STATE.prestamos = d.prestamos;
    }
  } catch(e) { console.warn('loadData parse error:', e); }

  // Si no hay datos guardados → cargar datos iniciales
  if (!loaded || !STATE.ventas    || STATE.ventas.length    === 0) STATE.ventas    = VENTAS_INIT.map(v=>({...v}));
  if (!STATE.gastos    || STATE.gastos.length    === 0) STATE.gastos    = GASTOS_INIT.map(g=>({...g}));
  if (!STATE.compras   || STATE.compras.length   === 0) STATE.compras   = COMPRAS_INIT.map(c=>({...c}));
  if (!STATE.prestamos || STATE.prestamos.length === 0) STATE.prestamos = PRESTAMOS_INIT.map(p=>({...p}));
}

function loadDefaults() {
  STATE.ventas    = VENTAS_INIT.map(v=>({...v}));
  STATE.gastos    = GASTOS_INIT.map(g=>({...g}));
  STATE.compras   = COMPRAS_INIT.map(c=>({...c}));
  STATE.prestamos = PRESTAMOS_INIT.map(p=>({...p}));
}

function saveData() {
  localStorage.setItem(LS_KEY, JSON.stringify({
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
//  FIREBASE INTEGRATION
//  Conecta con db.js — con timeout para no bloquear la app
// ═══════════════════════════════════════════════════════════
let FB_ENABLED = false;

// Promesa con timeout para evitar colgarse
function withTimeout(promise, ms = 6000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    )
  ]);
}

async function initFirebase() {
  if (typeof DB === 'undefined') return;
  try {
    // Verificar conexión con timeout de 5 segundos
    const ok = await withTimeout(DB.init(), 5000);
    FB_ENABLED = ok;
    if (ok) {
      // Cargar datos desde Firebase con timeout de 8 segundos
      const [ventas, gastos, compras, prestamos, cfg] = await withTimeout(
        Promise.all([
          DB.getVentas(),
          DB.getGastos(),
          DB.getCompras(),
          DB.getPrestamos(),
          DB.getConfig(),
        ]),
        8000
      );
      if (ventas    && ventas.length)    STATE.ventas    = ventas;
      if (gastos    && gastos.length)    STATE.gastos    = gastos;
      if (compras   && compras.length)   STATE.compras   = compras;
      if (prestamos && prestamos.length) STATE.prestamos = prestamos;
      if (cfg) {
        STATE.capitalInicial = cfg.capitalInicial  ?? STATE.capitalInicial;
        STATE.diasTrabajados = cfg.diasTrabajados  ?? STATE.diasTrabajados;
        STATE.mesActivo      = cfg.mesActivo       ?? STATE.mesActivo;
      }
      updateSyncPill('online');
      showToast('🔥 Firebase conectado', 'success');
    } else {
      updateSyncPill('offline');
    }
  } catch(e) {
    // Si Firebase falla o tarda mucho → usa datos locales sin bloquear
    console.warn('[Firebase] Error o timeout — usando datos locales:', e.message);
    FB_ENABLED = false;
    updateSyncPill('offline');
  }
}

async function fbSave(table, record) {
  if (FB_ENABLED && typeof DB !== 'undefined') {
    try { await DB.save(table, record); } catch(e) {}
  }
}
async function fbDelete(table, id) {
  if (FB_ENABLED && typeof DB !== 'undefined') {
    try { await DB.del(table, id); } catch(e) {}
  }
}

function updateSyncPill(state) {
  const pill = document.getElementById('sync-pill');
  if (!pill) return;
  pill.className = `sync-pill ${state}`;
  pill.querySelector('.pill-label').textContent =
    state==='online'?'Firebase OK':state==='syncing'?'Sincronizando...':'Local';

  const ss = document.getElementById('sync-status');
  if (!ss) return;
  ss.className = `sync-status ${state}`;
  ss.querySelector('#dot-label').textContent =
    state==='online'?'🟢 Firebase OK':state==='syncing'?'🟡 Sincronizando...':'🔴 Local (sin Firebase)';
}

// ═══════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════
const fmt  = n => `S/ ${(+n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtN = n => (+n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});
const cap  = s => s ? s.charAt(0).toUpperCase()+s.slice(1) : '';
function nextId(arr) { return arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1; }
function todayStr()  { return new Date().toISOString().slice(0,10); }
function formatDate(str) {
  if (!str) return '';
  const d = new Date(str+'T00:00:00');
  return d.toLocaleDateString('es-PE',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function getWeekKey(str) {
  if (!str) return '';
  const d=new Date(str+'T00:00:00'), day=d.getDay();
  d.setDate(d.getDate()-day+(day===0?-6:1));
  return d.toISOString().slice(0,10);
}

// ═══════════════════════════════════════════════════════════
//  FILTRO DE MES — CENTRAL PARA TODA LA APP
// ═══════════════════════════════════════════════════════════
function filterByMes(arr) {
  if (STATE.mesActivo === 'todos') return arr;
  return arr.filter(item => (item.fecha||'').startsWith(STATE.mesActivo));
}

function getMesesDisponibles() {
  const set = new Set();
  [...STATE.ventas,...STATE.gastos,...STATE.compras].forEach(item => {
    if (item.fecha) set.add(item.fecha.slice(0,7));
  });
  return [...set].sort();
}

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function labelMes(ym) {
  if (ym === 'todos') return 'Todos';
  const [y,m] = ym.split('-');
  return `${MESES_ES[+m-1]} ${y}`;
}

function renderMesSwitcher() {
  const meses = ['todos', ...getMesesDisponibles()];
  const bar = document.getElementById('mes-switcher');
  if (!bar) return;
  bar.innerHTML = meses.map(m =>
    `<button class="mes-btn ${STATE.mesActivo===m?'active':''}" onclick="setMes('${m}')">${labelMes(m)}</button>`
  ).join('');
  // Update sidebar
  const ml = document.getElementById('sidebar-mes-label');
  if (ml) ml.textContent = STATE.mesActivo==='todos'?'Todos los meses':labelMes(STATE.mesActivo);
}

function setMes(m) {
  STATE.mesActivo = m;
  saveData();
  renderMesSwitcher();
  // Redibujar el tab activo → todo respeta el mes
  const active = document.querySelector('.nav-item.active');
  if (active) switchTab(active.dataset.tab);
}

// ═══════════════════════════════════════════════════════════
//  CÁLCULOS FINANCIEROS
// ═══════════════════════════════════════════════════════════
function calcFinancials() {
  const ventasF   = filterByMes(STATE.ventas);
  const gastosF   = filterByMes(STATE.gastos);
  const comprasF  = filterByMes(STATE.compras);

  const totalVentas    = ventasF.reduce((s,v)  => s+(+v.totalVenta||0), 0);
  const totalCostos    = ventasF.reduce((s,v)  => s+(+v.totalCosto||0), 0);
  const totalGanancias = ventasF.reduce((s,v)  => s+(+v.ganancia||0),   0);
  const totalGastos    = gastosF.reduce((s,g)  => s+(+g.monto||0),      0);
  const totalCompras   = comprasF.reduce((s,c) => s+(+c.costo||0),      0);
  const totalPrestamos = STATE.prestamos.reduce((s,p) => s+(+p.monto||0), 0);

  // Ganancia diaria (siempre sobre todos los datos)
  const gananciaTotal = STATE.ventas.reduce((s,v) => s+(+v.ganancia||0), 0);
  const descDiario    = STATE.diasTrabajados > 0 ? gananciaTotal / STATE.diasTrabajados : 0;
  const capitalActual = STATE.capitalInicial + totalGanancias - totalGastos - totalCompras - totalPrestamos;

  const cobrado    = ventasF.filter(v=>(v.pagado||'').toUpperCase()==='SI').reduce((s,v)=>s+(+v.totalVenta||0),0);
  const pendiente  = ventasF.filter(v=>(v.pagado||'').toUpperCase()!=='SI').reduce((s,v)=>s+(+v.totalVenta||0),0);

  return { totalVentas, totalCostos, totalGanancias, totalGastos, totalCompras,
           totalPrestamos, descDiario, capitalActual, cobrado, pendiente };
}

// ═══════════════════════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════════════════════
const TAB_TITLES = {
  dashboard:'Dashboard', ventas:'Ventas / Pedidos',
  gastos:'Gastos Adicionales', stock:'Stock / Compras',
  prestamos:'Préstamos', resumen:'Resumen General',
  configuracion:'Configuración',
};

function switchTab(tab) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.remove('hidden');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('pageTitle').textContent = TAB_TITLES[tab]||tab;
  renderMesSwitcher();

  switch(tab) {
    case 'dashboard':     renderDashboard(); break;
    case 'ventas':        renderVentas();    break;
    case 'gastos':        renderGastos();    break;
    case 'stock':         renderStock();     break;
    case 'prestamos':     renderPrestamos(); break;
    case 'resumen':       renderResumen();   break;
    case 'configuracion': renderConfig();    break;
  }
  updateSidebarCapital();
}

// ═══════════════════════════════════════════════════════════
//  CHARTS
// ═══════════════════════════════════════════════════════════
const charts = {};
function destroyChart(k){ if(charts[k]){charts[k].destroy();delete charts[k];} }

const CHART_OPTS = {
  x: { ticks:{color:'#4f6080',font:{size:10}}, grid:{color:'#1e2640'} },
  y: { ticks:{color:'#4f6080',font:{size:10}}, grid:{color:'#1e2640'} },
};

// ═══════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════
function renderDashboard() {
  const fin = calcFinancials();
  const ventasF = filterByMes(STATE.ventas);

  const mLabel = labelMes(STATE.mesActivo);
  document.getElementById('kpi-mes-label').textContent = STATE.mesActivo==='todos'?'Todos los meses':mLabel;

  document.getElementById('kpi-capital-inicial').textContent = fmt(STATE.capitalInicial);
  document.getElementById('kpi-ventas').textContent          = fmt(fin.totalVentas);
  document.getElementById('kpi-ganancias').textContent       = fmt(fin.totalGanancias);
  document.getElementById('kpi-costos').textContent          = fmt(fin.totalCostos);
  document.getElementById('kpi-gastos').textContent          = fmt(fin.totalGastos);
  document.getElementById('kpi-compras').textContent         = fmt(fin.totalCompras);
  document.getElementById('kpi-pendiente').textContent       = fmt(fin.pendiente);

  const capEl = document.getElementById('kpi-capital-actual');
  capEl.textContent = fmt(fin.capitalActual);
  const capCard = document.getElementById('kpi-capital-card');
  capCard.className = `kpi-card ${fin.capitalActual>=0?'accent-teal':'accent-red'}`;

  // Últimos pedidos
  const recent = [...ventasF].sort((a,b)=>b.id-a.id).slice(0,10);
  document.getElementById('recent-count').textContent = ventasF.length;
  document.getElementById('tbody-recent').innerHTML = recent.length ? recent.map(v=>`
    <tr>
      <td class="mono">${v.id}</td>
      <td>${formatDate(v.fecha)}</td>
      <td>${cap(v.cliente)||'—'}</td>
      <td>${cap(v.material)}</td>
      <td class="mono">${v.cantidad}</td>
      <td class="mono">${fmt(v.totalVenta)}</td>
      <td class="mono ${+v.ganancia>=0?'pos':'neg'}">${fmt(v.ganancia)}</td>
      <td><span class="badge badge-${(v.pagado||'').toLowerCase()==='si'?'si':'no'}">${v.pagado==='SI'?'✅ Pagado':'⏳ Pend.'}</span></td>
    </tr>`).join('') : `<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--text3)">Sin pedidos en este período</td></tr>`;

  // Chart: ganancias por día
  destroyChart('ventasDia');
  const vpd = {};
  ventasF.forEach(v => { vpd[v.fecha]=(vpd[v.fecha]||0)+(+v.ganancia||0); });
  const dias = Object.keys(vpd).sort().slice(-20);
  if (dias.length) {
    const ctx1 = document.getElementById('chartVentasDia').getContext('2d');
    charts.ventasDia = new Chart(ctx1, {
      type:'bar',
      data:{ labels:dias.map(formatDate), datasets:[{
        label:'Ganancia',data:dias.map(d=>vpd[d]),
        backgroundColor:dias.map(d=>vpd[d]>=0?'rgba(34,197,94,.7)':'rgba(239,68,68,.7)'),
        borderColor:dias.map(d=>vpd[d]>=0?'#22c55e':'#ef4444'),
        borderWidth:1,borderRadius:4
      }]},
      options:{ plugins:{legend:{display:false}}, scales:{ x:CHART_OPTS.x, y:CHART_OPTS.y } }
    });
  }

  // Chart: por material
  destroyChart('material');
  const mg = {};
  ventasF.forEach(v=>{ const m=cap(v.material); mg[m]=(mg[m]||0)+(+v.ganancia||0); });
  const ms = Object.entries(mg).sort((a,b)=>b[1]-a[1]).slice(0,8);
  if (ms.length) {
    const clrs = ['#f97316','#22c55e','#3b82f6','#a855f7','#14b8a6','#eab308','#ef4444','#fb923c'];
    const ctx2 = document.getElementById('chartMaterial').getContext('2d');
    charts.material = new Chart(ctx2, {
      type:'doughnut',
      data:{ labels:ms.map(([k])=>k), datasets:[{data:ms.map(([,v])=>v),backgroundColor:clrs,borderColor:'#111520',borderWidth:2}]},
      options:{ plugins:{ legend:{ position:'right', labels:{color:'#94a3b8',font:{size:11},padding:10,boxWidth:12} } } }
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  COSTOS REFERENCIA (autocompletado)
// ═══════════════════════════════════════════════════════════
const COSTOS_REF = {
  "arena fina":30,"arena gruesa":38,"arena gruesa rio":45,
  "piedra chancada":70,"confitillo":50,"ormigon":47,
  "pilca":65,"piedra pilca":65,"desmonte":0,"afirmado":0,
  "tierra de chacra":0,"relleno":0,"greda":0,"tiki":50,
};

// ═══════════════════════════════════════════════════════════
//  VENTAS
// ═══════════════════════════════════════════════════════════
function renderVentas() {
  const ventas = filterByMes(STATE.ventas);
  // Fill datalists & selects
  const clientes = [...new Set(STATE.ventas.map(v=>v.cliente).filter(Boolean))].sort();
  document.getElementById('list-clientes').innerHTML = clientes.map(c=>`<option value="${c}">`).join('');
  document.getElementById('filter-cliente').innerHTML =
    `<option value="">Todos los clientes</option>` + clientes.map(c=>`<option value="${cap(c)}">${cap(c)}</option>`).join('');
  const mats = [...new Set(STATE.ventas.map(v=>v.material).filter(Boolean))].sort();
  document.getElementById('filter-material').innerHTML =
    `<option value="">Todos los materiales</option>` + mats.map(m=>`<option value="${cap(m)}">${cap(m)}</option>`).join('');

  document.getElementById('ventas-count-label').textContent = `${ventas.length} pedido${ventas.length!==1?'s':''}`;
  renderVentasTable(ventas);
}

function renderVentasTable(ventas) {
  const tbody = document.getElementById('tbody-ventas');
  const tv = ventas.reduce((s,v)=>s+(+v.totalVenta||0),0);
  const tc = ventas.reduce((s,v)=>s+(+v.totalCosto||0),0);
  const tg = ventas.reduce((s,v)=>s+(+v.ganancia||0),0);
  const pagados  = ventas.filter(v=>(v.pagado||'').toUpperCase()==='SI').reduce((s,v)=>s+(+v.totalVenta||0),0);
  const pendiente= ventas.filter(v=>(v.pagado||'').toUpperCase()!=='SI').reduce((s,v)=>s+(+v.totalVenta||0),0);

  tbody.innerHTML = ventas.length ? ventas.map(v=>`
    <tr>
      <td class="mono">${v.id}</td>
      <td>${formatDate(v.fecha)}</td>
      <td>${cap(v.cliente)||'—'}</td>
      <td>
        <span class="badge badge-${(v.pagado||'').toLowerCase()==='si'?'si':'no'} badge-click"
          onclick="togglePago(${v.id})" title="Click para cambiar estado">
          ${v.pagado==='SI'?'✅ Pagado':'⏳ Pendiente'}
        </span>
      </td>
      <td>${cap(v.material)}</td>
      <td class="mono">${v.cantidad} m³</td>
      <td class="mono">S/ ${fmtN(v.precioVenta)}</td>
      <td class="mono">${fmt(v.totalVenta)}</td>
      <td class="mono">${v.cantComprada??'—'}</td>
      <td class="mono">S/ ${fmtN(v.costoM3)}</td>
      <td class="mono">${fmt(v.totalCosto)}</td>
      <td class="mono ${+v.ganancia>=0?'pos':'neg'}">${fmt(v.ganancia)}</td>
      <td style="text-align:center">
        <button class="btn-icon" onclick="editVenta(${v.id})" title="Editar">✏️</button>
        <button class="btn-icon del" onclick="confirmDelete('venta',${v.id},'Pedido #${v.id} – ${cap(v.cliente)||'?'}')" title="Eliminar">🗑️</button>
      </td>
    </tr>`).join('') :
    `<tr><td colspan="13" style="text-align:center;padding:28px;color:var(--text3)">Sin ventas en este período</td></tr>`;

  document.getElementById('total-venta-sum').textContent    = fmt(tv);
  document.getElementById('total-costo-sum').textContent    = fmt(tc);
  document.getElementById('total-ganancia-sum').textContent = fmt(tg);
  document.getElementById('total-ganancia-sum').className   = `mono fw ${tg>=0?'pos':'neg'}`;

  document.getElementById('ventas-stats').innerHTML = `
    <div class="stat-pill g"><span>Ganancias:</span><span class="pv">${fmt(tg)}</span></div>
    <div class="stat-pill a"><span>Cobrado:</span><span class="pv">${fmt(pagados)}</span></div>
    <div class="stat-pill r"><span>Pendiente:</span><span class="pv">${fmt(pendiente)}</span></div>
    <div class="stat-pill b"><span>Pedidos:</span><span class="pv">${ventas.length}</span></div>`;
}

function filterVentas() {
  const desde   = document.getElementById('filter-fecha-desde').value;
  const hasta   = document.getElementById('filter-fecha-hasta').value;
  const cliente = document.getElementById('filter-cliente').value.toLowerCase();
  const mat     = document.getElementById('filter-material').value.toLowerCase();
  const pagado  = document.getElementById('filter-pagado').value;
  let r = filterByMes(STATE.ventas);
  if (desde)  r = r.filter(v=>v.fecha>=desde);
  if (hasta)  r = r.filter(v=>v.fecha<=hasta);
  if (cliente) r = r.filter(v=>(v.cliente||'').toLowerCase().includes(cliente));
  if (mat)     r = r.filter(v=>(v.material||'').toLowerCase().includes(mat));
  if (pagado)  r = r.filter(v=>(v.pagado||'').toUpperCase()===pagado);
  renderVentasTable(r);
}

function clearFiltersVentas() {
  ['filter-fecha-desde','filter-fecha-hasta','filter-cliente','filter-material','filter-pagado']
    .forEach(id=>{ const e=document.getElementById(id); if(e)e.value=''; });
  renderVentasTable(filterByMes(STATE.ventas));
}

function togglePago(id) {
  const idx = STATE.ventas.findIndex(v=>v.id===id);
  if (idx===-1) return;
  STATE.ventas[idx].pagado = STATE.ventas[idx].pagado==='SI' ? 'NO' : 'SI';
  saveData();
  fbSave('ventas', STATE.ventas[idx]);
  renderVentas();
  showToast(STATE.ventas[idx].pagado==='SI'?'✅ Marcado como pagado':'⏳ Marcado como pendiente');
}

function autoFillCosto() {
  const mat = document.getElementById('v-material').value;
  const cr  = COSTOS_REF[mat] ?? '';
  if (cr !== '') { document.getElementById('v-costo-m3').value = cr; calcVenta(); }
}

function calcVenta() {
  const cant  = parseFloat(document.getElementById('v-cantidad').value)||0;
  const pv    = parseFloat(document.getElementById('v-precio-venta').value)||0;
  const cantC = parseFloat(document.getElementById('v-cant-comprada').value)||cant;
  const cm3   = parseFloat(document.getElementById('v-costo-m3').value)||0;
  document.getElementById('v-total-venta').value = (cant*pv).toFixed(2);
  document.getElementById('v-total-costo').value = (cantC*cm3).toFixed(2);
  const gan = cant*pv - cantC*cm3;
  const gEl = document.getElementById('v-ganancia');
  gEl.value = gan.toFixed(2);
  gEl.style.color = gan>=0?'var(--green)':'var(--red)';
}

function saveVenta() {
  const fecha        = document.getElementById('v-fecha').value;
  const cliente      = document.getElementById('v-cliente').value.trim().toLowerCase();
  const pagado       = document.getElementById('v-pagado').value;
  const material     = document.getElementById('v-material').value;
  const cantidad     = parseFloat(document.getElementById('v-cantidad').value);
  const precioVenta  = parseFloat(document.getElementById('v-precio-venta').value);
  const cantComprada = parseFloat(document.getElementById('v-cant-comprada').value)||cantidad;
  const costoM3      = parseFloat(document.getElementById('v-costo-m3').value)||0;
  if (!fecha||!material||isNaN(cantidad)||isNaN(precioVenta)) {
    showToast('⚠️ Completa todos los campos obligatorios','error'); return;
  }
  const totalVenta=cantidad*precioVenta, totalCosto=cantComprada*costoM3, ganancia=totalVenta-totalCosto;

  if (STATE.editingVenta !== null) {
    const idx = STATE.ventas.findIndex(v=>v.id===STATE.editingVenta);
    if (idx!==-1) {
      STATE.ventas[idx] = {...STATE.ventas[idx],fecha,cliente,pagado,material,cantidad,precioVenta,totalVenta,cantComprada,costoM3,totalCosto,ganancia};
      fbSave('ventas', STATE.ventas[idx]);
      showToast('✅ Pedido actualizado');
    }
  } else {
    const newV = {id:nextId(STATE.ventas),fecha,cliente,pagado,material,cantidad,precioVenta,totalVenta,cantComprada,costoM3,totalCosto,ganancia};
    STATE.ventas.push(newV);
    fbSave('ventas', newV);
    showToast('✅ Pedido registrado');
  }
  saveData(); closeModal('modal-venta'); renderVentas(); updateSidebarCapital();
}

function editVenta(id) {
  const v = STATE.ventas.find(x=>x.id===id); if(!v)return;
  STATE.editingVenta = id;
  document.getElementById('modal-venta-title').textContent = `Editar Pedido #${id}`;
  document.getElementById('v-numero').value        = v.id;
  document.getElementById('v-fecha').value         = v.fecha;
  document.getElementById('v-cliente').value       = v.cliente;
  document.getElementById('v-pagado').value        = v.pagado;
  document.getElementById('v-material').value      = v.material;
  document.getElementById('v-cantidad').value      = v.cantidad;
  document.getElementById('v-precio-venta').value  = v.precioVenta;
  document.getElementById('v-total-venta').value   = v.totalVenta;
  document.getElementById('v-cant-comprada').value = v.cantComprada;
  document.getElementById('v-costo-m3').value      = v.costoM3;
  document.getElementById('v-total-costo').value   = v.totalCosto;
  const gEl = document.getElementById('v-ganancia');
  gEl.value = v.ganancia;
  gEl.style.color = v.ganancia>=0?'var(--green)':'var(--red)';
  openModal('modal-venta');
}

function resetVentaForm() {
  ['v-numero','v-cliente','v-cantidad','v-precio-venta',
   'v-total-venta','v-cant-comprada','v-costo-m3','v-total-costo','v-ganancia']
    .forEach(id=>{ const e=document.getElementById(id); if(e)e.value=''; });
  document.getElementById('v-material').value  = '';
  document.getElementById('v-pagado').value    = 'SI';
  document.getElementById('v-fecha').value     = todayStr();
  document.getElementById('v-numero').value    = nextId(STATE.ventas);
  document.getElementById('v-ganancia').style.color = 'var(--green)';
  document.getElementById('modal-venta-title').textContent = 'Nuevo Pedido';
}

// ═══════════════════════════════════════════════════════════
//  GASTOS
// ═══════════════════════════════════════════════════════════
function renderGastos(filtered) {
  const gastos = filtered ?? filterByMes(STATE.gastos);
  const sorted = [...gastos].sort((a,b)=>b.fecha.localeCompare(a.fecha));

  document.getElementById('tbody-gastos').innerHTML = sorted.length ? sorted.map(g=>`
    <tr>
      <td>${formatDate(g.fecha)}</td>
      <td>${cap(g.descripcion)}</td>
      <td class="mono neg">${fmt(g.monto)}</td>
      <td style="text-align:center">
        <button class="btn-icon" onclick="editGasto(${g.id})" title="Editar">✏️</button>
        <button class="btn-icon del" onclick="confirmDelete('gasto',${g.id},'${cap(g.descripcion)}')" title="Eliminar">🗑️</button>
      </td>
    </tr>`).join('') :
    `<tr><td colspan="4" style="text-align:center;padding:28px;color:var(--text3)">Sin gastos en este período</td></tr>`;

  const total = gastos.reduce((s,g)=>s+(+g.monto||0),0);
  document.getElementById('total-gastos-sum').textContent = fmt(total);

  const cats = {};
  gastos.forEach(g=>{ const k=cap(g.descripcion); cats[k]=(cats[k]||0)+(+g.monto||0); });
  const cs = Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,10);
  document.getElementById('gastos-categorias').innerHTML = cs.map(([k,v])=>`
    <div class="cat-row"><span>${k}</span><span class="cat-val">${fmt(v)}</span></div>`).join('');

  destroyChart('gastos');
  if (cs.length) {
    const clrs=['#f97316','#ef4444','#3b82f6','#22c55e','#a855f7','#eab308','#14b8a6','#fb923c','#94a3b8','#64748b'];
    charts.gastos = new Chart(document.getElementById('chartGastos').getContext('2d'),{
      type:'pie',
      data:{ labels:cs.map(([k])=>k), datasets:[{data:cs.map(([,v])=>v),backgroundColor:clrs,borderColor:'#111520',borderWidth:2}]},
      options:{ plugins:{ legend:{ position:'bottom', labels:{color:'#94a3b8',font:{size:10},padding:8,boxWidth:11} } } }
    });
  }
}

function filterGastos() {
  const desde = document.getElementById('filter-gasto-desde').value;
  const hasta = document.getElementById('filter-gasto-hasta').value;
  const desc  = document.getElementById('filter-gasto-desc').value.toLowerCase();
  let r = filterByMes(STATE.gastos);
  if (desde) r = r.filter(g=>g.fecha>=desde);
  if (hasta)  r = r.filter(g=>g.fecha<=hasta);
  if (desc)   r = r.filter(g=>(g.descripcion||'').toLowerCase().includes(desc));
  renderGastos(r);
}

function clearFiltersGastos() {
  ['filter-gasto-desde','filter-gasto-hasta','filter-gasto-desc']
    .forEach(id=>{ const e=document.getElementById(id); if(e)e.value=''; });
  renderGastos();
}

function saveGasto() {
  const fecha = document.getElementById('g-fecha').value;
  const desc  = document.getElementById('g-descripcion').value.trim();
  const monto = parseFloat(document.getElementById('g-monto').value);
  if (!fecha||!desc||isNaN(monto)||monto<=0) { showToast('⚠️ Completa todos los campos','error'); return; }

  if (STATE.editingGasto !== null) {
    const idx = STATE.gastos.findIndex(g=>g.id===STATE.editingGasto);
    if (idx!==-1) {
      STATE.gastos[idx] = {...STATE.gastos[idx],fecha,descripcion:desc,monto};
      fbSave('gastos', STATE.gastos[idx]);
      showToast('✅ Gasto actualizado');
    }
  } else {
    const newG = {id:nextId(STATE.gastos),fecha,descripcion:desc,monto};
    STATE.gastos.push(newG);
    fbSave('gastos', newG);
    showToast('✅ Gasto registrado');
  }
  saveData(); closeModal('modal-gasto'); renderGastos(); updateSidebarCapital();
}

function editGasto(id) {
  const g = STATE.gastos.find(x=>x.id===id); if(!g)return;
  STATE.editingGasto = id;
  document.getElementById('modal-gasto-title').textContent = `Editar Gasto`;
  document.getElementById('g-fecha').value       = g.fecha;
  document.getElementById('g-descripcion').value = g.descripcion;
  document.getElementById('g-monto').value       = g.monto;
  openModal('modal-gasto');
}

function resetGastoForm() {
  document.getElementById('g-fecha').value       = todayStr();
  document.getElementById('g-descripcion').value = '';
  document.getElementById('g-monto').value       = '';
  document.getElementById('modal-gasto-title').textContent = 'Nuevo Gasto';
}

// ═══════════════════════════════════════════════════════════
//  STOCK / COMPRAS
// ═══════════════════════════════════════════════════════════
function renderStock() {
  const compras = filterByMes(STATE.compras);
  const ventas  = filterByMes(STATE.ventas);

  const compradas={}, vendidas={};
  compras.forEach(c=>{ const k=(c.agregado||'').toLowerCase().trim(); compradas[k]=(compradas[k]||0)+(+c.cantidad||0); });
  ventas.forEach(v=>{ const k=(v.material||'').toLowerCase().trim(); vendidas[k]=(vendidas[k]||0)+(+v.cantComprada||0); });
  const mats = [...new Set([...Object.keys(compradas),...Object.keys(vendidas)])].sort();

  document.getElementById('stock-cards').innerHTML = mats.map(m=>{
    const stock = (compradas[m]||0)-(vendidas[m]||0);
    const lc = [...STATE.compras].filter(c=>(c.agregado||'').toLowerCase().trim()===m)
               .sort((a,b)=>b.fecha.localeCompare(a.fecha))[0];
    const cM3 = lc&&lc.cantidad ? (lc.costo/lc.cantidad).toFixed(1) : '—';
    const totalComp = compradas[m]||0;
    const totalVend = vendidas[m]||0;
    return `<div class="stock-card">
      <div class="sc-name">${cap(m)}</div>
      <div class="sc-qty ${stock<0?'neg':''}">${stock.toFixed(1)}</div>
      <div class="sc-unit">m³ estimados en stock</div>
      <div class="sc-meta">
        <div class="sc-row"><span>Comprado:</span><b>${totalComp.toFixed(1)} m³</b></div>
        <div class="sc-row"><span>Vendido:</span><b>${totalVend.toFixed(1)} m³</b></div>
        <div class="sc-row"><span>Ult. costo:</span><b>S/${cM3}/m³</b></div>
      </div>
    </div>`;
  }).join('');

  const sorted = [...compras].sort((a,b)=>b.fecha.localeCompare(a.fecha));
  document.getElementById('compras-count').textContent = sorted.length;
  const total = compras.reduce((s,c)=>s+(+c.costo||0),0);
  document.getElementById('total-compras-sum').textContent = fmt(total);
  const tmob = document.getElementById('total-compras-sum-mobile');
  if (tmob) tmob.textContent = fmt(total);

  const isMobile = window.innerWidth < 700;

  if (isMobile) {
    // ── MÓVIL: tarjetas con botones grandes ──────────────────
    const container = document.getElementById('compras-mobile-list');
    if (container) {
      container.innerHTML = sorted.length ? sorted.map(c => {
        const cM3 = c.cantidad ? (c.costo/c.cantidad).toFixed(2) : '—';
        return `<div class="compra-card-mobile">
          <div class="ccm-top">
            <div class="ccm-info">
              <div class="ccm-nombre">${cap(c.agregado)}</div>
              <div class="ccm-fecha">${formatDate(c.fecha)}</div>
            </div>
            <div class="ccm-monto">${fmt(c.costo)}</div>
          </div>
          <div class="ccm-bottom">
            <div class="ccm-meta">
              <span>📦 ${c.cantidad??'—'} m³</span>
              <span>S/${cM3}/m³</span>
            </div>
            <div class="ccm-actions">
              <button class="btn-ccm-edit" onclick="editCompra(${c.id})">✏️ Editar</button>
              <button class="btn-ccm-del"  onclick="confirmDelete('compra',${c.id},'${cap(c.agregado)}')">🗑️ Eliminar</button>
            </div>
          </div>
        </div>`;
      }).join('') : `<div style="text-align:center;padding:28px;color:var(--text3)">Sin compras en este período</div>`;
    }
    // ocultar tabla, mostrar cards
    const tw = document.querySelector('#tab-stock .table-wrap');
    if (tw) tw.style.display = 'none';
    if (container) container.style.display = 'block';
  } else {
    // ── DESKTOP: tabla normal ──────────────────────────────
    const tw = document.querySelector('#tab-stock .table-wrap');
    if (tw) tw.style.display = '';
    const container = document.getElementById('compras-mobile-list');
    if (container) container.style.display = 'none';

    document.getElementById('tbody-compras').innerHTML = sorted.length ? sorted.map(c=>{
      const cM3 = c.cantidad ? (c.costo/c.cantidad).toFixed(2) : '—';
      return `<tr>
        <td>${formatDate(c.fecha)}</td>
        <td>${cap(c.agregado)}</td>
        <td class="mono">${c.cantidad??'—'}</td>
        <td class="mono neg">${fmt(c.costo)}</td>
        <td class="mono">${cM3!=='—'?'S/'+cM3:'—'}</td>
        <td style="text-align:center">
          <button class="btn-icon" onclick="editCompra(${c.id})" title="Editar">✏️</button>
          <button class="btn-icon del" onclick="confirmDelete('compra',${c.id},'${cap(c.agregado)}')" title="Eliminar">🗑️</button>
        </td>
      </tr>`;
    }).join('') :
      `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text3)">Sin compras en este período</td></tr>`;
  }
}

function calcCostoM3() {
  const cant  = parseFloat(document.getElementById('c-cantidad').value)||0;
  const costo = parseFloat(document.getElementById('c-costo').value)||0;
  document.getElementById('c-costo-m3').value = cant>0?(costo/cant).toFixed(2):'';
}

function saveCompra() {
  const fecha    = document.getElementById('c-fecha').value;
  const agregado = document.getElementById('c-agregado').value;
  const cantidad = parseFloat(document.getElementById('c-cantidad').value)||null;
  const costo    = parseFloat(document.getElementById('c-costo').value);
  if (!fecha||!agregado||isNaN(costo)||costo<=0) { showToast('⚠️ Completa todos los campos','error'); return; }

  if (STATE.editingCompra !== null) {
    const idx = STATE.compras.findIndex(c=>c.id===STATE.editingCompra);
    if (idx!==-1) {
      STATE.compras[idx] = {...STATE.compras[idx],fecha,agregado,cantidad,costo};
      fbSave('compras', STATE.compras[idx]);
      showToast('✅ Compra actualizada');
    }
  } else {
    const newC = {id:nextId(STATE.compras),fecha,agregado,cantidad,costo};
    STATE.compras.push(newC);
    fbSave('compras', newC);
    showToast('✅ Compra registrada');
  }
  saveData(); closeModal('modal-compra'); renderStock(); updateSidebarCapital();
}

function editCompra(id) {
  const c = STATE.compras.find(x=>x.id===id); if(!c)return;
  STATE.editingCompra = id;
  document.getElementById('modal-compra-title').textContent = 'Editar Compra';
  document.getElementById('c-fecha').value    = c.fecha;
  document.getElementById('c-agregado').value = c.agregado;
  document.getElementById('c-cantidad').value = c.cantidad??'';
  document.getElementById('c-costo').value    = c.costo;
  calcCostoM3();
  openModal('modal-compra');
}

function resetCompraForm() {
  document.getElementById('c-fecha').value    = todayStr();
  document.getElementById('c-agregado').value = '';
  document.getElementById('c-cantidad').value = '';
  document.getElementById('c-costo').value    = '';
  document.getElementById('c-costo-m3').value = '';
  document.getElementById('modal-compra-title').textContent = 'Registrar Compra';
}

// ═══════════════════════════════════════════════════════════
//  PRÉSTAMOS
// ═══════════════════════════════════════════════════════════
function renderPrestamos() {
  const fin = calcFinancials();

  document.getElementById('prestamos-list').innerHTML = STATE.prestamos.length ?
    STATE.prestamos.map(p=>`
    <div class="prestamo-card">
      <div class="pc-info">
        <div class="pc-nombre">${p.nombre}</div>
        <div class="pc-fecha">📅 ${formatDate(p.fecha)}</div>
      </div>
      <div class="pc-actions">
        <span class="pc-monto">${fmt(p.monto)}</span>
        <button class="btn-icon" onclick="editPrestamo(${p.id})" title="Editar">✏️</button>
        <button class="btn-icon del" onclick="confirmDelete('prestamo',${p.id},'${p.nombre}')" title="Eliminar">🗑️</button>
      </div>
    </div>`).join('') :
    `<div style="text-align:center;padding:32px;color:var(--text3)">Sin préstamos registrados</div>`;

  const restante = fin.totalPrestamos - (fin.descDiario * STATE.diasTrabajados);
  const pct = fin.totalPrestamos>0 ?
    Math.min(100,Math.max(0,((fin.totalPrestamos - Math.max(0,restante))/fin.totalPrestamos*100))) : 0;

  document.getElementById('p-total-prestamos').textContent = fmt(fin.totalPrestamos);
  document.getElementById('p-dias').value                  = STATE.diasTrabajados;
  document.getElementById('p-desc-diario').textContent     = fmt(fin.descDiario);
  document.getElementById('p-restante').textContent        = fmt(Math.max(0,restante));
  document.getElementById('p-total-capital').textContent   = fmt(fin.totalGanancias);
  document.getElementById('p-capital-favor').textContent   = fmt(fin.totalGanancias-fin.totalPrestamos);
  document.getElementById('p-progress-bar').style.width    = pct+'%';
  document.getElementById('p-progress-pct').textContent    = pct.toFixed(1)+'%';
}

function savePrestamo() {
  const nombre = document.getElementById('p-nombre').value.trim()||'Préstamo';
  const monto  = parseFloat(document.getElementById('p-monto').value);
  const fecha  = document.getElementById('p-fecha').value||todayStr();
  if (isNaN(monto)||monto<=0) { showToast('⚠️ Ingresa un monto válido','error'); return; }

  if (STATE.editingPrestamo !== null) {
    const idx = STATE.prestamos.findIndex(p=>p.id===STATE.editingPrestamo);
    if (idx!==-1) {
      STATE.prestamos[idx] = {...STATE.prestamos[idx],nombre,monto,fecha};
      fbSave('prestamos', STATE.prestamos[idx]);
      showToast('✅ Préstamo actualizado');
    }
  } else {
    const newP = {id:nextId(STATE.prestamos),nombre,monto,fecha};
    STATE.prestamos.push(newP);
    fbSave('prestamos', newP);
    showToast('✅ Préstamo añadido');
  }
  saveData(); closeModal('modal-prestamo'); renderPrestamos(); updateSidebarCapital();
}

function editPrestamo(id) {
  const p = STATE.prestamos.find(x=>x.id===id); if(!p)return;
  STATE.editingPrestamo = id;
  document.getElementById('modal-prestamo-title').textContent = 'Editar Préstamo';
  document.getElementById('p-nombre').value = p.nombre;
  document.getElementById('p-monto').value  = p.monto;
  document.getElementById('p-fecha').value  = p.fecha;
  openModal('modal-prestamo');
}

function resetPrestamoForm() {
  document.getElementById('p-nombre').value = '';
  document.getElementById('p-monto').value  = '';
  document.getElementById('p-fecha').value  = todayStr();
  document.getElementById('modal-prestamo-title').textContent = 'Añadir Préstamo';
}

function saveDiasTrabajados() {
  const val = parseInt(document.getElementById('p-dias').value)||26;
  STATE.diasTrabajados = Math.max(1,Math.min(365,val));
  saveData();
  if (FB_ENABLED && typeof DB !== 'undefined') {
    DB.saveConfig({ key:'settings', capitalInicial:STATE.capitalInicial, diasTrabajados:STATE.diasTrabajados, mesActivo:STATE.mesActivo });
  }
  renderPrestamos();
  updateSidebarCapital();
}

// ═══════════════════════════════════════════════════════════
//  RESUMEN
// ═══════════════════════════════════════════════════════════
function renderResumen() {
  const fin    = calcFinancials();
  const ventasF= filterByMes(STATE.ventas);

  document.getElementById('resumen-sub').textContent =
    STATE.mesActivo==='todos' ? 'Todos los meses' : labelMes(STATE.mesActivo);

  document.getElementById('resumen-balance').innerHTML = `
    <div class="balance-row"><span>Capital inicial</span><span class="mono">${fmt(STATE.capitalInicial)}</span></div>
    <div class="balance-row"><span>+ Total ventas</span><span class="mono pos">${fmt(fin.totalVentas)}</span></div>
    <div class="balance-row"><span>− Costos de venta</span><span class="mono neg">${fmt(fin.totalCostos)}</span></div>
    <div class="balance-row"><span>= Ganancias brutas</span><span class="mono pos">${fmt(fin.totalGanancias)}</span></div>
    <div class="balance-row"><span>− Gastos adicionales</span><span class="mono neg">${fmt(fin.totalGastos)}</span></div>
    <div class="balance-row"><span>− Compra de agregados</span><span class="mono neg">${fmt(fin.totalCompras)}</span></div>
    <div class="balance-row"><span>− Préstamos pendientes</span><span class="mono neg">${fmt(fin.totalPrestamos)}</span></div>
    <div class="balance-row total-row"><span>💎 Capital Actual</span><span class="mono ${fin.capitalActual>=0?'pos':'neg'}">${fmt(fin.capitalActual)}</span></div>
    <div class="balance-row"><span>⏳ Pendiente de cobro</span><span class="mono" style="color:var(--yellow)">${fmt(fin.pendiente)}</span></div>`;

  // Comparativa por mes
  const meses = getMesesDisponibles();
  if (meses.length>1) {
    const rows = meses.map(m=>{
      const vM = STATE.ventas.filter(v=>(v.fecha||'').startsWith(m));
      const gM = STATE.gastos.filter(g=>(g.fecha||'').startsWith(m));
      const cM = STATE.compras.filter(c=>(c.fecha||'').startsWith(m));
      const ganancias = vM.reduce((s,v)=>s+(+v.ganancia||0),0);
      const gastos2   = gM.reduce((s,g)=>s+(+g.monto||0),0);
      const compras2  = cM.reduce((s,c)=>s+(+c.costo||0),0);
      const ventas2   = vM.reduce((s,v)=>s+(+v.totalVenta||0),0);
      const neto      = ganancias - gastos2 - compras2;
      return `<div class="balance-row">
        <span>${labelMes(m)} <small style="color:var(--text3)">(${vM.length} pedidos)</small></span>
        <div style="text-align:right">
          <div class="mono" style="font-size:11px;color:var(--text2)">Vtas: ${fmt(ventas2)}</div>
          <div class="mono ${neto>=0?'pos':'neg'}" style="font-size:13px;font-weight:700">${fmt(neto)} neto</div>
        </div>
      </div>`;
    }).join('');
    document.getElementById('resumen-comparativa').innerHTML = rows;
    document.getElementById('resumen-comparativa-block').style.display='';
  } else {
    document.getElementById('resumen-comparativa-block').style.display='none';
  }

  // Top clientes
  const cg = {};
  ventasF.forEach(v=>{ const c=cap(v.cliente)||'Sin nombre'; cg[c]=(cg[c]||0)+(+v.ganancia||0); });
  document.getElementById('resumen-clientes').innerHTML = Object.entries(cg)
    .sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i)=>`
    <div class="rank-item">
      <div class="rank-n">${i+1}</div>
      <div class="rank-name">${k}</div>
      <div class="rank-val">${fmt(v)}</div>
    </div>`).join('');

  // Top materiales
  const mg = {};
  ventasF.forEach(v=>{ const m=cap(v.material); mg[m]=(mg[m]||0)+(+v.ganancia||0); });
  document.getElementById('resumen-materiales').innerHTML = Object.entries(mg)
    .sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i)=>`
    <div class="rank-item">
      <div class="rank-n">${i+1}</div>
      <div class="rank-name">${k}</div>
      <div class="rank-val">${fmt(v)}</div>
    </div>`).join('');

  // Chart semanal
  destroyChart('semana');
  const sem = {};
  ventasF.forEach(v=>{ const wk=getWeekKey(v.fecha); sem[wk]=(sem[wk]||0)+(+v.ganancia||0); });
  const wks = Object.keys(sem).sort().slice(-10);
  if (wks.length) {
    charts.semana = new Chart(document.getElementById('chartSemana').getContext('2d'),{
      type:'line',
      data:{ labels:wks.map(d=>d.slice(5)), datasets:[{
        label:'Ganancia semanal',data:wks.map(k=>sem[k]),
        borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,.1)',
        tension:0.4,fill:true,pointBackgroundColor:'#22c55e',pointRadius:5
      }]},
      options:{ plugins:{legend:{display:false}}, scales:{ x:CHART_OPTS.x, y:CHART_OPTS.y } }
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════
function renderConfig() {
  document.getElementById('cfg-capital').value = STATE.capitalInicial;
  document.getElementById('cfg-dias').value    = STATE.diasTrabajados;
  const fbUrl = localStorage.getItem('fb_url')||'';
  document.getElementById('cfg-firebase-url').value = fbUrl;
  const badge = document.getElementById('firebase-badge');
  badge.textContent = FB_ENABLED ? '✅ Conectado' : (fbUrl?'⚠️ No verificado':'Sin configurar');
  badge.className   = `badge-status ${FB_ENABLED?'ok':''}`;
}

function saveConfig() {
  const cap  = parseFloat(document.getElementById('cfg-capital').value);
  const dias = parseInt(document.getElementById('cfg-dias').value);
  if (!isNaN(cap)&&cap>=0) STATE.capitalInicial = cap;
  if (!isNaN(dias)&&dias>0) STATE.diasTrabajados = dias;
  saveData();
  if (FB_ENABLED && typeof DB !== 'undefined') {
    DB.saveConfig({ key:'settings', capitalInicial:STATE.capitalInicial, diasTrabajados:STATE.diasTrabajados, mesActivo:STATE.mesActivo });
  }
  updateSidebarCapital();
  showToast('✅ Configuración guardada');
}

function saveFirebaseUrl() {
  const url = document.getElementById('cfg-firebase-url').value.trim().replace(/\/$/,'');
  if (!url) { showToast('⚠️ Ingresa la URL de Firebase','error'); return; }
  if (typeof DB !== 'undefined') {
    DB.setFirebaseUrl(url);
  } else {
    localStorage.setItem('fb_url',url);
    showToast('✅ URL guardada. Recargando...','success');
    setTimeout(()=>location.reload(),1200);
  }
}

async function testFirebaseConnection() {
  const url = document.getElementById('cfg-firebase-url').value.trim().replace(/\/$/,'');
  const box = document.getElementById('firebase-status-box');
  box.style.display='block';
  box.className='firebase-status-box';
  box.textContent='🟡 Probando conexión...';
  if (!url) { box.textContent='⚠️ Ingresa la URL primero'; box.className='firebase-status-box err'; return; }
  try {
    const res = await fetch(`${url}/config.json`);
    if (res.ok) {
      box.textContent='✅ Conexión exitosa con Firebase';
      box.className='firebase-status-box ok';
    } else {
      box.textContent=`⚠️ Error HTTP ${res.status} — Verifica la URL y las reglas de seguridad`;
      box.className='firebase-status-box err';
    }
  } catch(e) {
    box.textContent='❌ No se pudo conectar. Verifica la URL y tu conexión a internet.';
    box.className='firebase-status-box err';
  }
}

function clearFirebaseUrl() {
  localStorage.removeItem('fb_url');
  showToast('🔌 Firebase desconectado');
  setTimeout(()=>location.reload(),1000);
}

function exportarDatos() {
  const data = {
    exportDate: new Date().toISOString(),
    capitalInicial: STATE.capitalInicial,
    diasTrabajados: STATE.diasTrabajados,
    ventas:   STATE.ventas,
    gastos:   STATE.gastos,
    compras:  STATE.compras,
    prestamos:STATE.prestamos,
  };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `flores-agregados-${todayStr()}.json`;
  a.click();
  showToast('✅ Datos exportados');
}

function importarDatos(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.ventas)    STATE.ventas    = data.ventas;
      if (data.gastos)    STATE.gastos    = data.gastos;
      if (data.compras)   STATE.compras   = data.compras;
      if (data.prestamos) STATE.prestamos = data.prestamos;
      if (data.capitalInicial) STATE.capitalInicial = data.capitalInicial;
      if (data.diasTrabajados) STATE.diasTrabajados = data.diasTrabajados;
      saveData();
      renderMesSwitcher();
      switchTab('dashboard');
      showToast('✅ Datos importados correctamente');
    } catch(err) {
      showToast('❌ Error al leer el archivo JSON','error');
    }
  };
  reader.readAsText(file);
  evt.target.value='';
}

function resetLocalData() {
  if (!confirm('¿Seguro que deseas limpiar todos los datos locales? Se restaurarán los datos originales.')) return;
  localStorage.removeItem(LS_KEY);
  location.reload();
}

// ═══════════════════════════════════════════════════════════
//  ELIMINAR
// ═══════════════════════════════════════════════════════════
function confirmDelete(type, id, label='') {
  const names = {venta:'pedido',gasto:'gasto',compra:'compra',prestamo:'préstamo'};
  document.getElementById('confirm-msg').innerHTML =
    `¿Eliminar ${names[type]||'registro'} <strong>${label||('#'+id)}</strong>?<br>
     <small style="color:var(--text3)">Esta acción no se puede deshacer.</small>`;
  openModal('modal-confirm');
  document.getElementById('confirm-delete-btn').onclick = () => doDelete(type,id);
}

async function doDelete(type, id) {
  if (type==='venta')    STATE.ventas    = STATE.ventas.filter(v=>v.id!==id);
  if (type==='gasto')    STATE.gastos    = STATE.gastos.filter(g=>g.id!==id);
  if (type==='compra')   STATE.compras   = STATE.compras.filter(c=>c.id!==id);
  if (type==='prestamo') STATE.prestamos = STATE.prestamos.filter(p=>p.id!==id);
  await fbDelete(type==='venta'?'ventas':type==='gasto'?'gastos':type==='compra'?'compras':'prestamos', id);
  saveData();
  closeModal('modal-confirm');
  showToast('🗑️ Registro eliminado');
  if (type==='venta')    renderVentas();
  if (type==='gasto')    renderGastos();
  if (type==='compra')   renderStock();
  if (type==='prestamo') renderPrestamos();
  updateSidebarCapital();
  renderMesSwitcher();
}

// ═══════════════════════════════════════════════════════════
//  SIDEBAR CAPITAL
// ═══════════════════════════════════════════════════════════
function updateSidebarCapital() {
  const fin = calcFinancials();
  const el  = document.getElementById('sidebar-capital');
  if (!el) return;
  el.textContent = fmt(fin.capitalActual);
  el.style.color = fin.capitalActual>=0?'var(--teal)':'var(--red)';
}

// ═══════════════════════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════════════════════
function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  STATE.editingVenta=STATE.editingGasto=STATE.editingCompra=STATE.editingPrestamo=null;
  if (id==='modal-venta')    resetVentaForm();
  if (id==='modal-gasto')    resetGastoForm();
  if (id==='modal-compra')   resetCompraForm();
  if (id==='modal-prestamo') resetPrestamoForm();
}

// ═══════════════════════════════════════════════════════════
//  SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  sb.classList.toggle('open');
  ov.classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

// ═══════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg, type='success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.className='toast hidden'; }, 3200);
}


// ===========================================================
//  INIT
// ===========================================================
function init() {
  // 1. Limpiar loading desde el inicio
  const lo = document.getElementById('loading-overlay');
  if (lo) lo.style.display = 'none';

  // 2. Cargar datos
  loadData();

  // 3. Fecha sidebar
  const dateEl = document.getElementById('sidebar-date');
  if (dateEl) dateEl.textContent =
    new Date().toLocaleDateString('es-PE', {weekday:'short',day:'2-digit',month:'short',year:'numeric'});

  // 4. Nav clicks
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
      if (window.innerWidth < 900) closeSidebar();
    });
  });

  // 5. Cerrar modal al click fuera
  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => {
      if (e.target === ov) {
        ov.classList.add('hidden');
        STATE.editingVenta = STATE.editingGasto = STATE.editingCompra = STATE.editingPrestamo = null;
      }
    });
  });

  // 6. ESC cierra modales
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape')
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
  });

  // 7. Renderizar dashboard con datos locales
  renderMesSwitcher();
  renderDashboard();
  updateSidebarCapital();

  // 8. Firebase en segundo plano (500ms despues, no bloquea)
  setTimeout(() => {
    initFirebase()
      .then(() => {
        if (FB_ENABLED) {
          renderMesSwitcher();
          const tab = document.querySelector('.nav-item.active');
          if (tab) switchTab(tab.dataset.tab);
          updateSidebarCapital();
        }
      })
      .catch(e => {
        console.warn('[FB] sin conexion:', e.message);
        updateSyncPill('offline');
      });
  }, 500);
}

document.addEventListener('DOMContentLoaded', init);

// Re-render stock when switching orientation/size
window.addEventListener('resize', () => {
  const stockTab = document.getElementById('tab-stock');
  if (stockTab && !stockTab.classList.contains('hidden')) {
    renderStock();
  }
});