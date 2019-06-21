import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const banner = `\
/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 *
 * @author ${pkg.author}
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
    name: 'ol3turf',
  },
  plugins,
});

export default [
  build('dist/ol3-turf.js', [commonjs(), resolve()]),
  build('dist/ol3-turf.min.js', [commonjs(), resolve(), terser()]),
];
