import { Emitter } from '../core/emitter';
import { IO } from '../io';

export class Socket extends Emitter {

    constructor(public el: HTMLElement, public type: any, public io: IO, public node: Node, emitter: Emitter) {
        super(emitter);
        this.trigger('rendersocket', { el, [type]: this.io, socket: io.socket });
    }

    getPosition({ position }: { position: any }) {
        const el = this.el;

        return [
            position[0] + el.offsetLeft + el.offsetWidth / 2,
            position[1] + el.offsetTop + el.offsetHeight / 2
        ]
    }
}