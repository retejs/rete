import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'

import { mockCryptoFromArray, resetCrypto } from '../mocks/crypto'

describe('ClassicPreset', () => {
  // eslint-disable-next-line init-declarations
  let preset!: typeof import('../../src/presets/classic')

  beforeEach(async () => {
    mockCryptoFromArray(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))
    preset = await import('../../src/presets/classic')
  })

  afterEach(() => {
    resetCrypto()
  })

  describe('Node', () => {
    it('is instantiable', () => {
      expect(new preset.Node('A')).toBeInstanceOf(preset.Node)
    })

    it('should have an id', () => {
      const node = new preset.Node('A')

      expect(node.id).toBeDefined()
    })

    it('should have a label', () => {
      const node = new preset.Node('A')

      expect(node.label).toBe('A')
    })

    it('adds Input', () => {
      const node = new preset.Node('A')
      const input = new preset.Input(new preset.Socket('a'))

      node.addInput('a', input)

      expect(node.hasInput('a')).toBeTruthy()
      expect(node.inputs.a).toBe(input)
    })

    it('throws error if Input already exists', () => {
      const node = new preset.Node('A')

      node.addInput('a', new preset.Input(new preset.Socket('a')))

      expect(() => node.addInput('a', new preset.Input(new preset.Socket('a')))).toThrow()
    })

    it('removes Input', () => {
      const node = new preset.Node('A')

      node.addInput('a', new preset.Input(new preset.Socket('a')))
      node.removeInput('a')

      expect(node.hasInput('a')).toBeFalsy()
    })

    it('adds Output', () => {
      const node = new preset.Node('A')
      const output = new preset.Output(new preset.Socket('a'))

      node.addOutput('a', output)

      expect(node.hasOutput('a')).toBeTruthy()
      expect(node.outputs.a).toBe(output)
    })

    it('throws error if Output already exists', () => {
      const node = new preset.Node('A')

      node.addOutput('a', new preset.Output(new preset.Socket('a')))

      expect(() => node.addOutput('a', new preset.Output(new preset.Socket('a')))).toThrow()
    })

    it('removes Output', () => {
      const node = new preset.Node('A')

      node.addOutput('a', new preset.Output(new preset.Socket('a')))
      node.removeOutput('a')

      expect(node.hasOutput('a')).toBeFalsy()
    })
  })

  describe('Connection', () => {
    it('Connection throws error if input not found', () => {
      const a = new preset.Node('A')
      const b = new preset.Node('B')

      a.addOutput('a', new preset.Output(new preset.Socket('a')))

      expect(() => new preset.Connection(a, 'a', b, 'b')).toThrow()
    })

    it('Connection throws error if output not found', () => {
      const a = new preset.Node('A')
      const b = new preset.Node('B')

      b.addInput('b', new preset.Input(new preset.Socket('b')))

      expect(() => new preset.Connection(a, 'a', b, 'b')).toThrow()
    })

    it('Connection is instantiable', () => {
      const a = new preset.Node('A')
      const b = new preset.Node('B')
      const output = new preset.Output(new preset.Socket('b'))
      const input = new preset.Input(new preset.Socket('a'))

      a.addOutput('a', output)
      b.addInput('b', input)

      expect(new preset.Connection(a, 'a', b, 'b')).toBeInstanceOf(preset.Connection)
    })
  })

  describe('Control', () => {
    it('adds Control to Node', () => {
      const node = new preset.Node('A')

      node.addControl('ctrl', new preset.Control())

      expect(node.hasControl('ctrl')).toBeTruthy()
    })

    it('throws error if Control already exists', () => {
      const node = new preset.Node('A')

      node.addControl('ctrl', new preset.Control())

      expect(() => node.addControl('ctrl', new preset.Control())).toThrow()
    })

    it('removes Control from Node', () => {
      const node = new preset.Node('A')

      node.addControl('ctrl', new preset.Control())
      node.removeControl('ctrl')

      expect(node.hasControl('ctrl')).toBeFalsy()
    })

    it('adds Control to Input', () => {
      const input = new preset.Input(new preset.Socket('a'))

      input.addControl(new preset.Control())

      expect(input.control).toBeTruthy()
    })

    it('throws error if Control in Input already exists', () => {
      const input = new preset.Input(new preset.Socket('a'))

      input.addControl(new preset.Control())

      expect(() => input.addControl(new preset.Control())).toThrow()
    })

    it('removes Control from Input', () => {
      const input = new preset.Input(new preset.Socket('a'))

      input.addControl(new preset.Control())
      input.removeControl()

      expect(input.control).toBeFalsy()
    })
  })
})
