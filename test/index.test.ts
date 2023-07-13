// import jest globals
import { describe, expect, test } from '@jest/globals'

import { NodeEditor } from '../src/editor'

describe('NodeEditor', () => {
  test('NodeEditor is instantiable', () => {
    expect(new NodeEditor()).toBeInstanceOf(NodeEditor)
  })
})

