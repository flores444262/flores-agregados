const { spawn } = require('child_process');
const path = require('path');
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const fileUrl = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/').replace(/ /g, '%20');
const PORT = 9337;
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--no-sandbox',
  `--remote-debugging-port=${PORT}`,'--user-data-dir='+path.join(process.env.TEMP,'chrome-cdp4'),'about:blank']);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await sleep(1500);
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
  const ws = new WebSocket(list.find(t=>t.type==='page').webSocketDebuggerUrl);
  const logs=[]; let id=0; const pending={};
  const cmd=(m,p={})=>new Promise(res=>{const i=++id;pending[i]=res;ws.send(JSON.stringify({id:i,method:m,params:p}));});
  ws.onmessage=ev=>{const m=JSON.parse(ev.data);
    if(m.id&&pending[m.id]){pending[m.id](m.result);delete pending[m.id];return;}
    if(m.method==='Runtime.exceptionThrown')logs.push('[EXCEPTION] '+(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text));};
  await new Promise(r=>ws.onopen=r);
  await cmd('Runtime.enable'); await cmd('Page.enable');
  await cmd('Page.navigate',{url:fileUrl}); await sleep(4500);
  const ev=async e=>{const r=await cmd('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true});
    return r.exceptionDetails?('ERR: '+(r.exceptionDetails.exception?.description||r.exceptionDetails.text)):r.result.value;};

  console.log('Firebase conectado:', await ev('FB_ENABLED'), '| online:', await ev('DB_STATUS.online'));
  console.log('pill texto =', await ev(`document.querySelector('#sync-pill .pill-label').textContent`));

  const tests = [
    {name:'GASTO',   fn:`(function(){openModal('modal-gasto');document.getElementById('g-fecha').value='2026-06-23';document.getElementById('g-descripcion').value='DIAG_gasto';document.getElementById('g-monto').value='99';saveGasto();return STATE.gastos.length;})()`, arr:'gastos'},
    {name:'COMPRA',  fn:`(function(){openModal('modal-compra');document.getElementById('c-fecha').value='2026-06-23';document.getElementById('c-agregado').value='confitillo';document.getElementById('c-cantidad').value='5';document.getElementById('c-costo').value='200';saveCompra();return STATE.compras.length;})()`, arr:'compras'},
    {name:'PRESTAMO',fn:`(function(){openModal('modal-prestamo');document.getElementById('p-nombre').value='DIAG_prest';document.getElementById('p-monto').value='123';document.getElementById('p-fecha').value='2026-06-23';savePrestamo();return STATE.prestamos.length;})()`, arr:'prestamos'},
    {name:'VENTA',   fn:`(function(){switchTab('ventas');openModal('modal-venta');document.getElementById('v-fecha').value='2026-06-23';document.getElementById('v-cliente').value='DIAG_venta';document.getElementById('v-material').value='greda';document.getElementById('v-cantidad').value='1';document.getElementById('v-precio-venta').value='10';saveVenta();return STATE.ventas.length;})()`, arr:'ventas'},
  ];
  console.log('\n=== Probando todos los botones GUARDAR ===');
  for (const t of tests) {
    const before = await ev(`STATE.${t.arr}.length`);
    await ev(t.fn); await sleep(800);
    const after = await ev(`STATE.${t.arr}.length`);
    console.log(`${t.name}: ${before} -> ${after}  ${after>before?'✅ guardó':'❌ NO guardó'}`);
  }
  // saveConfig
  console.log('\n=== saveConfig ===');
  await ev(`(function(){switchTab('configuracion');document.getElementById('cfg-capital').value='7777';document.getElementById('cfg-dias').value='26';saveConfig();})()`);
  await sleep(800);
  console.log('capitalInicial tras saveConfig =', await ev('STATE.capitalInicial'), (await ev('STATE.capitalInicial'))===7777?'✅':'❌');

  console.log('\nexcepciones:', logs.length?'\n'+logs.join('\n'):'NINGUNA ✅');
  ws.close(); chrome.kill(); process.exit(0);
})().catch(e=>{console.error('FAIL',e);chrome.kill();process.exit(1);});
