import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import rollupTypescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import terser from '@rollup/plugin-terser';
import pkg from './package.json';
const path = require('path');
const isProduction = process.env.NODE_ENV === 'prod';
const config = {
  input: path.resolve(__dirname, 'src/index.ts'),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      name: 'RollupTsTemplate',
      file: pkg.umd,
      format: 'umd',
    },
  ],
  plugins: [
    resolve(), //解析第三方依赖
    commonjs(), //识别commonjs模式第三方依赖
    rollupTypescript(), //编译TypeScript
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
    }),
  ],
};
if (isProduction) {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  );
}
export default config;
