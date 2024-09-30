/* eslint-disable @typescript-eslint/naming-convention */
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';

const commonConfiguration = () => ([
  {
    input: 'dist/tests/utils/waxAccountInformation.js',
    output: {
      format: 'es',
      name: 'wax',
      dir: 'dist/bundle'
    },
    plugins: [
      replace({
        delimiters: ['', ''],
        preventAssignment: true
      }),
      commonjs(),
      terser({
        format: {
          inline_script: false,
          comments: false,
          max_line_len: 100
        }
      }),
      resolve({
        preferBuiltins: true,
        browser: true
      }),
      builtins()
    ]
  }
]);

export default [
  ...commonConfiguration()
];
