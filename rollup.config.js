import babel from 'rollup-plugin-babel';
import pug from 'rollup-plugin-pug';
import multiEntry from 'rollup-plugin-multi-entry';
import minify from 'rollup-plugin-minify'

const { name, version } = require('./package.json');
const banner = `/*!
* ${name} v${version}
* (c) 2017 Vitaliy Stoliarov
* Released under the MIT License.
*/`;

export default {
    entry: ['src/index.js', 'node_modules/regenerator-runtime/runtime.js'],
    dest: 'build/d3-node-editor.js',
    sourceMap: true,
    plugins: [ 
        multiEntry(),
        pug({
            pugRuntime: false
        }),
        babel(),
        minify({
            umd: {
                dest: 'build/d3-node-editor.min.js',
                ie8: true,
                output: {
                    beautify: false,
                    preamble: banner
                }
            }
        })
    ],
    banner,
    format: 'umd',
    moduleName: 'D3NE'
};