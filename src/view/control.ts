import { Emitter } from '../core/emitter';

export class Control extends Emitter {

    constructor(public el: HTMLElement, public control: any, emitter: Emitter) {
        super(emitter);
        this.trigger('rendercontrol', { el, control });
    }
}