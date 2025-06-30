import { describe, it } from '@jest/globals'

import { BaseSchemes } from '../src'
import { NodeEditor } from '../src/editor'

const iterations = 5

describe('NodeEditor', () => {
  for (let iteration = 0; iteration < iterations; iteration++) {
    describe(`remove nodes (${iteration})`, () => {
      // eslint-disable-next-line init-declarations
      let editor!: NodeEditor<BaseSchemes>

      const ids = new Array(5_000).fill(0)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .map((_, i) => i)
      const idsToRemove = [...ids].reverse()

      beforeEach(async () => {
        editor = new NodeEditor<BaseSchemes>()
        await Promise.all(ids.map(id => editor.addNode({ id: `s${id}` })))
      })

      it('basic', async () => {
        await Promise.all(idsToRemove.map(id => editor.removeNode(`s${id}`)))
      })
    })
  }

  for (let iteration = 0; iteration < iterations; iteration++) {
    describe(`remove connections (${iteration})`, () => {
      // eslint-disable-next-line init-declarations
      let editor!: NodeEditor<BaseSchemes>

      const ids = new Array(3_000).fill(0)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .map((_, i) => i)
      const idsToRemove = [...ids].reverse()

      beforeEach(async () => {
        editor = new NodeEditor<BaseSchemes>()
        await Promise.all(ids.map(id => editor.addNode({ id: `s${id}` })))
        await Promise.all(ids.map(id => editor.addNode({ id: `t${id}` })))
        await Promise.all(ids.map(id => editor.addConnection({ id: `c${id}`, source: `s${id}`, target: `t${id}` })))
      })

      it('basic', async () => {
        await Promise.all(idsToRemove.map(id => editor.removeConnection(`c${id}`)))
      })
    })
  }
})
