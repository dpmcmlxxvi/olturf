import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const banner = `\
/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 *
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @license ${pkg.license}
 * @preserve
 */
`;

const build = (filename, plugins) => ({
  input: pkg.module,
  output: {
    banner: banner,
    file: filename,
    format: 'umd',
    name: 'olturf',
  },
  plugins,
});

export default [
  build('dist/olturf.js', [commonjs(), resolve()]),
  build('dist/olturf.min.js', [commonjs(), resolve(), terser()]),
];
