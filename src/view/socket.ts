import { Emitter } from '../core/emitter';
import { EventsTypes } from '../events';
import { IO } from '../io';
import { Node } from '../node';
import { NodeView } from './node';
import { getOffset } from './utils';

export class SocketView extends Emitter<EventsTypes> {

    el: HTMLElement;
    type: string;
    io: IO;
    node: Node;
    nodeViewEl: HTMLElement;

    constructor(el: HTMLElement, type: string, io: IO, node: Node, emitter: NodeView) {
        super(emitter);
        this.el = el;
        this.type = type;
        this.io = io;
        this.node = node;
        this.nodeViewEl = emitter.el;

        this.trigger('rendersocket', { el, [type]: this.io, socket: io.socket });
    }

    getPosition({ position }: { position: number[] }): [number, number] {
        const { el, nodeViewEl } = this;
        const { x, y } = getOffset(el, nodeViewEl);

        return [position[0] + x + el.offsetWidth / 2, position[1] + y + el.offsetHeight / 2];
    }
}