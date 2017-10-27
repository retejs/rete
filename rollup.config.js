import babel from 'rollup-plugin-babel';
import pug from 'rollup-plugin-pug';
import multiEntry from 'rollup-plugin-multi-entry';

var entries = ['src/index.js'];
var babelPlugins = ['typecheck', 'syntax-flow', 'transform-flow-strip-types'];
var presets = [];

if (process.env.npm_config_es2017) {
    presets = ['es2017'];
}
else {
    entries.push('node_modules/regenerator-runtime/runtime.js');
    babelPlugins.push('transform-regenerator');
    presets = ['es2015-rollup'];
}

export default {
    entry: entries,
    dest: 'build/d3-node-editor.js',
    sourceMap: true,
    plugins: [ 
        multiEntry(),
        pug(),
        babel({
	        'presets': presets,
            'plugins': babelPlugins
        })
    ],
    format: 'iife',
    moduleName: 'D3NE'
};