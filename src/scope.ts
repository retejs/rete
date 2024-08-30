/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  AcceptPartialUnion, CanAssignSignal, GetAssignmentReferences, GetNonAssignableElements, Tail
} from './utility-types'

export type { CanAssignSignal }

/**
 * A middleware type that can modify the data
 * @typeParam T - The data type
 * @param data - The data to be modified
 * @returns The modified data or undefined
 * @example (data) => data + 1
 * @example (data) => undefined // will stop the execution
 * @internal
 */
export type Pipe<T> = (data: T) => Promise<undefined | T> | undefined | T

export type CanAssignEach<D extends any[], F extends any[]> = D extends [infer H1, ...infer Tail1]
  ? (
    F extends [infer H2, ...infer Tail2] ?
      [CanAssignSignal<H1, H2>, ...CanAssignEach<Tail1, Tail2>]
      : []
  ) : []

export type ScopeAsParameter<S extends Scope<any, any[]>, Current extends any[]> = (CanAssignEach<[S['__scope']['produces'], ...S['__scope']['parents']], Current>[number] extends true
  ? S
  : 'Argument Scope does not provide expected signals'
)

/**
 * Validate the Scope signals and replace the parameter type with an error message if they are not assignable
 * @internal
 */
export type NestedScope<S extends Scope<any, any[]>, Current extends any[]> = (CanAssignEach<Current, S['__scope']['parents']>[number] extends true
  ? S
  : 'Parent signals do not satisfy the connected scope. Please use `.debug($ => $) for detailed assignment error'
)

/**
 * Provides 'debug' method to check the detailed assignment error message
 * @example .debug($ => $)
 * @internal
 */
export function useHelper<S extends Scope<any, any[]>, Signals>() {
  type T1 = S['__scope']['parents'][number]
  return {
    debug<T extends GetNonAssignableElements<T1, Signals>>(_f: (p: GetAssignmentReferences<T, Signals>) => T) {
      /* placeholder */
    }
  }
}

/**
 * A signal is a middleware chain that can be used to modify the data
 * @typeParam T - The data type
 * @internal
 */
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

type Type<T> = (new(...args: any[]) => T) | (abstract new (...args: any[]) => T)

/**
 * Base class for all plugins and the core. Provides a signals mechanism to modify the data
 */
export class Scope<Produces, Parents extends unknown[] = []> {
  signal = new Signal<AcceptPartialUnion<Produces | Parents[number]>>()
  parent?: any // Parents['length'] extends 0 ? undefined : Scope<Parents[0], Tail<Parents>>
  __scope!: {
    produces: Produces
    parents: Parents
  }

  constructor(public name: string) { }

  addPipe(middleware: Pipe<Produces | Parents[number]>) {
    this.signal.addPipe(middleware)
  }

  use<S extends Scope<any, any[]>>(scope: NestedScope<S, [Produces, ...Parents]>) {
    if (!(scope instanceof Scope)) throw new Error('cannot use non-Scope instance')

    scope.setParent(this)
    this.addPipe(context => {
      return scope.signal.emit(context)
    })

    return useHelper<S, Produces | Parents[number]>()
  }

  setParent(scope: Scope<Parents[0], Tail<Parents>>) {
    this.parent = scope
  }

  emit<C extends Produces>(context: C): Promise<Extract<Produces, C> | undefined> {
    return this.signal.emit(context) as Promise<Extract<Produces, C>>
  }

  hasParent(): boolean {
    return Boolean(this.parent)
  }

  parentScope<T extends Parents[0], P extends Tail<Parents>>(): Scope<T, P>
  parentScope<T>(type: Type<T>): T
  parentScope<T>(type?: Type<T>): T {
    if (!this.parent) throw new Error('cannot find parent')
    if (type && this.parent instanceof type) return this.parent
    if (type) throw new Error('actual parent is not instance of type')
    return this.parent
  }
}
