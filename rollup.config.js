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

import clear from 'rollup-plugin-clear'
import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'

export default {
    input: 'src/index.ts',
    output: [{
        file: pkg.main,
        sourcemap: true,
        name: 'Rete',
        format: 'umd'
    }, {
        file: pkg.engine,
        sourcemap: true,
        name: 'ReteEngine',
        format: 'umd'
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
            watch: false // default: false
        }),
        typescript({
            typescript: require('typescript')
        })
    ]
}