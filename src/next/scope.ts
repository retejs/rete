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

type UseScopeErrorMessage = 'Subscope argument type cannot be derived from parent scope'

type ValidateNestedScope<Plugin extends Scope<any, unknown[]>, Produces, Parents extends unknown[]> =
  [Produces, ...Parents] extends Plugin['__emitsParents'] ? Plugin : { __error: UseScopeErrorMessage }

export class Scope<Produces, Parents extends unknown[] = []> {
  signal = new Signal<AcceptPartialUnion<Produces | Parents[number]>>()
  parent?: any//Parents['length'] extends 0 ? undefined : Scope<Parents[0], Tail<Parents>>

  // workaround for type inference if Scope is inherited
  // https://github.com/microsoft/TypeScript/issues/36456
  __emitsParents!: Parents
  __emitsAll!: [Produces, ...Parents]

  constructor(public name: string) {}

  addPipe(middleware: Pipe<Produces | Parents[number]>) {
    this.signal.addPipe(middleware)
  }

  use<T, Plugin extends Scope<T, unknown[]>>(plugin: ValidateNestedScope<Plugin, Produces, Parents>) {
    if ('__error' in plugin) throw new Error('for internal use only')
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
