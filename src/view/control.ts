import { Emitter } from '../core/emitter';
import { Control as ControlEntity } from '../control';

export class Control extends Emitter {

    constructor(el: HTMLElement, control: ControlEntity, emitter: Emitter) {
        super(emitter);
        this.trigger('rendercontrol', { el, control });
    }
}