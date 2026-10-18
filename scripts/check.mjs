import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { inventory, files } from './sources.mjs';
import { architecture } from './map.mjs';
import { schema } from '../contratos/parametros.js';
const modules = inventory(),
  errors = [];
for (const m of modules) {
  if (!m.file.endsWith('.json') && !m.content.slice(0, 350).includes('SUME DOCBLOCK'))
    errors.push(`DOCBLOCK ausente: ${m.file}`);
  for (const dependency of m.dependencies)
    if (!existsSync(dependency)) errors.push(`Import roto: ${m.file} → ${dependency}`);
  if (
    m.file.startsWith('logica/') &&
    (m.dependencies.some((d) => /^(entradas|salidas)\//.test(d)) ||
      /\b(document|window|localStorage|fetch|setInterval|Date\.now)\b/.test(m.content))
  )
    errors.push(`Dominio impuro: ${m.file}`);
  if (m.file.startsWith('contratos/') && m.dependencies.some((d) => !d.startsWith('contratos/')))
    errors.push(`Contrato depende de implementación: ${m.file}`);
  if (m.file.endsWith('.js') && m.content.split('\n').length > 160 && !m.file.startsWith('contratos/'))
    errors.push(`Responsabilidad demasiado grande (>160 líneas): ${m.file}`);
}
function visit(file, route = []) {
  if (route.includes(file)) {
    errors.push(`Ciclo de dependencias: ${[...route, file].join(' → ')}`);
    return;
  }
  for (const dependency of modules.find((m) => m.file === file)?.dependencies ?? [])
    visit(dependency, [...route, file]);
}
modules.forEach((m) => visit(m.file));
if (Object.keys(schema).length !== 72) errors.push('El catálogo no contiene 72 parámetros');
const map = 'mapa-global/arquitectura.yaml';
if (!existsSync(map) || readFileSync(map, 'utf8') !== architecture())
  errors.push('Mapa desactualizado: ejecutar npm run map');
for (const file of [...modules.map((m) => m.file), 'main.js', ...files('scripts'), ...files('tests')].filter(
  (f) => /\.m?js$/.test(f),
)) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) errors.push(`${file}: ${result.stderr}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `OK: ${modules.length} archivos SUME, 72 parámetros, sintaxis, imports, dominio puro, sin ciclos y mapa exacto.`,
  );
