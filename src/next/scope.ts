import { AcceptPartialUnion/*, Tail*/ } from './utility-types'

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
  parent?: any//Parents['length'] extends 0 ? undefined : Scope<Parents[0], Tail<Parents>>

  constructor(public name: string) {}

  addPipe(middleware: Pipe<Produces | Parents[number]>) {
    this.signal.addPipe(middleware)
  }

  use<T>(plugin: Scope<T, [Produces, ...Parents]>) {
    plugin.parent = this
    this.addPipe(context => {
      return plugin.signal.emit(context)
    })
  }

  emit(context: Produces) {
    return this.signal.emit(context)
  }

  parentScope() {
    return this.parent || null
  }
}
