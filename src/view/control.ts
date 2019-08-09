import { Control } from '../control';
import { Emitter } from '../core/emitter';
import { EventsTypes } from '../events';

export class ControlView extends Emitter<EventsTypes> {

    constructor(el: HTMLElement, control: Control, emitter: Emitter<EventsTypes>) {
        super(emitter);
        this.trigger('rendercontrol', { el, control });
    }
}