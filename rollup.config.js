import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';

var entries = ['src/index.js', 'node_modules/regenerator-runtime/runtime.js'];
var babelPlugins = ['transform-regenerator'];
var presets = [
    'es2015-rollup'
];

if (process.env.npm_config_es2017) {
    entries = ['src/index.js'];
    babelPlugins = [];
    presets = ['es2017'];
}

export default {
    entry: entries,
    dest: 'build/node-editor.js',
    plugins: [ 
        multiEntry(),
        babel({
	        'presets': presets,
            'plugins': babelPlugins
        })
    ],
    format: 'iife',
    moduleName: 'D3NE'
};