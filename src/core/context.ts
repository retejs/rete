import { Emitter } from './emitter'
import { Validator } from './validator'
import { Events } from './events';

export class Context extends Emitter {
    private _plugins = new Map<string, any>();

    constructor(public id: string, events: Events) {
        super(events);

        if (!Validator.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');
    }

    use(plugin: any, options?: any) {
        if (plugin.name && this._plugins.has(plugin.name)) throw new Error(`Plugin ${plugin.name} already in use`)

        plugin.install(this, options);
        this._plugins.set(plugin.name, options)
    }

    plugins(key?: string) {
        return key ? this._plugins.get(key) : this._plugins.values();
    }
}