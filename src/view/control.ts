import { Emitter } from '../core/emitter';

export class Control extends Emitter {

    constructor(el, control, emitter) {
        super(emitter);
        this.trigger('rendercontrol', { el, control });
    }
}