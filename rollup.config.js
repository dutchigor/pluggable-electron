import { terser } from "rollup-plugin-terser";

export default [{
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
    {
      file: 'dist/execution.cjs.js',
      format: 'cjs',
      exports: "named",
    },
    {
      file: 'dist/execution.cjs.min.js',
      format: 'cjs',
      plugins: [terser()],
      exports: "named",
    },
  ]
}];