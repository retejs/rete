import copy from 'rollup-copy-plugin';

export default [{
    input: 'src/index.js',
    name: 'Rete'
},
{
    input: 'src/engine/index.js',
    name: 'ReteEngine',
    plugins: [
        copy({
            'src/engine/engine.d.ts': 'build/rete.engine.d.ts'
        })
    ]
}];