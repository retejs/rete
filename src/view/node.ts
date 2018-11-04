import { Control } from '../control';
import { Drag } from './drag';
import { Emitter } from '../core/emitter';
import { IO } from '../io';
import { Control as ViewControl } from './control';
import { Socket as ViewSocket, Socket } from './socket';
import { ComponentEngine } from '../engine/index';

export class Node extends Emitter {

    public sockets = new Map<any, any>();
    controls = new Map<any, any>();
    el: HTMLDivElement;
    private _startPosition: any = null;
    private _drag: Drag;
    position: any;

    constructor(public node: Node, public component: ComponentEngine, emitter: Emitter) {
        super(emitter);

        // this.node = node;
        // this.component = component;
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';

        this.el.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, node: this.node }));

        this._drag = new Drag(this.el, this.onTranslate.bind(this), this.onSelect.bind(this), () => {
            this.trigger('nodedraged', node);
        });

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
        this.sockets.set(io, new ViewSocket(el, type, io, this.node as any, this));
    }

    bindControl(el: HTMLElement, control: Control) {
        this.controls.set(control, new ViewControl(el, control, this));
    }

    getSocketPosition(io: IO) {
        return this.sockets.get(io).getPosition(this.node);
    }

    onSelect(e: any) {
        this.onStart();
        this.trigger('selectnode', { node: this.node, accumulate: e.ctrlKey });
    }

    onStart() {
        this._startPosition = [...this.node.position];
    }

    onTranslate(dx: number, dy: number) {
        this.trigger('translatenode', { node: this.node, dx, dy });
    }

    onDrag(dx: number, dy: number) {
        const x = this._startPosition[0] + dx;
        const y = this._startPosition[1] + dy;

        this.translate(x, y);
    }

    translate(x: number, y: number) {
        const node = this.node;
        const params = { node, x, y };

        if (!this.trigger('nodetranslate', params)) return;

        const prev = [...node.position];

        node.position[0] = params.x;
        node.position[1] = params.y;

        this.update();
        this.trigger('nodetranslated', { node, prev });
    }

    update() {
        this.el.style.transform = `translate(${this.node.position[0]}px, ${this.node.position[1]}px)`;
    }

    remove() {
        
    }
}