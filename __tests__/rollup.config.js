/* eslint-disable @typescript-eslint/naming-convention */
import { readFileSync } from 'node:fs';
import { basename, dirname, resolve as resolvePath } from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

const URL_SUFFIX = '?url';

// Vite's `<asset>?url` import (used by @hiveio/wax/vite to locate its wasm) outside Vite:
// emit the asset next to the bundle under its own name and export its URL.
const assetUrl = () => ({
  name: 'asset-url',
  resolveId (source, importer) {
    if (!source.endsWith(URL_SUFFIX) || !importer)
      return null;

    return resolvePath(dirname(importer), source.slice(0, -URL_SUFFIX.length)) + URL_SUFFIX;
  },
  load (id) {
    if (!id.endsWith(URL_SUFFIX))
      return null;

    const file = id.slice(0, -URL_SUFFIX.length);
    const referenceId = this.emitFile({ type: 'asset', fileName: basename(file), source: readFileSync(file) });

    return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
  }
});

const commonConfiguration = () => ([
  {
    input: [
      'dist/tests/utils/txInspector.js',
      'dist/tests/__tests__/assets/globals.js'
    ],
    output: {
      format: 'es',
      name: 'wax',
      dir: 'dist/bundle'
    },
    plugins: [
      assetUrl(),
      replace({
        values: {
          'process.env.NODE_ENV': JSON.stringify('production')
        }
      }),
      commonjs(),
      resolve({
        preferBuiltins: false,
        browser: true
      })
    ]
  }
]);

export default [
  ...commonConfiguration()
];
