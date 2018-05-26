import { Control } from '../control';
import { Drag } from './drag';
import { Emitter } from '../core/emitter';
import { IO } from '../io';
import { Control as ViewControl } from './control';
import { Socket as ViewSocket } from './socket';

export class Node extends Emitter {

    constructor(node, component, emitter) {
        super(emitter);

        this.node = node;
        this.component = component;
        this.sockets = new Map();
        this.controls = new Map();
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';

        this.el.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, node: this.node }));
        this.drag = new Drag(this.el, this.onTranslate.bind(this), this.onSelect.bind(this));

        this.trigger('rendernode', {
            el: this.el, 
            node, 
            component: component.data, 
            bindSocket: this.bindSocket.bind(this),
            bindControl: this.bindControl.bind(this)
        });
        
        this.update();
    }

    bindSocket(el: HTMLElement, type: string, io: IO) {
        this.sockets.set(io, new ViewSocket(el, type, io, this.node, this));
    }

    bindControl(el: HTMLElement, control: Control) {
        this.controls.set(control, new ViewControl(el, control, this));
    }

    getSocketPosition(io) {
        return this.sockets.get(io).getPosition(this.node);
    }

    onSelect() {
        this.trigger('selectnode', this.node);
    }

    onTranslate(dx, dy) {
        const node = this.node;
        const x = node.position[0] + dx;
        const y = node.position[1] + dy;

        if (!this.trigger('nodetranslate', { node, x, y })) return;
            
        this.translate(x, y);

        this.trigger('nodetranslated', { node });
    }

    translate(x, y) {
        this.node.position[0] = x;
        this.node.position[1] = y;

        this.update();
    }

    update() {
        this.el.style.transform = `translate(${this.node.position[0]}px, ${this.node.position[1]}px)`;
    }

    remove() {
        
    }
}