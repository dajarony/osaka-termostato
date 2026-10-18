import { mkdirSync, writeFileSync } from 'node:fs';
import { inventory } from './sources.mjs';
export function architecture() {
  const modules = inventory();
  return `system: osaka-termostato\nversion: 3.0.0\nlast_updated: '2026-10-18'\nsume_version: '1.0'\nentry: main.js\nroutes:\n  - path: /\n    method: browser\n    entrada: entradas/bootstrap.js\n    controlador: entradas/sesion.js\n    logica: logica/controlador.js\n    contrato_entrada: contratos/simulador.faser.md\n    contrato_salida: contratos/laboratorio-scp.md\n    salida: salidas/pantalla.js\ncontracts:\n${modules
    .filter((m) => m.file.startsWith('contratos/'))
    .map(
      (m) =>
        `  - name: ${m.file.split('/').at(-1)}\n    file: ${m.file}\n    used_by: ${JSON.stringify(modules.filter((n) => n.dependencies.includes(m.file)).map((n) => n.file))}`,
    )
    .join(
      '\n',
    )}\nmodules:\n${modules.map((m) => `  - name: ${m.file}\n    type: ${m.file.split('/')[0]}\n    file: ${m.file}\n    depends_on: ${JSON.stringify(m.dependencies)}`).join('\n')}\n`;
}
if (process.argv[1]?.endsWith('map.mjs')) {
  mkdirSync('mapa-global', { recursive: true });
  writeFileSync('mapa-global/arquitectura.yaml', architecture());
  console.log('Mapa SUME actualizado desde los imports reales.');
}
