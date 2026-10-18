/* SUME DOCBLOCK
Nombre: parámetros | Tipo: Contrato
Entradas: manual F30 V2 y perfil educativo.
Acciones: declarar valores, rangos, familias y cobertura.
Salidas: esquema de 72 parámetros.
*/
import { catalog } from './catalogo.js';
const enums = {
  iuP: ['C0', 'C1', 'F0', 'F1'], iP2: ['oF', 'EP', 'Au', 'dG'], iP3: ['oF', 'EP', 'Au', 'dG'],
  idS: ['oF', 'P1', 'P2', 'P3', 'Ec', 'SP'], rHC: ['C', 'H', 'nr', 'HC', 'C3'],
  ddt: ['EL', 'in', 'no', 'Et'], ddC: ['rt', 'ct', 'cS', 'cL'], dPE: ['oF', 'EP', 'P1'],
  ddL: ['oF', 'on', 'Lb'], FFE: ['oF', 'on'], AtA: ['oF', 'on'],
};
const relay = ['oF', 'ot', 'dF', 'Fn', 'Au', 'At', '-t', 'AL', '-L', 'An', '-n', 'on', 'HE'];
for (const key of ['oo1', 'oo2', 'oo3']) enums[key] = relay;
const longTimers = ['iEt', 'itt', 'rtC', 'dcd', 'ddi', 'dSd', 'dEi', 'APA', 'AdA'];
const shortTimers = ['iti', 'rt1', 'rt2', 'dSt', 'dde', 'dtd', 'dEE', 'Ftn', 'FtF', 'FFd', 'PP1', 'PP2', 'PP3', 'Pod', 'AAt', 'AoA', 'otu', 'tLo'];
const ranges = {
  iFt: [0, 20], iC1: [-30, 30], iC2: [-30, 30], iC3: [-30, 30], iCU: [-30, 30],
  iFi: [-10, 10], rd: [0, 30], rEd: [0, 30], rHd: [0, 30], ddd: [0, 100],
  FdF: [0, 30], AAd: [0, 30], AAy: [1, 8], obu: [1, 3], oFo: [1, 5],
  tUF: [1, 4], tFb: [1, 4], tEd: [0, 6], tPP: [1, 999],
};
const integers = ['iFi', 'AAy', 'obu', 'oFo', 'tUF', 'tFb', 'tEd', 'tPP', 'ddd'];
const optional = ['iFt', 'iFi', 'AAy', 'AHA', 'ALA', 'obu', 'oFo', 'tUF', 'tFb', 'tPP'];
export const defaults = Object.freeze({
  SLS: -50, SHS: 80, SP: 4, SPE: 8, SPH: 0, iuP: 'C1', iFt: 'oF',
  iC1: 0, iC2: 0, iC3: 0, iCU: 0, iP2: 'EP', iP3: 'Au', iFi: 2, iti: 'oF',
  iEt: 'oF', itt: 'oF', idS: 'P1', rd: 2, rEd: 2, rHd: 2, rt1: 'oF', rt2: 'oF',
  rHC: 'C', rtC: -30, dtE: 8, dtS: 2, dtF: -50, dSt: 1, ddL: 'Lb', dcd: 'oF',
  dde: 20, dtd: 2, ddt: 'EL', ddC: 'rt', dPE: 'EP', ddi: 6, dSd: 6, ddd: 0,
  dEi: 6, dEE: 10, Ftn: 'oF', FtF: 'oF', FFL: 10, FLF: -40, FdF: 2,
  FFE: 'oF', FFd: 2, PP1: 'oF', PP2: 2, PP3: 3, Pod: 'oF',
  AAy: 1, AHA: 15, ALA: -5, AAd: 1, AAt: 2, AtA: 'on', APA: -30, AdA: -5, AoA: 2,
  oo1: 'ot', oo2: 'dF', oo3: 'Fn', obu: 3, oFo: 4, otu: 'oF', tUF: 3,
  tFb: 'oF', tLo: 'oF', tEd: 4, tPP: 'oF',
});
export const schema = Object.fromEntries(catalog.map(item => {
  const code = item.code;
  const timer = longTimers.includes(code) ? 'hours' : shortTimers.includes(code) ? 'minutes' : null;
  return [code, { ...item, options: enums[code], timer, min: ranges[code]?.[0] ?? -99.9,
    max: ranges[code]?.[1] ?? 999, integer: integers.includes(code) || Boolean(timer),
    optional: optional.includes(code) || Boolean(timer), default: defaults[code],
    coverage: ['ddd', 'ddC', 'rHC'].includes(code) ? 'partial' : 'implemented' }];
}));
export const trainingDefaults = { ...defaults, SP: 15, SPE: 30, SPH: -10, rd: 4,
  dtS: 19, dtE: 17, dde: 2, ddi: 'oF', dSd: 'oF', dtd: 'oF', FFd: 'oF',
  ddL: 'oF', FFL: 25, FLF: -25, PP1: 'oF', PP2: 'oF', PP3: 'oF',
  APA: 'oF', AdA: 'oF', AAt: 'oF', AHA: 'oF', ALA: 'oF', iP3: 'Au', iFi: 'oF' };
