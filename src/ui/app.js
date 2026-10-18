(function(root){
'use strict';
const {catalog,Plant,Panel,lessons}=root.F30;
const $=id=>document.getElementById(id);
const safe=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let plant=new Plant(),panel=new Panel(plant),lesson=null,playing=null,idleTimer=null,keyDown=null,holdTimer=null,passed=new Set();
try{passed=new Set(JSON.parse(localStorage.getItem('f30-lessons-v3')||'[]'));}catch(e){}
try{const saved=JSON.parse(localStorage.getItem('f30-params-v3')||'{}');for(const [code,value] of Object.entries(saved))if(catalog.byCode[code])plant.setParam(code,value);}catch(e){}
const secText=n=>String(Math.floor(n/3600)).padStart(2,'0')+':'+String(Math.floor(n%3600/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const temp=n=>n===null?'ERR':Number(n).toFixed(1).replace('.',',')+' °C';
function save(){try{localStorage.setItem('f30-params-v3',JSON.stringify(plant.p));}catch(e){}}
function display(){
 const x=panel.display();const value=x.text;
 if(typeof value==='number'){return (plant.p.iuP==='C0'||plant.p.iuP==='F0'?Math.round(value).toFixed(0):Number(value).toFixed(1)).replace('.',',');}
 return String(value);
}
function repaint(){
 const snap=plant.snapshot(),screen=display();
 $('screen').textContent=screen;
 $('screenLabel').textContent=panel.display().label;
 $('keynote').textContent=panel.note;
 $('labclock').textContent=secText(snap.now);
 const indicators=[['ledComp',snap.comp||snap.heat],['ledDef',snap.def],['ledFan',snap.fan],['ledAlarm',plant.fail.P1||plant.fail.P2||plant.fail.P3]];
 for(const [id,active]of indicators)$(''+id).classList.toggle('active',!!active);
 for(const [id,active]of [['statusComp',snap.comp||snap.heat],['statusDef',snap.def],['statusFan',snap.fan]]){const el=$(id);el.classList.toggle('on',!!active);el.classList.toggle('def',id==='statusDef'&&active);el.querySelector('span').textContent=active?'ON':'OFF';}
 $('relays').textContent=snap.relays.map((on,i)=>'OUT'+(i+1)+' ('+plant.p['oo'+(i+1)]+'): '+(on?'ON':'OFF')).join('  ·  ');
 let reason='';
 if(!snap.powered)reason='Controlador en Stand-by: las salidas están desactivadas.';
 else if(plant.fail.P1)reason='Pr1 averiada: lectura E1 y control normal de la temperatura interrumpido.';
 else if(snap.def)reason='Desescarche activo. Finalizará por '+(plant.p.dPE==='oF'?'tiempo':plant.p.dPE==='EP'?'sonda EP':'sonda Pr1')+' o al superar el límite de dde.';
 else if(snap.drain)reason='Periodo de goteo dtd: se mantiene parado el compresor.';
 else if(snap.reason)reason='Salida en espera: '+snap.reason;
 else reason='SP='+plant.p.SP+' °C · rd='+plant.p.rd+' °C · en frío se arranca a SP+rd y se para a SP. El termostato no cambia físicamente las temperaturas.';
 $('why').textContent=reason;
 for(const name of ['P1','P2','P3']){const sl=$('s'+name),v=$('v'+name);if(sl&&document.activeElement!==sl)sl.value=plant.t[name];if(v)v.textContent=temp(plant.t[name]);$('fail'+name.slice(1)).checked=plant.fail[name];}
 $('digitalInput').checked=plant.digital;
 $('progress').textContent=passed.size+' / '+lessons.length+' superadas';
 const latest=snap.events.slice(-32).reverse();
 $('history').innerHTML=latest.map(e=>'<div class="event"><b>'+secText(e.at)+'</b> '+safe(e.detail)+'</div>').join('')||'<p class="sideinfo">Sin eventos todavía.</p>';
 catalogReadOnly();
 if(lesson)renderGoals();
}
function catalogReadOnly(){const needle=$('lookup').value.trim().toLowerCase();const defs=catalog.defs.filter(d=>d.code.toLowerCase().includes(needle)||d.title.toLowerCase().includes(needle)||d.group.toLowerCase().includes(needle));$('paramcount').textContent=defs.length+' / 72';$('paramlist').innerHTML=defs.map(d=>'<article class="paramitem"><b>'+safe(d.code)+'</b><span class="pvalue">'+safe(plant.p[d.code])+'</span><small>'+safe(d.title)+'</small><span class="coverage">'+(d.coverage==='simulado'?'Motor didáctico':'Consultar manual; comportamiento avanzado')+'</span></article>').join('');}
function renderGoals(){const states=lesson.goals.map(([title,fn])=>{let ok=false;try{ok=!!fn({plant,panel});}catch(e){}return {title,ok};});
 $('exercise').innerHTML='<h3>'+safe(lesson.title)+'</h3><p>'+safe(lesson.desc)+'</p>'+states.map(g=>'<div class="objective '+(g.ok?'pass':'')+'"><span>'+(g.ok?'✓':'○')+'</span>'+safe(g.title)+'</div>').join('');
}
function prepare(){
 const wasPlaying=playing;if(wasPlaying){clearInterval(playing);playing=null;$('autoplay').textContent='▶ Automático';}
 const id=$('lesson').value;lesson=lessons.find(x=>x.id===id);
 plant=new Plant();panel=new Panel(plant);if(lesson.env)for(const [k,v]of Object.entries(lesson.env))plant.setSensor(k,v);
 panel.note='Ejercicio preparado. Programa solo desde SET y las flechas.';
 panel.view='auto';$('hintbox').hidden=true;$('gradebox').textContent='Configuración inicial cargada. Realiza los objetivos desde el termostato.';$('gradebox').classList.remove('good');
 repaint();
}
function grade(){if(!lesson)return;const checks=lesson.goals.map(([,fn])=>{try{return !!fn({plant,panel});}catch(e){return false;}});const count=checks.filter(Boolean).length;
 if(count===checks.length){passed.add(lesson.id);try{localStorage.setItem('f30-lessons-v3',JSON.stringify([...passed]));}catch(e){}$('gradebox').classList.add('good');$('gradebox').textContent='Ejercicio superado · '+count+'/'+checks.length+'. Las transiciones se observaron en el motor, no solo se comprobó un valor.';}else{$('gradebox').classList.remove('good');$('gradebox').textContent='Aún faltan '+(checks.length-count)+' pasos. Comprueba valores, sondas y salidas desde el equipo.';}repaint();}
function key(key,seconds){panel.press(key,seconds);save();repaint();if(idleTimer)clearTimeout(idleTimer);if(panel.mode!=='normal')idleTimer=setTimeout(()=>{panel.idle();repaint();},10000);}
function stopKey(ev){if(!keyDown)return;if(ev&&ev.pointerId!=null&&keyDown.pointerId!==ev.pointerId)return;
 const duration=Math.max(.08,(performance.now()-keyDown.started)/1000),k=keyDown.key;keyDown.el.classList.remove('holding');keyDown=null;if(holdTimer)clearInterval(holdTimer);$('hold').textContent='Mantén presionada una tecla para utilizar su función larga';key(k,duration);
}
document.querySelectorAll('.hardkey').forEach(btn=>{
 btn.addEventListener('pointerdown',ev=>{ev.preventDefault();if(keyDown)return;btn.setPointerCapture(ev.pointerId);keyDown={key:btn.dataset.key,started:performance.now(),el:btn,pointerId:ev.pointerId};btn.classList.add('holding');holdTimer=setInterval(()=>{if(!keyDown)return;const s=(performance.now()-keyDown.started)/1000;$('hold').textContent='Pulsando '+keyDown.key+' · '+s.toFixed(1)+' s / '+(keyDown.key==='UP'||keyDown.key==='SET'?5:keyDown.key==='POWER'?1:0)+' s';},120);});
 btn.addEventListener('pointerup',stopKey);btn.addEventListener('pointercancel',stopKey);btn.addEventListener('contextmenu',ev=>ev.preventDefault());
});
const keymap={Enter:'SET',ArrowUp:'UP',ArrowDown:'DOWN',Escape:'POWER'};
let physicalKey=null;
document.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea')||!keymap[e.key])return;e.preventDefault();if(physicalKey)return;physicalKey={key:keymap[e.key],started:performance.now()};$('hold').textContent='Tecla '+physicalKey.key+' mantenida...';});
document.addEventListener('keyup',e=>{if(!physicalKey||keymap[e.key]!==physicalKey.key)return;e.preventDefault();const k=physicalKey;physicalKey=null;key(k.key,(performance.now()-k.started)/1000);$('hold').textContent='Mantén presionada una tecla para utilizar su función larga';});
const container=$('probes');container.innerHTML=['P1','P2','P3'].map((name,i)=>'<div class="probe"><label for="s'+name+'"><span>'+(i===0?'Pr1 · cámara':i===1?'Pr2 · evaporador':'Pr3 · auxiliar / digital')+'</span><strong id="v'+name+'">—</strong></label><input type="range" min="-30" max="50" step="0.1" id="s'+name+'" value="'+plant.t[name]+'"></div>').join('');
for(const n of ['P1','P2','P3']){$('s'+n).addEventListener('input',e=>{plant.setSensor(n,Number(e.target.value));repaint();});$('fail'+n.slice(1)).addEventListener('change',e=>{plant.setFailure(n,e.target.checked);repaint();});}
$('digitalInput').addEventListener('change',e=>{plant.setDigital(e.target.checked);repaint();});
document.querySelectorAll('[data-seconds]').forEach(b=>b.addEventListener('click',()=>{plant.advance(Number(b.dataset.seconds));repaint();}));
$('autoplay').onclick=()=>{if(playing){clearInterval(playing);playing=null;$('autoplay').textContent='▶ Automático';}else{playing=setInterval(()=>{plant.advance(1);repaint();},150);$('autoplay').textContent='⏸ Pausar';}};
$('lesson').innerHTML=lessons.map(l=>'<option value="'+l.id+'">Nivel '+l.level+' · '+safe(l.title)+'</option>').join('');
$('lesson').addEventListener('change',prepare);$('loadLesson').onclick=prepare;$('grade').onclick=grade;$('hint').onclick=()=>{$('hintbox').textContent=lesson.hint;$('hintbox').hidden=!$('hintbox').hidden;};
$('lookup').addEventListener('input',catalogReadOnly);

// Los eventos del laboratorio cambian solo condiciones físicas; jamás escriben parámetros.
prepare();
})(typeof window!=='undefined'?window:globalThis);
