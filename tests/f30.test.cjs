const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const base=path.join(__dirname,'..');const window={};const context=vm.createContext({window,console});
for(const file of ['src/domain/catalog.js','src/domain/plant.js','src/domain/panel.js','src/training/lessons.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context,{filename:file});
const {catalog,Plant,Panel,lessons}=window.F30;
const fresh=()=>new Plant();
const configure=(plant,obj)=>{for(const [k,v] of Object.entries(obj))assert.equal(plant.setParam(k,v),true,'configurar '+k);};
test('El catálogo contiene 72 códigos únicos del manual',()=>{
 assert.equal(catalog.defs.length,72);assert.equal(new Set(catalog.defs.map(d=>d.code)).size,72);
 for(const c of ['SP','rd','iP2','iP3','ddt','ddi','dSd','dde','dPE','FFL','FFE','PP2','oo3'])assert.ok(catalog.byCode[c]);
});
test('Rangos y unidades: -5 significa 5 minutos y 5 significa cinco horas',()=>{
 assert.equal(catalog.seconds(-5,'interval'),300);assert.equal(catalog.seconds(5,'interval'),18000);
 assert.equal(catalog.seconds(-5,'duration'),5);assert.equal(catalog.seconds(2,'duration'),120);
 assert.equal(catalog.normalize(catalog.byCode.rd,-4,2),2);
});
test('Solo una entrada puede representar el evaporador',()=>{
 const a=fresh();assert.equal(a.p.iP2,'EP');assert.equal(a.setParam('iP3','EP'),false);
 assert.equal(a.setParam('iP2','Au'),true);assert.equal(a.setParam('iP3','EP'),true);
});
test('Panel: SET breve modifica SP, guardar con SET',()=>{
 const a=fresh(),k=new Panel(a);k.press('SET',.1);assert.equal(k.mode,'quick');
 k.press('UP',5);assert.ok(k.draft>10);const next=k.draft;k.press('SET',.1);assert.equal(a.p.SP,next);assert.equal(k.mode,'normal');
});
test('Panel: SET cinco segundos abre la lista y SET confirma guardado',()=>{
 const a=fresh(),k=new Panel(a);k.press('SET',5);assert.equal(k.mode,'browse');assert.equal(k.display().text,'SLS');
 k.press('UP',.1);assert.equal(k.display().text,'SHS');k.press('POWER',2);assert.equal(k.mode,'normal');
});
test('Histeresis refrigeración: 19 conecta y 15 desconecta',()=>{
 const a=fresh();configure(a,{SP:15,rd:4,rHC:'C'});a.setSensor('P1',15);assert.equal(a.comp,false);a.setSensor('P1',18);assert.equal(a.comp,false);a.setSensor('P1',19);assert.equal(a.comp,true);a.setSensor('P1',15);assert.equal(a.comp,false);
});
test('Calefacción H: activación al bajar, desconexión al alcanzar SP',()=>{
 const a=fresh();configure(a,{SP:22,rd:2,rHC:'H'});a.setSensor('P1',22);assert.equal(a.comp,false);a.setSensor('P1',20);assert.equal(a.comp,true);a.setSensor('P1',22);assert.equal(a.comp,false);
});
test('Desescarche manual por temperatura detiene por Pr2',()=>{
 const a=fresh();configure(a,{dtS:15,dtE:17,dPE:'EP',dde:2});a.setSensor('P2',13);
 assert.equal(a.manualDefrost(),true);assert.equal(a.def,true);assert.equal(a.comp,false);
 a.setSensor('P2',17);assert.equal(a.def,false);assert.ok(a.events.some(e=>e.kind==='def:temperatura'));
});
test('Desescarche rechazado al superar dtS',()=>{
 const a=fresh();configure(a,{dtS:3});a.setSensor('P2',13);assert.equal(a.manualDefrost(),false);
 assert.ok(a.events.some(e=>e.kind==='def:reject'));
});
test('Desescarche cada cinco minutos: ddi y dSd',()=>{
 const a=fresh();configure(a,{ddC:'rt',ddi:-5,dSd:-5});a.setSensor('P2',0);
 a.advance(299);assert.equal(a.def,false);a.advance(1);assert.equal(a.def,true);
});
test('El desescarche por tiempo termina con dde',()=>{
 const a=fresh();configure(a,{dPE:'oF',dde:2});a.setSensor('P2',0);a.manualDefrost();a.advance(119);assert.equal(a.def,true);a.advance(1);assert.equal(a.def,false);assert.ok(a.events.some(e=>e.kind==='def:tiempo'));
});
test('Ventilador bloqueado por FFL, se desbloquea con FFL=25',()=>{
 const a=fresh();a.setSensor('P1',20);a.setSensor('P2',13);assert.equal(a.fan,false);
 configure(a,{FFL:25});assert.equal(a.fan,true);assert.equal(a.relays[2],true);
});
test('Ventilador en desescarche depende de FFE',()=>{
 const a=fresh();a.setSensor('P2',0);a.manualDefrost();assert.equal(a.fan,false);
 configure(a,{FFE:'on'});assert.equal(a.fan,true);
});
test('Goteo dtd mantiene el compresor apagado hasta vencer el tiempo',()=>{
 const a=fresh();a.setSensor('P2',0);a.manualDefrost();a.manualDefrost();
 assert.equal(a.snapshot().drain,true);assert.equal(a.comp,false);a.advance(119);assert.equal(a.comp,false);a.advance(1);assert.equal(a.snapshot().drain,false);
});
test('PP2 bloquea el arranque inmediatamente después de un paro',()=>{
 const a=fresh();configure(a,{SP:15,rd:4,PP2:1});a.setSensor('P1',15);a.setSensor('P1',19);assert.equal(a.comp,false);a.advance(60);assert.equal(a.comp,true);
});
test('Avería de Pr1 detiene regulación y aparece E1',()=>{
 const a=fresh(),k=new Panel(a);a.setFailure('P1',true);assert.equal(a.comp,false);assert.equal(k.display().text,'E1');a.setFailure('P1',false);assert.equal(k.display().text,20);
});
test('14 ejercicios y panel sin edición externa',()=>{
 assert.equal(lessons.length,14);const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
 assert.equal(/id="modinput"|id="save"\s/.test(html),false);
 assert.ok(html.includes('data-key="SET"')&&html.includes('data-key="UP"'));
 assert.ok(html.includes('src/domain/panel.js'));
});
