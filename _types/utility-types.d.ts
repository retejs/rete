export declare type AcceptPartialUnion<T> = T | any;
export declare type Tail<T extends any[]> = ((...args: T) => void) extends (head: any, ...tail: infer U) => any ? U : never;
export declare type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ? I : never;
declare type StrictExcludeInner<T, U> = 0 extends (U extends T ? [T] extends [U] ? 0 : never : never) ? never : T;
export declare type StrictExclude<T, U> = T extends unknown ? StrictExcludeInner<T, U> : never;
export declare type UnionToTuple<T> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W ? [...UnionToTuple<StrictExclude<T, W>>, W] : [];
export declare type FilterMatch<T extends any[], V> = T extends [infer Head, ...infer _Tail] ? ([Head] extends [V] ? [Head, ...FilterMatch<_Tail, V>] : FilterMatch<_Tail, V>) : [];
export declare type CanAssignToAnyOf<Provides, Requires> = FilterMatch<UnionToTuple<Provides>, Requires> extends [] ? false : true;
export declare type CanAssignEachTupleElemmentToAnyOf<Provides, Requires extends any[]> = Requires extends [infer Head, ...infer _Tail] ? CanAssignToAnyOf<Provides, Head> extends true ? (_Tail extends [] ? true : CanAssignEachTupleElemmentToAnyOf<Provides, _Tail>) : false : false;
export declare type CanAssignEachToAnyOf<Provides, Requires> = CanAssignEachTupleElemmentToAnyOf<Provides, UnionToTuple<Requires>>;
export declare type CanAssignSignal<Provides, Requires> = CanAssignEachToAnyOf<Provides, Requires>;
declare type ReplaceTupleTypes<T extends any[], U> = {
    [K in keyof T]: U;
};
export declare type FilterNever<T extends any[]> = T extends [infer Head, ...infer _Tail] ? ([Head] extends [never] ? FilterNever<_Tail> : [Head, ...FilterNever<_Tail>]) : [];
declare type KeepIfNonAssignable<T, Signals> = CanAssignToAnyOf<Signals, T> extends false ? T : never;
export declare type GetAllNonValidElements<T extends any[], Signals> = T extends [infer Head, ...infer _Tail] ? ([KeepIfNonAssignable<Head, Signals>, ...GetAllNonValidElements<_Tail, Signals>]) : [];
export declare type GetNonAssignableElements<T, Signals> = FilterNever<GetAllNonValidElements<UnionToTuple<T>, Signals>>;
export declare type GetAssignmentReferences<AssignableElements extends any[], Signals> = ReplaceTupleTypes<AssignableElements, Signals>;
export {};
//# sourceMappingURL=utility-types.d.ts.map