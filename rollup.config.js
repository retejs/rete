import babel from 'rollup-plugin-babel';
import pug from 'rollup-plugin-pug';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
    entry: ['src/index.js', 'node_modules/regenerator-runtime/runtime.js'],
    dest: 'build/d3-node-editor.js',
    sourceMap: true,
    plugins: [ 
        multiEntry(),
        pug({
            pugRuntime: false
        }),
        babel()
    ],
    format: 'umd',
    moduleName: 'D3NE'
};