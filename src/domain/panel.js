(function(root){
'use strict';
const catalog=root.F30.catalog;
// Máquina de estados de las cuatro teclas físicas. Duraciones en segundos.
class Panel {
 constructor(plant){this.plant=plant;this.mode='normal';this.index=0;this.current=null;this.draft=null;this.view='auto';this.note='Listo para operar';this.pwd=0;}
 code(){return catalog.defs[this.index].code;}
 modeName(){return {normal:'Lectura normal',quick:'Consigna rápida',browse:'Menú de parámetros',edit:'Edición de parámetro',password:'Introducir contraseña'}[this.mode];}
 exit(){this.mode='normal';this.current=null;this.draft=null;this.note='Volviendo a medida normal';}
 idle(){if(this.mode!=='normal')this.exit();}
 press(key,seconds=0.1){
  key=String(key).toUpperCase();
  if(this.mode==='normal'){
   if(key==='SET'&&seconds>=5){if(this.plant.p.tPP!=='oF'){this.mode='password';this.pwd=0;this.note='r.P: introduce contraseña';}else{this.mode='browse';this.index=0;this.note='Con ▲/▼ busca un parámetro';}return;}
   if(key==='SET'){if(this.plant.p.tEd===0||this.plant.p.tEd==='0'){this.note='tEd: edición rápida desactivada';return;}
     this.mode='quick';this.current='SP';this.draft=this.plant.p.SP;this.note='SP: modifica con ▲/▼; SET para guardar';return;}
   if(key==='UP'&&seconds>=5){const result=this.plant.manualDefrost();this.note=result?'Orden manual aceptada':'Desescarche no permitido: revisa dtS, dtE y sonda EP';return;}
   if(key==='POWER'&&seconds>=1){if(String(this.plant.p.tUF)==='3')this.plant.standby();else this.note='Botón tUF configurado para otra función';return;}
   if(key==='POWER'){const seq=['auto','P1','P2','P3','SP'];this.view=seq[(seq.indexOf(this.view)+1)%seq.length];this.note='Variable visualizada: '+this.view;return;}
   if(key==='DOWN'&&seconds>=1){this.note='Función de DOWN depende de tFb';return;}
   return;
  }
  if(key==='POWER'&&seconds>=2){this.exit();return;}
  if(this.mode==='password'){
   if(key==='SET'){if(this.pwd===this.plant.p.tPP){this.mode='browse';this.index=0;this.note='Contraseña correcta';}else{this.exit();this.note='Contraseña incorrecta';}}
   if(key==='UP')this.pwd=(this.pwd+1)%1000;
   if(key==='DOWN')this.pwd=(this.pwd+999)%1000;
   return;
  }
  if(this.mode==='browse'){
   if(key==='UP')this.index=(this.index+1)%catalog.defs.length;
   if(key==='DOWN')this.index=(this.index-1+catalog.defs.length)%catalog.defs.length;
   if(key==='SET'){this.current=this.code();this.draft=this.plant.p[this.current];this.mode='edit';this.note=this.current+': modifica y confirma con SET';}
   return;
  }
  if(this.mode==='quick'||this.mode==='edit'){
   if(key==='UP'||key==='DOWN'){const d=catalog.byCode[this.current];const repeats=seconds>=.5?Math.min(250,1+Math.floor((seconds-.35)*32)):1;for(let i=0;i<repeats;i++)this.draft=catalog.step(d,this.draft,key==='UP'?1:-1,this.plant.p.iuP);return;}
   if(key==='SET'){
     const success=this.plant.setParam(this.current,this.draft);
     this.note=success?(this.current+' guardado: '+String(this.plant.p[this.current])):('Valor inválido o incompatible: '+this.current);
     if(success){this.mode=this.mode==='quick'?'normal':'browse';this.draft=null;this.current=null;}
     return;
   }
  }
 }
 display(){
  if(!this.plant.powered&&this.mode==='normal')return {text:'',label:'STAND-BY'};
  if(this.mode==='browse')return {text:this.code(),label:'PARÁMETRO '+catalog.defs[this.index].id+' / 72'};
  if(this.mode==='edit'||this.mode==='quick')return {text:this.draft,label:this.current+' · EDITANDO'};
  if(this.mode==='password')return {text:this.pwd,label:'r.P · CONTRASEÑA'};
  const ep=this.plant.epId(),id=this.plant.p.idS;
  let key=this.view==='auto'?(id==='P2'||id==='P3'?id:id==='SP'?'SP':'P1'):this.view;
  if(key==='SP')return {text:this.plant.p.SP,label:'SP · CONSIGNA'};
  if(this.plant.fail[key])return {text:'E'+key.slice(1),label:'SONDA EN ERROR'};
  if((key==='P2'&&this.plant.p.iP2==='oF')||(key==='P3'&&this.plant.p.iP3==='oF'))return {text:'---',label:'SONDA NO CONFIGURADA'};
  const s=this.plant.snapshot();
  if(this.plant.def&&this.plant.p.ddL==='Lb')return {text:'dEF',label:'DESCARCHE ACTIVO'};
  const value=this.plant.displayReading(key);
  return {text:value,label:key==='P1'?'Pr1 · CÁMARA':key==='P2'?'Pr2 · EVAPORADOR':key==='P3'?'Pr3 · AUXILIAR':id};
 }
}
root.F30.Panel=Panel;
})(typeof window!=='undefined'?window:globalThis);
