import { ReteOptions } from 'rete-cli'
import copy from 'rollup-plugin-copy'

export default <ReteOptions>{
  input: 'src/index.ts',
  name: 'Rete',
  globals: {
    crypto: 'crypto'
  },
  plugins: [
    copy({
      targets: [
        { src: 'postinstall.js', dest: 'dist' }
      ]
    })
  ]
}
