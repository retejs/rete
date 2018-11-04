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
            targets: ['build']
        }),
        typescript({
            typescript: require('typescript'),
            clean: true
        })
    ]
}