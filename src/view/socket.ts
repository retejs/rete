import { Emitter } from '../core/emitter';
import { EventsTypes } from '../events';
import { IO } from '../io';
import { Node } from '../node';
import { getOffset } from './utils';

export class SocketView extends Emitter<EventsTypes> {

    el: HTMLElement;
    type: string;
    io: IO;
    node: Node;

    constructor(el: HTMLElement, type: string, io: IO, node: Node, emitter: Emitter<EventsTypes>) {
        super(emitter);
        this.el = el;
        this.type = type;
        this.io = io;
        this.node = node;

        this.trigger('rendersocket', { el, [type]: this.io, socket: io.socket });
    }

    getPosition({ position, el: nodeViewEl }: { position: number[], el: HTMLElement }): [number, number] {
        const { el } = this;
        const { x, y } = getOffset(el, nodeViewEl);

        return [position[0] + x + el.offsetWidth / 2, position[1] + y + el.offsetHeight / 2];
    }
}