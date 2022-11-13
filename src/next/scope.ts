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

// type UseScopeErrorMessage = 'Subscope argument type cannot be derived from parent scope'

// type ExcludeFromObject<A extends object, B> = {
//   [Key in keyof A]: (B extends {[k in Key]: any} ? Exclude<A[Key], B[Key]> : A[Key])
// }

// type SoftExcludeDeeply<A, B> = A extends object
//   ? ExcludeFromObject<Exclude<A, B>, B>
//   : Exclude<A, B>

// copied from type-plus package

// type IsEmptyObject<T> = T extends {} ? {} extends T ? true : false : false

// type CanAssign<A, B, Then = true, Else = false> =
//   IsEmptyObject<A> extends true
//   ? Record<string, unknown> extends B ? Then : Else
//   : boolean extends A
//   ? (boolean extends B ? Then : Else)
//   : A extends B ? Then : Else

// export type CanAssignSignals<A, B> = CanAssign<SoftExcludeDeeply<A, SoftExcludeDeeply<A, B>>, B>

// type ValidateNestedScope<Plugin extends Scope<any, unknown[]>, Produces, Parents extends unknown[]> =
//   CanAssignSignals<[Produces, ...Parents], Plugin['__emitsParents']> extends true ? Plugin : { __error: UseScopeErrorMessage }

export class Scope<Produces, Parents extends unknown[] = []> {
  signal = new Signal<AcceptPartialUnion<Produces | Parents[number]>>()
  parent?: any//Parents['length'] extends 0 ? undefined : Scope<Parents[0], Tail<Parents>>

  // workaround for type inference if Scope is inherited
  // https://github.com/microsoft/TypeScript/issues/36456
  // __emitsParents!: Parents
  // __emitsAll!: [Produces, ...Parents]

  constructor(public name: string) {}

  addPipe(middleware: Pipe<Produces | Parents[number]>) {
    this.signal.addPipe(middleware)
  }

  use<T>(plugin: Scope<T, [Produces, ...Parents]>) {
    // if ('__error' in plugin) throw new Error('for internal use only')
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
