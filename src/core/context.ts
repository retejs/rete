import { Emitter } from './emitter'
import { Validator } from './validator'

export class Context extends Emitter {
    plugins = new Map<string, any>();

    constructor(public id: string, events: any) {
        super(events);

        if (!Validator.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');

        this.id = id;
    }

    use(plugin: any, options = {}) {
        if (plugin.name && this.plugins.has(plugin.name)) throw new Error(`Plugin ${plugin.name} already in use`)

        plugin.install(this, options);
        this.plugins.set(plugin.name, options)
    }
}