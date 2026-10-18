(function(root){
'use strict';
const cat=root.F30.catalog;
const $=id=>document.getElementById(id);
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const press=(k,long=false)=>({key:k,hold:long?(k==='SET'||k==='UP'?'5 s':'2 s'):'breve'});
const K={set:[press('SET')],menu:[press('SET',true)],up:[press('UP')],longUp:[press('UP',true)],down:[press('DOWN')],exit:[press('POWER',true)]};
const step=(title,body,keys=[],screen='')=>({title,body,keys,screen});
const route=(from,to)=>{
 const n=cat.defs.length,fi=cat.byCode[from]?.id-1,ti=cat.byCode[to]?.id-1;
 if(fi==null||ti==null)throw Error('Código no encontrado en el catálogo');
 const up=(ti-fi+n)%n,down=(fi-ti+n)%n;
 return up<=down?{key:'UP',times:up}:{key:'DOWN',times:down};
};
const symbol={SET:'SET',UP:'▲',DOWN:'▼',POWER:'⏻'};
const menuStart=()=>step('Entra en programación','Desde la lectura normal, mantén pulsado SET durante cinco segundos.',K.menu,'SLS');
const goTo=(from,code)=>{
 const r=route(from,code);const t=r.times;
 return step('Busca el código '+code,t===0?'Ya estás situado en '+code+'. No hace falta cambiar de posición.':'Desde '+from+', pulsa '+symbol[r.key]+' '+t+' '+(t===1?'vez':'veces')+' con toques cortos, hasta ver '+code+'. También puedes mantener una flecha para recorrer más rápido; en ese caso mira la pantalla.',t?[press(r.key)]:[],code);
};
const editValue=(code,value)=>[
 step('Abre '+code,'Pulsa SET brevemente para pasar del código al valor actual.',K.set,String(cat.byCode[code]?.defaultValue??'')),
 step('Ajusta '+code+' = '+String(value),'Modifica el valor con ▲ o ▼ hasta que aparezca exactamente '+String(value)+'. El número de pulsaciones depende del valor que tenga guardado el termostato; mantener la flecha acelera la edición.',[press('UP'),press('DOWN')],String(value)),
 step('Guarda '+code,'Pulsa SET una sola vez. Si la pantalla vuelve a mostrar el código '+code+', el cambio quedó confirmado en el simulador.',K.set,code)
];
const edits=(pairs)=>{
 const out=[menuStart()];let from='SLS';
 for(const [code,val] of pairs){
   if(!cat.byCode[code])throw Error('Parámetro inexistente '+code);
   out.push(goTo(from,code),...editValue(code,val));from=code;
 }
 out.push(step('Sal del menú','Mantén ⏻ dos segundos para volver a la lectura normal. No pulses el botón de encendido durante la edición de un valor.',K.exit,'13.0'));
 return out;
};
const finish=msg=>({msg});
const recipes=[
 {id:'desescarche-manual',icon:'❄',group:'DESCARCHE',title:'Iniciar desescarche manual',desc:'La combinación más sencilla: una única tecla mantenida durante cinco segundos.',steps:[
  step('Vuelve a la pantalla normal','Si estás en el menú, mantén ⏻ dos segundos para salir. Si ya ves una temperatura, pasa al siguiente paso.',K.exit,'13.0'),
  step('Asegura que Pr2 permita el inicio','La sonda del evaporador debe indicar una temperatura admisible según dtS y dtE. Si no cumple la condición, la orden puede ser rechazada.',[],'Pr2'),
  step('Mantén ▲ durante 5 segundos','No es un toque corto. Pulsa la flecha superior y mantenla durante cinco segundos completos.',K.longUp,'dEF'),
  step('Comprueba el testigo de desescarche','Se debe activar el indicador DEF si el equipo acepta la orden.',[],'DEF ON')
 ],result:finish('Para detenerlo manualmente, desde lectura normal vuelve a mantener ▲ cinco segundos. Si no arranca, comprueba la sonda Pr2 y los parámetros dtS y dtE.')},
 {id:'agua-fria',icon:'🥛',group:'DESCARCHE',title:'Práctica con vaso: 13 → 17 °C',desc:'Configura Pr2 para simular un evaporador a 13 °C y terminar el desescarche al calentarse hasta 17 °C.',steps:[
  ...edits([['iP2','EP'],['dtS',15],['dtE',17],['dPE','EP'],['dde',2]]),
  step('Pr2 al agua fría','En el banco de pruebas lleva Pr2 a 13 °C. La pantalla normal puede mostrar Pr1: confirma que estás modificando Pr2 en el banco.',[],'13.0'),
  step('Inicia el desescarche','En lectura normal mantén ▲ cinco segundos.',K.longUp,'dEF'),
  step('Simula el calentamiento del evaporador','Eleva Pr2 desde 13 hasta 17 °C. El desescarche acaba cuando alcanza ese límite; si pasan antes los 2 minutos de dde, acaba por tiempo.',[],'17.0')
 ],result:finish('Recuerda: el OSAKA solo mide y activa relés. Un vaso de agua a 13 °C no llegará por sí solo a 17 °C. En la práctica virtual, sube Pr2 desde el banco de pruebas.')},
 {id:'desescarche-automatico',icon:'⏱',group:'DESCARCHE',title:'Automático cada 5 min, 2 min, 17 °C',desc:'Configura la repetición automática de la práctica y la doble condición de finalización.',steps:[
  ...edits([['iP2','EP'],['ddC','rt'],['ddi',-5],['dSd',-5],['dde',2],['dPE','EP'],['dtE',17],['dtS',15]]),
  step('Pon Pr2 por debajo de 15 °C','En el banco del simulador, lleva Pr2 a unos 13 °C. Debe permitir el inicio del desescarche.',[],'13.0'),
  step('Avanza cinco minutos','Usa la simulación del reloj externo: pulsa +5 min en el banco. El F30 solicitará el desescarche automáticamente, si se cumplen las condiciones.',[],'DEF ON'),
  step('Verifica el final','Lleva Pr2 a 17 °C para terminar por temperatura. Si no alcanza 17 °C, el límite dde de 2 minutos terminará el ciclo.',[],'17.0')
 ],result:finish('En nuestro simulador ddi = -5 y dSd = -5 significan 5 minutos (negativo). Poner 5 positivo significa 5 horas. La práctica exige Pr2 suficientemente fría al inicio.')},
 {id:'compresor',icon:'🌡',group:'COMPRESOR',title:'Arrancar a 19 y parar a 15 °C',desc:'Ejercicio de temperatura de consigna y diferencial del compresor.',steps:[
  step('Pulsa SET una vez','Desde la lectura normal, un toque breve en SET abre la consigna SP.',K.set,'SP'),
  step('Ajusta la consigna a 15 °C','Usa ▲/▼ hasta 15 °C.',[press('UP'),press('DOWN')],'15.0'),
  step('Pulsa SET para guardar','Vuelve a la lectura principal.',K.set,'15.0'),
  ...edits([['rd',4],['rHC','C']]),
  step('Comprueba arranque y paro','En el banco, lleva Pr1 a 19 °C para activar compresor, luego a 15 °C para detenerlo.',[],'19→15')
 ],result:finish('SP=15, rd=4, rHC=C: arranque al subir a 19 °C y parada al bajar a 15 °C, siempre que no existan retardos ni desescarche activo.')},
 {id:'fan',icon:'🌀',group:'VENTILADOR',title:'Conseguir que se encienda ventilador',desc:'Asigna salida 3 a Fn y evita que Pr2 a 13 °C lo bloquee en esta práctica.',steps:[
  ...edits([['iP2','EP'],['oo3','Fn'],['FFL',25]]),
  step('Revisa las condiciones','Sitúa Pr2 por debajo de 25 °C, por ejemplo 13 °C, y Pr1 por encima del punto de arranque de refrigeración. Comprueba el LED del ventilador.',[],'FAN ON')
 ],result:finish('El icono de ventilador representa una orden de salida; no significa que exista un ventilador físico conectado. En la instalación real hay más condiciones posibles.')},
 {id:'sonda-2',icon:'📟',group:'SONDAS',title:'Configurar y consultar Pr2',desc:'Asigna la segunda sonda al evaporador y visualízala en pantalla.',steps:[
  ...edits([['iP2','EP'],['idS','P2']]),
  step('Lee la temperatura de Pr2','Al regresar a la lectura normal, la pantalla representa la temperatura de la segunda sonda.',[],'13.0')
 ],result:finish('Pr2 es la sonda que se usa normalmente para terminar el desescarche por temperatura.')},
 {id:'ver-sondas',icon:'👁',group:'SONDAS',title:'Consultar Pr1, Pr2 y Pr3',desc:'Mira las temperaturas sin cambiar la programación.',steps:[
  step('Sal a lectura normal','Si estás programando, mantén ⏻ dos segundos.',K.exit,'20.0'),
  step('Pulsa ⏻ brevemente','En este simulador, la pulsación corta del botón superior izquierdo recorre P1, P2, P3 y SP.',[press('POWER')],'P1'),
  step('Repite para consultar las demás','Pulsa de nuevo ⏻ para recorrer las otras lecturas. No lo mantengas, porque activaría otra función.',[press('POWER')],'P2')
 ],result:finish('Este atajo de lectura describe la interfaz del simulador; confirma en el manual y en tu variante física qué tecla muestra las sondas.')},
 {id:'guardar',icon:'💾',group:'TECLADO',title:'Entrar, cambiar y guardar parámetros',desc:'La maniobra general válida para cualquier código del catálogo.',steps:[
  menuStart(),
  step('Busca el código','Con ▲/▼ recorre los nombres hasta encontrar el código buscado.',[press('UP'),press('DOWN')],'ddi'),
  step('Pulsa SET brevemente','Entrarás en el valor actual del parámetro.',K.set,'6'),
  step('Modifica con las flechas','▲ sube y ▼ baja. Para cambios grandes mantén pulsada la flecha y comprueba el valor.',[press('UP'),press('DOWN')],'-5'),
  step('Pulsa SET otra vez','Al volver a aparecer el código (por ejemplo ddi), el valor queda guardado.',K.set,'ddi'),
  step('Sal manteniendo ⏻ 2 segundos','Vuelve a la lectura normal del controlador.',K.exit,'13.0')
 ],result:finish('SET cambia entre el código y su valor. Si ves otra vez el nombre del código tras pulsar SET, significa que has guardado en el simulador.')}
];
const select=$('recipe-list'),listEl=$('steps'),drop=$('lesson');
let active=recipes[0],current=0,selectedParam='ddi';
select.innerHTML=recipes.map(r=>'<button type="button" class="recipe-item" data-recipe="'+escape(r.id)+'"><span class="recipe-icon">'+r.icon+'</span><span><strong>'+escape(r.title)+'</strong><small>'+escape(r.group)+'</small></span></button>').join('');
function tags(s){return s.keys.map(k=>'<span class="keytag '+(k.hold!=='breve'?'long':'')+'">'+escape(symbol[k.key])+' · '+escape(k.hold)+'</span>').join('')||'<span class="simple-action">Acción del banco / comprobación</span>';}
function highlight(step){
 document.querySelectorAll('[data-guide-key]').forEach(el=>el.classList.remove('active'));
 step?.keys.forEach(x=>document.querySelector('[data-guide-key="'+x.key+'"]')?.classList.add('active'));
 $('lcd-readout').textContent=step?.screen||'13.0';$('lcd-caption').textContent=step?.screen==='dEF'?'DESHIELO':'TECLA Y PANTALLA';
 $('lcd-hint').textContent=step?.keys.length?'Botón destacado = siguiente pulsación':'Comprueba condiciones en el banco exterior';
}
function render(){
 $('recipe-tag').textContent=active.group+' · GUÍA DE PULSACIONES';
 $('recipe-title').textContent=active.title;$('recipe-desc').textContent=active.desc;
 document.querySelectorAll('[data-recipe]').forEach(b=>{b.classList.toggle('active',b.dataset.recipe===active.id);b.setAttribute('aria-pressed',b.dataset.recipe===active.id?'true':'false');});
 $('step-count').textContent=Math.min(current+1,active.steps.length)+' de '+active.steps.length+' pasos';
 listEl.innerHTML=active.steps.map((s,i)=>'<button type="button" class="step '+(i===current?'active ':i<current?'done':'')+'" data-step="'+i+'" aria-current="'+(i===current?'step':'false')+'"><span class="num">'+(i<current?'✓':i+1)+'</span><span>'+tags(s)+'<strong>'+escape(s.title)+'</strong><span class="description">'+escape(s.body)+'</span>'+(s.screen?'<span class="screenout">Pantalla orientativa: '+escape(s.screen)+'</span>':'')+'</span></button>').join('');
 $('step-next').textContent=current>=active.steps.length-1?'Guía completada ✓':'Hecho, siguiente paso →';
 $('step-next').disabled=current>=active.steps.length-1;
 $('step-back').disabled=current===0;
 $('result-box').innerHTML='<b>Resultado esperado</b><div>'+escape(active.result.msg)+'</div>';
 highlight(active.steps[current]);
}
function show(id){
 const found=recipes.find(r=>r.id===id);if(!found)return;
 active=found;current=0;history.replaceState(null,'','#'+id);
 render();
}
select.addEventListener('click',e=>{const el=e.target.closest('[data-recipe]');if(el)show(el.dataset.recipe);});
listEl.addEventListener('click',e=>{const el=e.target.closest('[data-step]');if(el){current=Number(el.dataset.step);render();}});
$('step-next').addEventListener('click',()=>{if(current<active.steps.length-1){current++;render();}});
$('step-back').addEventListener('click',()=>{if(current>0){current--;render();}});
$('reset-steps').addEventListener('click',()=>{current=0;render();});
root.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(recipes.some(r=>r.id===id))show(id);});
const search=$('param-search'),pick=$('param-select'),routeEl=$('parameter-route');
function renderPicker(){
 const q=search.value.toLowerCase().trim();
 const found=cat.defs.filter(d=>(d.code+' '+d.title+' '+d.group).toLowerCase().includes(q));
 pick.innerHTML=found.map(d=>'<option value="'+escape(d.code)+'">'+escape(d.code+' — '+d.title)+'</option>').join('');
 if(found.length&&found.some(d=>d.code===selectedParam))pick.value=selectedParam;
 else if(found.length)selectedParam=found[0].code;
 renderRoute();
}
function renderRoute(){
 if(!cat.byCode[selectedParam]||!pick.options.length){routeEl.textContent='No hay parámetros con esa búsqueda.';return;}
 selectedParam=pick.value;
 const d=cat.byCode[selectedParam],r=route('SLS',d.code);
 const arrow=r.times?('<span>'+symbol[r.key]+' · '+r.times+' '+(r.times===1?'toque':'toques')+'</span>'):'<span>Ya estás en SLS</span>';
 routeEl.innerHTML='<h3>'+escape(d.code)+' — '+escape(d.title)+'</h3><div class="param-description">Valor de fábrica en el catálogo: '+escape(d.defaultValue)+'. Grupo: '+escape(d.group)+'.</div><div class="route-pills"><span>SET · 5 segundos</span><span>→</span>'+arrow+'<span>→</span><span class="target">'+escape(d.code)+'</span><span>→</span><span>SET · toque breve</span><span>→</span><span>▲/▼ para valor</span><span>→</span><span>SET · guardar</span></div>';
}
search.addEventListener('input',renderPicker);
pick.addEventListener('change',()=>{selectedParam=pick.value;renderRoute();});
renderPicker();show(recipes.some(r=>r.id===decodeURIComponent(location.hash.slice(1)))?decodeURIComponent(location.hash.slice(1)):recipes[0].id);
root.F30.guide={recipes,route};
})(typeof window!=='undefined'?window:globalThis);
