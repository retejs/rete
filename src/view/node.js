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

        this._startPosition = null;
        this._drag = new Drag(this.el, this.onTranslate.bind(this), this.onSelect.bind(this));

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
        this._startPosition = [...this.node.position];
        this.trigger('selectnode', this.node);
    }

    onTranslate(dx, dy) {
        const x = this._startPosition[0] + dx;
        const y = this._startPosition[1] + dy;

        this.translate(x, y);
    }

    translate(x, y) {
        const node = this.node;
        const params = { node, x, y };

        if (!this.trigger('nodetranslate', params)) return;

        this.node.position[0] = params.x;
        this.node.position[1] = params.y;

        this.update();
        this.trigger('nodetranslated', { node });
    }

    update() {
        this.el.style.transform = `translate(${this.node.position[0]}px, ${this.node.position[1]}px)`;
    }

    remove() {
        
    }
}