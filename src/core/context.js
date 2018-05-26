import { Emitter } from './emitter'
import { Validator } from './validator'

export class Context extends Emitter {

    constructor(id, events) {
        super(events);

        if (!Validator.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');  
        
        this.id = id;
    }

    use(plugin, options = {}) {
        plugin.install(this, options);
    }
}