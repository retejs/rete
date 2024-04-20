import { describe, expect, it, jest } from '@jest/globals'
import { Buffer } from 'buffer'

import { mockCryptoFromArray, mockCryptoFromBuffer, resetCrypto } from './mocks/crypto'

describe('getUID', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    resetCrypto()
  })

  it('should return a unique id based on crypto.getRandomValues', async () => {
    mockCryptoFromArray(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))

    const { getUID } = await import('../src/utils')
    const uid = getUID()

    expect(uid).toHaveLength(16)
  })

  it('should return a unique id based on crypto.randomBytes', async () => {
    mockCryptoFromBuffer(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]))

    const { getUID } = await import('../src/utils')
    const uid = getUID()

    expect(uid).toHaveLength(16)
  })
})
