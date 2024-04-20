import { jest } from '@jest/globals'
import { Buffer } from 'buffer'

export function mockCrypto(object: Record<string, unknown>) {
  // eslint-disable-next-line no-undef
  Object.defineProperty(globalThis, 'crypto', {
    value: object,
    writable: true
  })
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
  // eslint-disable-next-line no-undef
  Object.defineProperty(globalThis, 'crypto', {
    // eslint-disable-next-line no-undefined
    value: undefined,
    writable: true
  })
}
