import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
export const layers = ['entradas', 'logica', 'salidas', 'contratos'];
export function files(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((item) => {
      const name = `${directory}/${item.name}`;
      return item.isDirectory() ? files(name) : [name];
    })
    .sort();
}
export function inventory() {
  return layers.flatMap(files).map((file) => {
    const content = readFileSync(file, 'utf8');
    const dependencies = [...content.matchAll(/(?:from\s+|@?import\s*)['"](\.[^'"]+)['"]/g)].map((match) =>
      path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1])),
    );
    return { file, content, dependencies };
  });
}
