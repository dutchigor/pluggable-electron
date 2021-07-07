import { terser } from "rollup-plugin-terser";

export default [{
  input: 'execution/index.js',
  output: [
    {
      file: 'dist/execution.umd.js',
      format: 'umd',
      name: 'pluggableElectron',
    },
    {
      file: 'dist/execution.umd.min.js',
      format: 'umd',
      name: 'pluggableElectron',
      plugins: [terser()]
    },
    {
      file: 'dist/execution.es.js',
      format: 'es',
    },
    {
      file: 'dist/execution.es.min.js',
      format: 'es',
      plugins: [terser()]
    }

  ]
}];