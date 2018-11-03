import { Emitter } from '../core/emitter';

export class Socket extends Emitter {

    constructor(el, type, io, node, emitter) {
        super(emitter);
        this.el = el;
        this.type = type;
        this.io = io;
        this.node = node;

        this.trigger('rendersocket', { el, [type]: this.io, socket: io.socket });
    }

    getPosition({ position }) {
        const el = this.el;

        return [
            position[0] + el.offsetLeft + el.offsetWidth / 2,
            position[1] + el.offsetTop + el.offsetHeight / 2
        ]
    }
}