import { Emitter } from '../core/emitter';
import { Throw } from '../helpers/throw';

export class ControlView extends Emitter {

    constructor(el: HTMLElement, control: any = Throw.required('Control'), emitter: Emitter) {
        super(emitter);
        this.trigger('rendercontrol', { el, control });
    }
}