import { terser } from "rollup-plugin-terser"
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'execution/index.js',
    output: [
      {
        file: 'dist/execution.umd.js',
        format: 'umd',
        name: 'pluggableElectron',
        exports: "named",
      },
      {
        file: 'dist/execution.umd.min.js',
        format: 'umd',
        name: 'pluggableElectron',
        plugins: [terser()],
        exports: "named",
      },
      {
        file: 'dist/execution.es.js',
        format: 'es',
        exports: "named",
      },
      {
        file: 'dist/execution.es.min.js',
        format: 'es',
        plugins: [terser()],
        exports: "named",
      },
    ],
  },
  {
    input: 'facade/index.js',
    output: [
      {
        file: 'dist/facade.js',
        format: 'cjs',
        exports: "named",
      },
      {
        file: 'dist/facade.min.js',
        format: 'cjs',
        plugins: [terser()],
        exports: "named",
      },
    ]
  },
  // {
  //   input: 'pluginMgr/index.js',
  //   output: [
  //     {
  //       file: 'dist/pluginMgr.js',
  //       format: 'cjs',
  //       exports: 'named',
  //     },
  //     {
  //       file: 'dist/pluginMgr.min.js',
  //       format: 'cjs',
  //       plugins: [terser()],
  //       exports: 'named',
  //     },
  //   ],
  //   plugins: [commonjs()],
  // }
]