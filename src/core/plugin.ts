export interface Plugin {
    name: string;
    install: (context: any, options?: any) => void;
}

export type PluginParams<T extends Plugin> = T['install'] extends (arg1: unknown, arg2: infer U) => void ? U : void;
