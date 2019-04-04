export interface Plugin {
    name: string;
    install: (context: any, options: any) => void;
}

export type PluginParams<T extends Plugin> = T['install'] extends (arg1: any, arg2: infer U) => any ? U : void;
