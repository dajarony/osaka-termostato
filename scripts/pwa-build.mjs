import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { files } from './sources.mjs';
export function pwaBuild() {
  let output;
  return {
    name: 'osaka-offline-build',
    apply: 'build',
    configResolved(config) {
      output = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const paths = files(output).filter((file) => !file.endsWith('/sw.js'));
      const version = createHash('sha256');
      for (const path of paths) version.update(readFileSync(path));
      const worker = readFileSync(new URL('../entradas/offline-worker.js', import.meta.url), 'utf8');
      version.update(worker);
      const source = worker
        .replace('__CACHE_VERSION__', JSON.stringify(version.digest('hex').slice(0, 16)))
        .replace(
          '__PRECACHE__',
          JSON.stringify(paths.map((path) => relative(output, path).replaceAll('\\', '/'))),
        );
      writeFileSync(resolve(output, 'sw.js'), source);
    },
  };
}
