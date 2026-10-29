/* eslint-disable @typescript-eslint/naming-convention */
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';

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
      // @hiveio/wax's browser build locates its wasm with `new URL(<file>, import.meta.url)`
      // outside Vite: emit the file into the bundle and point the URL at it.
      importMetaAssets(),
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
