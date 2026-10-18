const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {realpathSync,existsSync}=require('node:fs');
const path=require('node:path');
const sleep=t=>new Promise(r=>setTimeout(r,t));
const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(existsSync);
if(!chrome)throw Error('El runner no tiene Chromium/Chrome, instalar navegador para E2E');
const file='file://'+realpathSync(path.join(__dirname,'..','index.html'));
const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--remote-allow-origins=*','--remote-debugging-port=9444','--user-data-dir=/tmp/osaka-browser-test-'+process.pid,file],{stdio:'ignore'});
let ws;
async function main(){
 let target;
 for(let i=0;i<80;i++){try{const list=await (await fetch('http://127.0.0.1:9444/json')).json();target=list.find(t=>t.type==='page'&&t.url.startsWith('file:'))||list.find(t=>t.type==='page');if(target)break;}catch(e){}await sleep(100);}
 assert.ok(target,'No se pudo lanzar Chrome');
 ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
 let id=0;const pending=new Map(),errors=[];
 ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}));});
 const evalJS=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
 await send('Runtime.enable');
 for(let i=0;i<35;i++){if(await evalJS("Boolean(window.F30?.Panel && document.querySelectorAll('.paramitem').length===72)"))break;await sleep(150);}
 assert.equal(await evalJS("document.querySelectorAll('.paramitem').length"),72,'Catálogo no aparece');
 assert.equal(await evalJS("document.querySelectorAll('.hardkey').length"),4,'No están las cuatro teclas');
 assert.equal(await evalJS("document.querySelectorAll('#lesson option').length"),14);
 const rect=async key=>evalJS("(()=>{const b=document.querySelector('[data-key="+JSON.stringify(key)+"]');document.documentElement.style.scrollBehavior='auto';b.scrollIntoView({behavior:'instant',block:'center'});const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()");
 const hold=async (key,ms)=>{const {x,y}=await rect(key);await send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',buttons:1,clickCount:1});await sleep(ms);await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',buttons:0,clickCount:1});await sleep(120);};
 await hold('SET',5100);
 assert.equal(await evalJS("document.querySelector('#screen').textContent"),'SLS','SET 5 s no abrió los parámetros');
 await hold('SET',100);
 assert.equal(await evalJS("document.querySelector('#screenLabel').textContent"),'SLS · EDITANDO','SET corto no abrió valor');
 await hold('POWER',2100);
 assert.ok((await evalJS("document.querySelector('#screenLabel').textContent")).includes('Pr1'),'Botón superior no salió del menú');
 assert.deepEqual(errors,[],'Excepciones JS en el navegador');
 console.log('E2E F30: 72 códigos, 14 ejercicios, cuatro teclas y pulsaciones reales OK');
}
main().then(()=>{ws?.close();proc.kill();}).catch(e=>{console.error(e);ws?.close();proc.kill();process.exitCode=1;});
