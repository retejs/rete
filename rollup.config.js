// import copy from 'rollup-copy-plugin';
// import typescript from 'rollup-plugin-typescript2';
// import typescript2 from 'typescript';

// export default [{
//     input: 'src/index.ts',
//     name: 'Rete'
// },
// {
//     input: 'src/engine/index.js',
//     name: 'ReteEngine',
//     plugins: [
//         typescript({
//             typescript: typescript2
//         }),
//         copy({
//             'src/engine/engine.d.ts': 'build/rete.engine.d.ts'
//         })
//     ]
// }];

import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'

export default {
    input: 'src/index.ts',
    output: [{
        file: pkg.main,
        sourcemap: true,
        name: 'Rete',
        format: 'umd'
    }, {
        file: pkg.module,
        format: 'es'
    }],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
        clear({
            // required, point out which directories should be clear.
            targets: ['build'],
            // optional, whether clear the directores when rollup recompile on --watch mode.
            watch: true, // default: false
        }),
        typescript({
            typescript: require('typescript')
        })
    ]
}