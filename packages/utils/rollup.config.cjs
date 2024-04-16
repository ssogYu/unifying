import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import rollupTypescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { visualizer } from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };
const path = require('path');
const isProduction = process.env.NODE_ENV === 'prod';
const config = defineConfig({
  input: path.resolve(__dirname, 'src/index.ts'),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    },
    {
      name: 'unifyingUtils',
      file: pkg.umd,
      format: 'umd',
      sourcemap: true
    },
  ],
  plugins: [
    commonjs(),
    resolve(), 
    rollupTypescript({
      tsconfig:'./tsconfig.json'
    }), 
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
    }),
    // visualizer({
    //   open: isProduction,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
    isProduction &&
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
        },
      }),
  ],
  strictDeprecations: true,
});
export default config;
