import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/components/tic-tac-toe.component.js',
    output: {
      file: 'examples/js/tic-tac-toe.component.js',
      format: 'iife',
      // exports: 'default'
    },
    plugins: [commonjs(), nodeResolve()]
  };
  