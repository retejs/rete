import { jest } from '@jest/globals'
import { Buffer } from 'buffer'

export function mockCrypto(object: Record<string, unknown>) {
  // eslint-disable-next-line no-undef
  globalThis.crypto = object as unknown as Crypto
}

export function mockCryptoFromArray(array: Uint8Array) {
  mockCrypto({
    getRandomValues: jest.fn().mockReturnValue(array)
  })
}

export function mockCryptoFromBuffer(buffer: Buffer) {
  mockCrypto({
    randomBytes: jest.fn().mockReturnValue(buffer)
  })
}

export function resetCrypto() {
  // eslint-disable-next-line no-undef, no-undefined
  globalThis.crypto = undefined as unknown as Crypto
}
