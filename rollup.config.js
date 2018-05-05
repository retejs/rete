import babel from 'rollup-plugin-babel';
import pug from 'rollup-plugin-pug';
import minify from 'rollup-plugin-minify'
import regenerator from 'rollup-plugin-regenerator';
import copy from 'rollup-copy-plugin';
 
const { name, version } = require('./package.json');
const banner = `/*!
* ${name} v${version}
* (c) 2018 Vitaliy Stoliarov
* Released under the MIT License.
*/`;

export default [{
    input: 'src/index.js',
    output: {
        file: 'build/d3-node-editor.js',
        sourcemap: true,
        globals: {
            d3: 'd3',
            alight: 'alight'
        },
        format: 'umd',
        name: 'D3NE',
        banner
    },
    external: ['d3', 'alight'],
    plugins: [
        pug({
            pugRuntime: false
        }),
        babel(),
        regenerator(),
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
    ]
},
{ /// engine bundle
    input: 'src/engine.js',
    output: {
        file: 'build/d3-node-editor.engine.js',
        format: 'cjs',
        name: 'D3NE',
        banner
    },
    plugins: [
        babel(),
        regenerator(),
        copy({
            'src/engine.d.ts': 'build/d3-node-editor.engine.d.ts'
        })
    ]
}
];