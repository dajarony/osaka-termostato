(function(root){
'use strict';
const cat=root.F30.catalog;
const finite=v=>v==='oF'||v==null?Infinity:Number(v);
const duration=v=>cat.seconds(v,'duration');
const interval=v=>cat.seconds(v,'interval');
class Plant {
 constructor(params){this.p={...cat.factory(),...(params||{})};this.t={P1:20,P2:13,P3:19};this.fail={P1:false,P2:false,P3:false};this.digital=false;this.powered=true;this.now=0;this.comp=false;this.heat=false;this.fan=false;this.def=false;this.dfRelay=false;this.defSince=0;this.lastDefEnd=0;this.firstDef=true;this.lastStart=-1e9;this.lastStop=-1e9;this.wantSince=null;this.drainUntil=0;this.fanUntil=0;this.compOffSince=0;this.fanBlocked=false;this.ctCount=0;this.intervalCount=0;this.lastOffReason='';this.reason='';this.events=[];this.emit('boot','Controlador encendido');this.evaluate();}
 emit(kind,detail){this.events.push({kind,detail,at:this.now});if(this.events.length>140)this.events.shift();}
 reading(n){if(this.fail[n])return null;if(n==='P2'&&this.p.iP2==='oF'||n==='P3'&&this.p.iP3==='oF')return null;const k=n==='P1'?'iC1':n==='P2'?'iC2':'iC3';return Math.round((this.t[n]+Number(this.p[k]||0))*10)/10;}
 epId(){return this.p.iP2==='EP'?'P2':this.p.iP3==='EP'?'P3':null;}
 ep(){const name=this.epId();return name?this.reading(name):null;}
 displayReading(name){const value=this.reading(name);return value===null?('E'+name.slice(1)):Math.round((value+Number(this.p.iCU||0))*10)/10;}
 setParam(code,value){const def=cat.byCode[code];if(!def)return false;const updated=cat.normalize(def,value,this.p[code]);if(updated===this.p[code]&&value!==this.p[code])return false;
 const copy={...this.p,[code]:updated};if(code==='SP'&&(updated<copy.SLS||updated>copy.SHS)||code==='SLS'&&updated>copy.SHS||code==='SHS'&&updated<copy.SLS)return false;
 if(['iP2','iP3'].includes(code)&&copy.iP2!=='oF'&&copy.iP2===copy.iP3)return false;
 this.p[code]=updated;this.emit('param',code+' = '+String(updated));this.evaluate();return true;}
 setSensor(name,value){if(!(name in this.t)||!Number.isFinite(Number(value)))return false;this.t[name]=Math.round(Number(value)*10)/10;this.evaluate();return true;}
 setFailure(name,bad){if(!(name in this.fail))return;this.fail[name]=!!bad;this.emit(bad?'probe:fail':'probe:ok',name);this.evaluate();}
 setDigital(v){this.digital=!!v;this.emit('digital',v?'Entrada activa':'Entrada inactiva');this.evaluate();}
 standby(){this.powered=!this.powered;this.emit('power',this.powered?'ON':'Stand-by');if(!this.powered){this.stopDefrost('stand-by');}this.evaluate();}
 canDefrost(){if(!this.powered)return {ok:false,reason:'Equipo en espera'};const ep=this.ep();if(this.epId()&&ep!==null&&(ep>Number(this.p.dtS)||this.p.dPE==='EP'&&ep>=Number(this.p.dtE)))return {ok:false,reason:'Sonda EP demasiado caliente (dtS/dtE)'};if(this.p.dPE==='EP'&&this.epId()&&ep===null)return {ok:false,reason:'Error de sonda de evaporador'};return {ok:true,reason:'Condiciones permitidas'};}
 manualDefrost(){return this.def?this.stopDefrost('manual'):this.startDefrost('manual');}
 startDefrost(cause){const check=this.canDefrost();if(!check.ok){this.emit('def:reject',check.reason);this.reason=check.reason;return false;}
 this.def=true;this.defSince=this.now;this.dfRelay=true;this.drainUntil=0;this.emit('def:start','Inicio '+cause);this.evaluate();return true;}
 stopDefrost(reason){if(!this.def)return false;this.def=false;this.dfRelay=false;this.firstDef=false;this.lastDefEnd=this.now;this.intervalCount=0;this.ctCount=0;const drain=duration(this.p.dtd);this.drainUntil=Number.isFinite(drain)?this.now+drain:this.now;const fd=duration(this.p.FFd);this.fanUntil=Number.isFinite(fd)?this.now+fd:this.now;this.emit('def:'+reason,'Fin de desescarche ('+reason+')');this.evaluate();return true;}
 demand(){const temp=this.reading('P1');if(!this.powered||temp===null)return false;
 const sp=Number(this.p.SP),rd=Number(this.p.rd);
 if(this.p.rHC==='H')return this.comp?temp<sp:temp<=sp-rd;
 if(['C','nr','HC','C3'].includes(this.p.rHC))return this.comp?temp>sp:temp>=sp+rd;
 return false;}
 evaluate(){
 if(this.def){
 const select=this.p.dPE;const value=select==='P1'?this.reading('P1'):select==='EP'?this.ep():null;
 if(this.p.ddt!=='Et'&&select!=='oF'&&value!==null&&value>=Number(this.p.dtE)){this.stopDefrost('temperatura');return;}
 const max=duration(this.p.dde);if(this.now-this.defSince>=max){this.stopDefrost('tiempo');return;}
 }
 const previous=this.comp;const request=this.demand();const blockDigital=this.digital&&[3,-3,5,-5].includes(Number(this.p.iFi));
 const mode=this.p.ddt;const duringDefBlock=this.def&&['EL','Et'].includes(mode);
 const hotGas=this.def&&mode==='in';
 const bypassDef=this.def&&mode==='no';
 const blocked=!this.powered||blockDigital||this.now<this.drainUntil||duringDefBlock;
 let want=hotGas||(request&&!blocked)||(bypassDef&&request&&!blockDigital);
 if(!want){this.comp=false;this.wantSince=null;}
 else if(!this.comp){if(this.wantSince===null)this.wantSince=this.now;
 const pp1=duration(this.p.PP1),pp2=duration(this.p.PP2),pp3=duration(this.p.PP3),pod=duration(this.p.Pod);
 const ok=(this.now-this.wantSince>=(Number.isFinite(pp1)?pp1:0))&&(this.now-this.lastStop>=(Number.isFinite(pp2)?pp2:0))&&(this.now-this.lastStart>=(Number.isFinite(pp3)?pp3:0))&&this.now>=(Number.isFinite(pod)?pod:0);
 this.comp=ok;
 this.reason=ok?'':(this.now<this.drainUntil?'Goteo dtd':'Protección PP1 / PP2 / PP3 / Pod');
 }else this.reason='';
 if(this.comp!==previous){this.emit(this.comp?'comp:on':'comp:off',this.comp?'Compresor conectado':'Compresor desconectado');if(this.comp)this.lastStart=this.now;else{this.lastStop=this.now;this.compOffSince=this.now;this.lastOffReason='setpoint';}}
 const ep=this.ep();if(ep!==null){
 const high=Number(this.p.FFL),low=Number(this.p.FLF),hys=Number(this.p.FdF);
 if(this.fanBlocked){if(ep<=high-hys&&ep>=low+hys)this.fanBlocked=false;}else if(ep>high||ep<low)this.fanBlocked=true;
 }else this.fanBlocked=false;
 let fanWanted=this.comp;
 if(!this.comp&&this.p.Ftn!=='oF'){
 const on=duration(this.p.Ftn),off=duration(this.p.FtF);
 fanWanted=!Number.isFinite(off)||this.now-this.compOffSince%(on+off)<on;
 }
 if(this.def)fanWanted=this.p.FFE==='on';if(this.now<this.fanUntil||this.fanBlocked||!this.powered||this.digital&&[2,-2,3,-3].includes(Number(this.p.iFi)))fanWanted=false;
 if(this.fan!==fanWanted){this.fan=fanWanted;this.emit(this.fan?'fan:on':'fan:off','Ventilador '+(this.fan?'activo':'parado'));}
 this.heat=this.powered&&!this.def&&['nr','HC'].includes(this.p.rHC)&&this.reading('P1')!==null&&this.reading('P1')<=Number(this.p.rHC==='HC'?this.p.SPH:this.p.SP)-Number(this.p.rHd);
 this.dfRelay=this.def&&(this.p.ddt!=='Et'||ep===null||ep<Number(this.p.dtE));
 this.relays=[1,2,3].map(i=>{const mode=this.p['oo'+i];return mode==='ot'?this.comp:mode==='dF'?this.dfRelay:mode==='Fn'?this.fan:mode==='HE'?this.heat:mode==='on'?this.powered:false;});
 }
 advance(seconds){const n=Math.min(7200,Math.max(0,Math.floor(Number(seconds)||0)));for(let i=0;i<n;i++){
 this.now++;
 if(this.comp)this.ctCount++;
 if(!this.def&&this.powered&&this.p.ddC!=='cL'&&this.p.ddi!=='oF'){
 const first=this.firstDef;
 const limit=first?(this.p.dSd==='oF'?0:interval(this.p.dSd)):interval(this.p.ddi);
 if(this.p.ddC==='ct'){if(this.comp)this.intervalCount++;}else this.intervalCount++;
 if(this.intervalCount>=limit)this.startDefrost('automático');
 }
 this.evaluate();
 }return this.snapshot();}
 snapshot(){return {now:this.now,temps:{P1:this.reading('P1'),P2:this.reading('P2'),P3:this.reading('P3')},ep:this.ep(),comp:this.comp,fan:this.fan,heat:this.heat,def:this.def,defSeconds:this.def?this.now-this.defSince:0,drain:this.now<this.drainUntil,relays:this.relays||[false,false,false],reason:this.reason,events:[...this.events],powered:this.powered};}
}
root.F30.Plant=Plant;
})(typeof window!=='undefined'?window:globalThis);
