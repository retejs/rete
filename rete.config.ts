import { ReteOptions } from 'rete-cli'

export default <ReteOptions>{
  input: 'src/index.ts',
  name: 'Rete',
  globals: {
    crypto: 'crypto'
  }
}
