import { Emitter } from '../core/emitter';
import { Control as ControlEntity } from '../control';
import { EventsTypes } from '../events';

export class Control extends Emitter<EventsTypes> {

    constructor(el: HTMLElement, control: ControlEntity, emitter: Emitter<EventsTypes>) {
        super(emitter);
        this.trigger('rendercontrol', { el, control });
    }
}