/* eslint-disable @typescript-eslint/no-explicit-any */

export type AcceptPartialUnion<T> = T | any

export type Tail<T extends any[]> = ((...args: T) => void) extends (head: any, ...tail: infer U) => any ? U : never

type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never

type StrictExcludeInner<T, U> = 0 extends (
    U extends T ? [T] extends [U] ? 0 : never : never
) ? never : T
type StrictExclude<T, U> = T extends unknown ? StrictExcludeInner<T, U> : never

type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<StrictExclude<T, W>>, W]
  : []

type FilterMatch<T extends any[], V> = T extends [infer Head, ...infer _Tail]
  ? ([Head] extends [V]
    ? [Head, ...FilterMatch<_Tail, V>]
    : FilterMatch<_Tail, V>
  ): []

type CanAssignToAnyOf<Provides, Requires> = FilterMatch<UnionToTuple<Provides>, Requires> extends [] ? false : true

type CanAssignEachTupleElemmentToAnyOf<Provides, Requires extends any[]> = Requires extends [infer Head, ...infer _Tail]
    ? CanAssignToAnyOf<Provides, Head> extends true ?
      (_Tail extends []
        ? true
        : CanAssignEachTupleElemmentToAnyOf<Provides, _Tail>
      ): false
    : false

type CanAssignEachToAnyOf<Provides, Requires> = CanAssignEachTupleElemmentToAnyOf<Provides, UnionToTuple<Requires>>

export type CanAssignSignal<Provides, Requires> = CanAssignEachToAnyOf<Provides, Requires>
