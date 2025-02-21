/* eslint-disable @typescript-eslint/naming-convention */
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

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
