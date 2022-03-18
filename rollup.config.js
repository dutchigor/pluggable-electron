import { terser } from "rollup-plugin-terser"
import pkg from './package.json'
import { builtinModules } from "module"
const deps = Object.keys(pkg.dependencies)
const peerDeps = Object.keys(pkg.peerDependencies)
const external = [...deps, ...peerDeps, ...builtinModules]

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
        sourcemap: true,
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
        sourcemap: true,
      },
    ],
  },
  {
    input: 'facade/index.js',
    external,
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
        sourcemap: true,
      },

    ],
  },
  {
    input: 'pluginMgr/index.js',
    external,
    output: [
      {
        file: 'dist/pluginMgr.js',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'dist/pluginMgr.min.js',
        format: 'cjs',
        plugins: [terser()],
        exports: 'named',
        sourcemap: true,
      },
    ],
  }
]