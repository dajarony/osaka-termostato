(function(root){
'use strict';
// Catálogo documentado de 72 parámetros OSAKA F30.
// Formato: codigo, descripcion breve, familia, fabrica, tipo, min, max.
// "advanced" = editable/consultable, comportamiento todavía sin equivalencia física probada.
const rows=[
['SLS','Consigna mínima','Consignas',-50,'temp',-99.9,999],['SHS','Consigna máxima','Consignas',99.9,'temp',-99.9,999],['SP','Consigna normal','Consignas',0,'temp',-99.9,999],['SPE','Consigna económica','Consignas',0,'temp',-99.9,999],['SPH','Consigna turbo / calor','Consignas',0,'temp',-99.9,999],
['iuP','Unidad y resolución','Sondas','C1','enum:C0,C1,F0,F1'],['iFt','Filtro de lectura','Sondas',2,'temp',0,20],['iC1','Calibrar Pr1','Sondas',0,'temp',-30,30],['iC2','Calibrar Pr2','Sondas',0,'temp',-30,30],['iC3','Calibrar Pr3','Sondas',0,'temp',-30,30],['iCU','Offset del display','Sondas',0,'temp',-30,30],['iP2','Entrada Pr2','Sondas','EP','enum:oF,EP,Au,dG'],['iP3','Entrada Pr3','Sondas','dG','enum:oF,EP,Au,dG'],['iFi','Entrada digital','Sondas',5,'int',-8,8],['iti','Retardo de entrada digital','Sondas',-5,'duration'],['iEt','Retardo ECO por puerta','Sondas','oF','interval'],['itt','Máximo tiempo ECO','Sondas','oF','interval'],['idS','Visualización principal','Pantalla','P1','enum:oF,P1,P2,P3,Ec,SP'],
['rd','Diferencial normal','Control',2,'temp',0,30],['rEd','Diferencial ECO','Control',2,'temp',0,30],['rHd','Diferencial Turbo / calor','Control',2,'temp',0,30],['rt1','Marcha por fallo Pr1','Control','oF','duration'],['rt2','Parada por fallo Pr1','Control','oF','duration'],['rHC','Refrigeración / calefacción','Control','C','enum:C,H,nr,HC,C3'],['rtC','Tiempo en Turbo','Control','oF','interval'],
['dtE','Temperatura final desescarche','Desescarche',8,'temp',-99.9,999],['dtS','Temperatura permite desescarche','Desescarche',2,'temp',-99.9,999],['dtF','Temperatura fuerza desescarche','Desescarche',-99.9,'temp',-99.9,999],['dSt','Retardo desescarche térmico','Desescarche',1,'duration'],['ddL','Bloqueo del display en desescarche','Desescarche','oF','enum:oF,on,Lb'],['dcd','Máxima marcha compresor','Desescarche','oF','duration'],['dde','Duración máxima desescarche','Desescarche',30,'duration'],['dtd','Tiempo de goteo','Desescarche',2,'duration'],['ddt','Tipo de desescarche','Desescarche','EL','enum:EL,in,no,Et'],['ddC','Inicio de desescarche','Desescarche','rt','enum:rt,ct,cS,cL'],['dPE','Fin por tiempo / temperatura','Desescarche','EP','enum:oF,EP,P1'],['ddi','Intervalo entre desescarches','Desescarche',6,'interval'],['dSd','Primer desescarche','Desescarche',6,'interval'],['ddd','Adelanto dinámico (%)','Desescarche',0,'int',0,100],['dEi','Intervalo si falla evaporador','Desescarche',6,'interval'],['dEE','Duración si falla evaporador','Desescarche',10,'duration'],
['Ftn','Ventilador ON sin compresor','Ventilador',5,'duration'],['FtF','Ventilador OFF sin compresor','Ventilador','oF','duration'],['FFL','Bloqueo superior ventilador','Ventilador',10,'temp',-99.9,999],['FLF','Bloqueo inferior ventilador','Ventilador',-99.9,'temp',-99.9,999],['FdF','Histéresis bloqueo ventilador','Ventilador',1,'temp',0,30],['FFE','Ventilador durante desescarche','Ventilador','oF','enum:oF,on'],['FFd','Retardo ventilador posdesescarche','Ventilador',2,'duration'],
['PP1','Retardo al solicitar compresor','Protecciones','oF','duration'],['PP2','Reposo mínimo del compresor','Protecciones','oF','duration'],['PP3','Separación entre arranques','Protecciones','oF','duration'],['Pod','Retardo de salidas al encender','Protecciones','oF','duration'],
['AAy','Modo alarma de temperatura','Alarmas',1,'int',1,8],['AHA','Umbral de alta temperatura','Alarmas','oF','temp-off',-99.9,999],['ALA','Umbral de baja temperatura','Alarmas','oF','temp-off',-99.9,999],['AAd','Diferencial de alarmas','Alarmas',1,'temp',0,30],['AAt','Retardo de alarma','Alarmas','oF','duration'],['AtA','Memoria de alarma','Alarmas','oF','enum:oF,on'],['APA','Retardo alarma al encender','Alarmas',2,'interval'],['AdA','Retardo alarma tras desescarche','Alarmas',-5,'interval'],['AoA','Retardo alarma puerta abierta','Alarmas',3,'duration'],
['oo1','Salida OUT1','Salidas','ot','enum:oF,ot,dF,Fn,Au,At,AL,An,on,HE'],['oo2','Salida OUT2','Salidas','dF','enum:oF,ot,dF,Fn,Au,At,AL,An,on,HE'],['oo3','Salida OUT3','Salidas','Fn','enum:oF,ot,dF,Fn,Au,At,AL,An,on,HE'],['obu','Zumbador','Salidas',3,'enum:oF,1,2,3'],['oFo','Tipo de auxiliar','Salidas','oF','enum:oF,1,2,3,4'],['otu','Tiempo salida auxiliar','Salidas','oF','duration'],
['tUF','Función de botón superior izquierdo','Teclas',3,'enum:oF,1,2,3,4'],['tFb','Función de botón abajo','Teclas','oF','enum:oF,1,2,3,4'],['tLo','Bloqueo de teclado','Teclas','oF','duration'],['tEd','Consignas accesibles por SET','Teclas',4,'enum:0,1,2,3,4,5,6'],['tPP','Contraseña parámetros','Teclas','oF','password']
];
const advanced=new Set(['iFt','iCU','iEt','itt','rEd','rHd','rt1','rt2','rtC','dtF','dSt','dcd','ddd','dEi','dEE','AAy','AHA','ALA','AAd','AAt','AtA','APA','AdA','AoA','oFo','otu','tLo','tEd','iFi','iti','tFb']);
const defs=rows.map(([code,title,group,defaultValue,kind,min,max],id)=>Object.freeze({code,title,group,defaultValue,kind,min,max,id:id+1,coverage:advanced.has(code)?'documentado':'simulado'}));
const byCode=Object.fromEntries(defs.map(d=>[d.code,d]));
function factory(){return Object.fromEntries(defs.map(d=>[d.code,d.defaultValue]));}
function options(d){return d.kind.startsWith('enum:')?d.kind.slice(5).split(','):null;}
function normalize(d,val,current){const opts=options(d); if(opts)return opts.includes(String(val))?val:current;
if(val==='oF'&&['interval','duration','temp-off','password'].includes(d.kind))return 'oF';
const n=Number(val);if(!Number.isFinite(n))return current;
if(d.kind==='interval'||d.kind==='duration'){
  if(!Number.isInteger(n)||n===0||n < -59||n>99)return current;
} else if(d.kind==='password'){if(!Number.isInteger(n)||n<1||n>999)return current;}
else if(d.kind==='int'){if(!Number.isInteger(n)||n<d.min||n>d.max)return current;}
else if(n<(d.min??-99.9)||n>(d.max??999))return current;
return n;}
function step(d,val,dir,res='C1'){const opts=options(d);if(opts){const i=Math.max(0,opts.findIndex(v=>String(v)===String(val)));return opts[(i+dir+opts.length)%opts.length];}
if(d.kind==='password'){const arr=['oF',...Array.from({length:999},(_,i)=>i+1)];const i=Math.max(0,arr.indexOf(val));return arr[(i+dir+arr.length)%arr.length];}
if(d.kind==='interval'||d.kind==='duration'||d.kind==='temp-off'){
 if(d.kind==='temp-off'){const stepSize=/1$/.test(res)?0.1:1;return val==='oF'? (dir>0?(d.min??-99.9):'oF'):normalize(d,Math.round((val+dir*stepSize)*10)/10,val);}
 const arr=['oF',...Array.from({length:59},(_,i)=>i-59),...Array.from({length:99},(_,i)=>i+1)];const i=arr.findIndex(v=>v===val);return arr[(Math.max(0,i)+dir+arr.length)%arr.length];
}
const inc=d.kind==='int'||/0$/.test(res)?1:0.1;const n=Math.round((Number(val)+dir*inc)*10)/10;return normalize(d,n,val);}
function seconds(v,unit){if(v==='oF'||v==null)return Infinity;return Number(v)<0?Math.abs(Number(v))*(unit==='interval'?60:1):Number(v)*(unit==='interval'?3600:60);}
root.F30=root.F30||{};root.F30.catalog=Object.freeze({defs,byCode,factory,options,normalize,step,seconds});
})(typeof window!=='undefined'?window:globalThis);
