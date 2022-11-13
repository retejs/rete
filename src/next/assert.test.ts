
// type UnionToIntersection<U> =
//   (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

// type LastOf<T> =
//   UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

//   type Push<T extends any[], V> = [...T, V];

// // TS4.1+
//  // eslint-disable-next-line @typescript-eslint/no-unused-vars
//  type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
//     true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

// type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true


// type Check1<Super, Inher> = Super extends Inher ? true : false
// type Check2<Super, Inher> = Merge<Super> extends Merge<Inher> ? true : false
// type Check3<Super, Inher> = Super extends Merge<Inher> ? true : false
// type Check4<Super, Inher> = Merge<Super> extends Inher ? true : false

// ////

// type AllUnionMemberKeys<T> = T extends any ? keyof T : never;

// type MergeInsideTuple<T extends unknown[]> = T extends []
//   ? []
//   : (T extends [infer H, ...infer R]
//     ? [Merge<H>, ...MergeInsideTuple<R>]
//     : T
//   )

// type MergeUnionObjects<T> = IsUnion<T> extends true ? {
//   [K in AllUnionMemberKeys<T>]: T extends {[key in K]?: infer Prop} ? Merge<Prop> : never
// } : T

// type Merge<T> = [T] extends [unknown[]] ? MergeInsideTuple<T> : ([T] extends [boolean] ? boolean : MergeUnionObjects<T>)


// type ww = Merge<InherCorrect<boolean>>
// type tt = Merge<InherCorrect<boolean>>
// type ll = MergeUnionObjects<InherCorrect<boolean>>['type']

// type Super2<SocketEl = number> = { element: number, num: string } | { element: SocketEl, type: 'socket', key: string }
// type InherCorrect<SocketEl = number> = { element: number } | { element: SocketEl, type: 'socket' }
// type InherIncorrect<SocketEl = number> = { element: number } | { element: SocketEl, type: 'socket', wrongField: true }
// type InherIncorrect2 = { element: number } | { element: string, type: 'socket' }

// type t1 = Super2 extends InherIncorrect2 ? 1 : 2

// const n1: true = 1 as any as Check1<Super2, InherCorrect>
// const n2: true = 1 as any as Check2<Super2, InherCorrect>
// const n3: true = 1 as any as Check3<Super2, InherCorrect>
// const n4: true = 1 as any as Check4<Super2, InherCorrect>

// const n1f: false = 1 as any as Check1<Super2, InherIncorrect>
// const n2f: false = 1 as any as Check2<Super2, InherIncorrect>
// const n3f: false = 1 as any as Check3<Super2, InherIncorrect>
// const n4f: false = 1 as any as Check4<Super2, InherIncorrect>

// const n1f2: false = 1 as any as Check1<Super2, InherIncorrect2>
// const n2f2: false = 1 as any as Check2<Super2, InherIncorrect2>
// const n3f2: false = 1 as any as Check3<Super2, InherIncorrect2>
// const n4f2: false = 1 as any as Check4<Super2, InherIncorrect2>

// const t1: true = 1 as any as Check1<Super2<boolean>, InherCorrect<boolean>>
// const t2: true = 1 as any as Check2<Super2<boolean>, InherCorrect<boolean>>
// const t3: true = 1 as any as Check3<Super2<boolean>, InherCorrect<boolean>>
// const t4: true = 1 as any as Check4<Super2<boolean>, InherCorrect<boolean>>

// const t1f: false = 1 as any as Check1<Super2<boolean>, InherIncorrect<boolean>>
// const t2f: false = 1 as any as Check2<Super2<boolean>, InherIncorrect<boolean>>
// const t3f: false = 1 as any as Check3<Super2<boolean>, InherIncorrect<boolean>>
// const t4f: false = 1 as any as Check4<Super2<boolean>, InherIncorrect<boolean>>

// const t1f2: false = 1 as any as Check1<Super2<boolean>, InherIncorrect2>
// const t2f2: false = 1 as any as Check2<Super2<boolean>, InherIncorrect2>
// const t3f2: false = 1 as any as Check3<Super2<boolean>, InherIncorrect2>
// const t4f2: false = 1 as any as Check4<Super2<boolean>, InherIncorrect2>

// // [true, true, true, true] -> true
// // [bool, fals, bool, fals] -> false
// // [bool, fals, bool, fals] -> false


// console.log(
//   n1, n2, n3, n4, n1f, n2f, n3f, n4f, n1f2, n2f2, n3f2, n4f2,
//   t1, t2, t3, t4, t1f, t2f, t3f, t4f, t1f2, t2f2, t3f2, t4f2
// )
