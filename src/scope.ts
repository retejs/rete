import { AcceptPartialUnion, Tail } from './utility-types'

export type Pipe<T> = (data: T) => Promise<undefined | T> | undefined | T

export class Signal<T> {
  pipes: Pipe<T>[] = []

  addPipe(pipe: Pipe<T>) {
    this.pipes.push(pipe)
  }

  async emit<Context extends T>(context: Context): Promise<Context | undefined> {
    let current: Context | undefined = context

    for (const pipe of this.pipes) {
      current = await pipe(current) as Context

      if (typeof current === 'undefined') return
    }
    return current
  }
}

export class Scope<Produces, Parents extends unknown[] = []> {
  signal = new Signal<AcceptPartialUnion<Produces | Parents[number]>>()
  parent?: any // Parents['length'] extends 0 ? undefined : Scope<Parents[0], Tail<Parents>>

  constructor(public name: string) {}

  addPipe(middleware: Pipe<Produces | Parents[number]>) {
    this.signal.addPipe(middleware)
  }

  use<T>(scope: Scope<T, [Produces, ...Parents]>) {
    scope.setParent(this)
    this.addPipe(context => {
      return scope.signal.emit(context)
    })
  }

  setParent(scope: Scope<Parents[0], Tail<Parents>>) {
    this.parent = scope
  }

  emit(context: Produces) {
    return this.signal.emit(context)
  }

  hasParent(): boolean {
    return Boolean(this.parent)
  }

  parentScope<T extends Parents[0], P extends Tail<Parents>>(): Scope<T, P>
  parentScope<T>(type: { new(...args: any[]): T }): T
  parentScope<T>(type?: { new(...args: any[]): T }): T {
    if (!this.parent) throw new Error('cannot find parent')
    if (type && this.parent instanceof type) return this.parent
    if (type) throw new Error('actual parent is not instance of type')
    return this.parent
  }
}
