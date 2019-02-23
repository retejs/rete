import { Control } from '../control';
import { Drag } from './drag';
import { Emitter } from '../core/emitter';
import { IO } from '../io';
import { Control as ViewControl } from './control';
import { Socket as ViewSocket } from './socket';
import { Node as NodeEntity } from '../node';
import { Component } from '../engine/component';

export class Node extends Emitter {

    node: NodeEntity;
    component: Component;
    sockets = new Map<IO, ViewSocket>();
    controls = new Map<Control, ViewControl>();

    el: HTMLElement;
    private _startPosition: number[] = [];

    constructor(node: NodeEntity, component: Component, emitter: Emitter) {
        super(emitter);

        this.node = node;
        this.component = component;
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';

        this.el.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, node: this.node }));

        new Drag(this.el, this.onTranslate.bind(this) as any, this.onSelect.bind(this) as any, () => {
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
        this.sockets.set(io, new ViewSocket(el, type, io, this.node, this));
    }

    bindControl(el: HTMLElement, control: Control) {
        this.controls.set(control, new ViewControl(el, control, this));
    }

    getSocketPosition(io: IO) {
        const socket = this.sockets.get(io);

        if(!socket) throw new Error(`Socket not fount for ${io.name} with key ${io.key}`);

        return socket.getPosition(this.node);
    }

    onSelect(e: MouseEvent) {        
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