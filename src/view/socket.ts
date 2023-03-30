import { Emitter } from '../core/emitter';
import { EventsTypes } from '../events';
import { IO } from '../io';
import { Node } from '../node';
import { NodeView } from './node';

export class SocketView extends Emitter<EventsTypes> {

    el: HTMLElement;
    type: string;
    io: IO;
    node: Node;
    nodeView: NodeView;

    constructor(el: HTMLElement, type: string, io: IO, node: Node, emitter: NodeView) {
        super(emitter);
        this.el = el;
        this.type = type;
        this.io = io;
        this.node = node;
        this.nodeView = emitter

        this.trigger('rendersocket', { el, [type]: this.io, socket: io.socket });
    }

    getPosition({ position }: { position: number[] }): [number, number] {
        const el = this.el;

        let x = el.offsetLeft + el.offsetWidth / 2;
        let y = el.offsetTop + el.offsetHeight / 2;
        let searchDepth = 8;
        let parent = el.offsetParent! as HTMLElement;
        while (parent && parent !== this.nodeView.el && searchDepth > 0) {
            searchDepth--;
            x += parent.offsetLeft;
            y += parent.offsetTop;
            parent = parent.offsetParent as HTMLElement;
        }

        return [position[0] + x, position[1] + y];
    }
}