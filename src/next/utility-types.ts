/* eslint-disable @typescript-eslint/no-explicit-any */

export type AcceptPartialUnion<T> = T | any

export type Tail<T extends any[]> = ((...args: T) => void) extends (head: any, ...tail: infer U) => any ? U : never;
