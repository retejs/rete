/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type AcceptPartialUnion<T> = T | any

export type Tail<T extends any[]> = ((...args: T) => void) extends (head: any, ...tail: infer U) => any ? U : never

export type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never

type StrictExcludeInner<T, U> = 0 extends (
  U extends T ? [T] extends [U] ? 0 : never : never
) ? never : T
export type StrictExclude<T, U> = T extends unknown ? StrictExcludeInner<T, U> : never

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<StrictExclude<T, W>>, W]
  : []

export type FilterMatch<T extends any[], V> = T extends [infer Head, ...infer _Tail]
  ? ([Head] extends [V]
    ? [Head, ...FilterMatch<_Tail, V>]
    : FilterMatch<_Tail, V>
  ) : []

export type CanAssignToAnyOf<Provides, Requires> = FilterMatch<UnionToTuple<Provides>, Requires> extends [] ? false : true

export type CanAssignEachTupleElemmentToAnyOf<Provides, Requires extends any[]> = Requires extends [infer Head, ...infer _Tail]
  ? CanAssignToAnyOf<Provides, Head> extends true ?
    (_Tail extends []
      ? true
      : CanAssignEachTupleElemmentToAnyOf<Provides, _Tail>
    ) : false
  : false

export type CanAssignEachToAnyOf<Provides, Requires> = CanAssignEachTupleElemmentToAnyOf<Provides, UnionToTuple<Requires>>

export type CanAssignSignal<Provides, Requires> = CanAssignEachToAnyOf<Provides, Requires>

type ReplaceTupleTypes<T extends any[], U> = { [K in keyof T]: U }
export type FilterNever<T extends any[]> = T extends [infer Head, ...infer _Tail]
  ? ([Head] extends [never] ? FilterNever<_Tail> : [Head, ...FilterNever<_Tail>])
  : []

type KeepIfNonAssignable<T, Signals> = CanAssignToAnyOf<Signals, T> extends false ? T : never

export type GetAllNonValidElements<T extends any[], Signals> = T extends [infer Head, ...infer _Tail]
  ? ([KeepIfNonAssignable<Head, Signals>, ...GetAllNonValidElements<_Tail, Signals>])
  : []

export type GetNonAssignableElements<T, Signals>
  = FilterNever<GetAllNonValidElements<UnionToTuple<T>, Signals>>
export type GetAssignmentReferences<AssignableElements extends any[], Signals> = ReplaceTupleTypes<AssignableElements, Signals>
