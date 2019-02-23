import { Emitter } from '../core/emitter';
import { IO } from '../io';
import { Node } from '../node';

export class Socket extends Emitter {

    el: HTMLElement;
    type: string;
    io: IO;
    node: Node;

    constructor(el: HTMLElement, type: string, io: IO, node: Node, emitter: Emitter) {
        super(emitter);
        this.el = el;
        this.type = type;
        this.io = io;
        this.node = node;

        this.trigger('rendersocket', { el, [type]: this.io, socket: io.socket });
    }

    getPosition({ position } : { position: number[] }) {
        const el = this.el;

        return [
            position[0] + el.offsetLeft + el.offsetWidth / 2,
            position[1] + el.offsetTop + el.offsetHeight / 2
        ]
    }
}