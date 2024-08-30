import { describe, expect, it, jest } from '@jest/globals'

import { Scope } from '../src/scope'

type Parent = { parent: string }
type Child = { child: number }

describe('Scope', () => {
  it('should create a new Scope instance', () => {
    const scope = new Scope('test')

    expect(scope).toBeInstanceOf(Scope)
  })

  it('doesnt have a parent by default', () => {
    const scope = new Scope<Parent>('test')

    expect(scope.hasParent()).toBeFalsy()
  })

  describe('parent-child', () => {
    it('should set a parent scope', () => {
      const parent = new Scope<Parent>('parent')
      const child = new Scope<Child, [Parent]>('child')

      child.setParent(parent)

      expect(child.parentScope()).toBe(parent)
    })

    it('should use a nested scope', () => {
      const parent = new Scope<Parent>('parent')
      const child = new Scope<Child, [Parent]>('child')

      parent.use(child)
      expect(child.hasParent()).toBeTruthy()
      expect(child.parentScope()).toBe(parent)
    })

    it('should throw an error when using a non-Scope instance', () => {
      const parent = new Scope<Parent>('parent')
      const child = { signal: { emit: jest.fn() } }

      expect(() => parent.use(child as any)).toThrowError('cannot use non-Scope instance')
    })

    it('should throw an error when trying to access a parent without one', () => {
      const scope = new Scope<Parent>('test')

      expect(() => scope.parentScope()).toThrowError('cannot find parent')
    })

    it('should throw an error when trying to access a parent with the wrong type', () => {
      class WrongScope<T> extends Scope<T> { }
      const parent = new Scope<Parent>('parent')
      const child = new Scope<Child, [Parent]>('child')

      parent.use(child)

      expect(() => child.parentScope(WrongScope)).toThrowError('actual parent is not instance of type')
    })
  })

  describe('addPipe', () => {
    it('should emit a signal', async () => {
      const scope = new Scope<Parent>('test')
      const pipe = jest.fn<() => Parent>()

      scope.addPipe(pipe)
      await scope.emit({ parent: 'test' })

      expect(pipe).toHaveBeenCalledWith({ parent: 'test' })
    })

    it('should return a promise from emit', () => {
      const scope = new Scope<Parent>('test')
      const signal = jest.fn<() => Parent>()

      scope.addPipe(signal)
      const result = scope.emit({ parent: 'test' })

      expect(result).toBeInstanceOf(Promise)
    })

    it('should return the result of the signal', async () => {
      const scope = new Scope<Parent>('test')
      const signal = jest.fn<() => Parent>().mockReturnValue({ parent: 'test-result' })

      scope.addPipe(signal)
      const result = await scope.emit({ parent: 'test' })

      expect(result).toEqual({ parent: 'test-result' })
    })

    it('should return undefined if the signal returns undefined', async () => {
      const scope = new Scope('test')
      // eslint-disable-next-line no-undefined
      const signal = jest.fn().mockReturnValue(undefined)

      scope.addPipe(signal)
      const result = await scope.emit('test')

      expect(result).toBeUndefined()
    })

    it('should return the result of the signal with a parent', async () => {
      const parent = new Scope<Parent>('parent')
      const child = new Scope<Child, [Parent]>('child')
      const signal = jest.fn<() => Parent>().mockReturnValue({ parent: 'test-parent' })

      parent.addPipe(signal)
      parent.use(child)
      const result = await child.emit({ child: 1 })

      expect(result).toEqual({ child: 1 })
    })

    it('should return the result of the signal with a parent and child', async () => {
      const parent = new Scope<Parent>('parent')
      const child = new Scope<Child, [Parent]>('child')
      const signal = jest.fn<() => Child>().mockReturnValue({ child: 1 })

      parent.use(child)
      child.addPipe(signal)
      const result = await child.emit({ child: 2 })

      expect(result).toEqual({ child: 1 })
    })

    it('should transfer signals from parent to child', async () => {
      const parent = new Scope<Parent>('parent')
      const child = new Scope<Child, [Parent]>('child')
      const parentSignal = jest.fn<() => Parent>().mockReturnValue({ parent: 'test-parent' })
      const childSignal = jest.fn<() => Child>()

      parent.addPipe(parentSignal)
      child.addPipe(childSignal)
      parent.use(child)

      await parent.emit({ parent: 'test-parent' })

      expect(childSignal).toHaveBeenCalledWith({ parent: 'test-parent' })
    })

    it('should prevent execution of child signal if parent signal returns undefined', async () => {
      const parent = new Scope<Parent>('parent')
      const child = new Scope<Child, [Parent]>('child')
      // eslint-disable-next-line no-undefined
      const parentSignal = jest.fn<() => Parent | undefined>().mockReturnValue(undefined)
      const childSignal = jest.fn<() => Child>()

      parent.addPipe(parentSignal)
      child.addPipe(childSignal)
      parent.use(child)

      await parent.emit({ parent: 'test-parent' })

      expect(childSignal).not.toHaveBeenCalled()
    })
  })
})

