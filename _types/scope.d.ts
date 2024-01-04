import { CanAssignSignal, GetAssignmentReferences, Tail } from './utility-types';
export type { CanAssignSignal };
/**
 * A middleware type that can modify the data
 * @typeParam T - The data type
 * @param data - The data to be modified
 * @returns The modified data or undefined
 * @example (data) => data + 1
 * @example (data) => undefined // will stop the execution
 * @internal
 */
export declare type Pipe<T> = (data: T) => Promise<undefined | T> | undefined | T;
export declare type CanAssignEach<D extends any[], F extends any[]> = D extends [infer H1, ...infer Tail1] ? (F extends [infer H2, ...infer Tail2] ? [
    CanAssignSignal<H1, H2>,
    ...CanAssignEach<Tail1, Tail2>
] : []) : [];
export declare type ScopeAsParameter<S extends Scope<any, any[]>, Current extends any[]> = (CanAssignEach<[S['__scope']['produces'], ...S['__scope']['parents']], Current>[number] extends true ? S : 'Argument Scope does not provide expected signals');
/**
 * Validate the Scope signals and replace the parameter type with an error message if they are not assignable
 * @internal
 */
export declare type NestedScope<S extends Scope<any, any[]>, Current extends any[]> = (CanAssignEach<Current, S['__scope']['parents']>[number] extends true ? S : 'Parent signals do not satisfy the connected scope. Please use `.debug($ => $) for detailed assignment error');
/**
 * Provides 'debug' method to check the detailed assignment error message
 * @example .debug($ => $)
 * @internal
 */
export declare function useHelper<S extends Scope<any, any[]>, Signals>(): {
    debug<T extends import("./utility-types").FilterNever<import("./utility-types").GetAllNonValidElements<import("./utility-types").UnionToTuple<S["__scope"]["parents"][number]>, Signals>>>(f: (p: { [K in keyof T]: Signals; }) => T): void;
};
/**
 * A signal is a middleware chain that can be used to modify the data
 * @typeParam T - The data type
 * @internal
 */
export declare class Signal<T> {
    pipes: Pipe<T>[];
    addPipe(pipe: Pipe<T>): void;
    emit<Context extends T>(context: Context): Promise<Context | undefined>;
}
declare type Type<T> = {
    new (...args: any[]): T;
} | (abstract new (...args: any[]) => T);
/**
 * Base class for all plugins and the core. Provides a signals mechanism to modify the data
 */
export declare class Scope<Produces, Parents extends unknown[] = []> {
    name: string;
    signal: Signal<any>;
    parent?: any;
    __scope: {
        produces: Produces;
        parents: Parents;
    };
    constructor(name: string);
    addPipe(middleware: Pipe<Produces | Parents[number]>): void;
    use<S extends Scope<any, any[]>>(scope: NestedScope<S, [Produces, ...Parents]>): {
        debug<T extends import("./utility-types").FilterNever<import("./utility-types").GetAllNonValidElements<import("./utility-types").UnionToTuple<S["__scope"]["parents"][number]>, Produces | Parents[number]>>>(f: (p: { [K in keyof T]: Produces | Parents[number]; }) => T): void;
    };
    setParent(scope: Scope<Parents[0], Tail<Parents>>): void;
    emit<C extends Produces>(context: C): Promise<Extract<Produces, C> | undefined>;
    hasParent(): boolean;
    parentScope<T extends Parents[0], P extends Tail<Parents>>(): Scope<T, P>;
    parentScope<T>(type: Type<T>): T;
}
//# sourceMappingURL=scope.d.ts.map