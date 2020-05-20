import { Component } from '../engine/component';
import { Control } from '../control';
import { ControlView } from './control';
import { Drag } from './drag';
import { Emitter } from '../core/emitter';
import { EventsTypes } from '../events';
import { IO } from '../io';
import { Node } from '../node';
import { SocketView } from './socket';

export class NodeView extends Emitter<EventsTypes> {

    node: Node;
    component: Component;
    sockets = new Map<IO, SocketView>();
    controls = new Map<Control, ControlView>();

    el: HTMLElement;
    private _startPosition: number[] = [];
    private _drag: Drag;

    constructor(node: Node, component: Component, emitter: Emitter<EventsTypes>) {
        super(emitter);

        this.node = node;
        this.component = component;
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';

        this.el.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, node: this.node }));

        this._drag = new Drag(this.el, this.onTranslate.bind(this), this.onSelect.bind(this), () => {
            this.trigger('nodedraged', node);
            this.trigger('nodedragged', node);
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

    clearSockets() {
        const ios: IO[] = [ ...this.node.inputs.values(), ...this.node.outputs.values()];
        
        this.sockets.forEach(s => {
            if (!ios.includes(s.io)) this.sockets.delete(s.io);
        });
    }

    bindSocket(el: HTMLElement, type: string, io: IO) {
        this.clearSockets();
        this.sockets.set(io, new SocketView(el, type, io, this.node, this));
    }

    bindControl(el: HTMLElement, control: Control) {
        this.controls.set(control, new ControlView(el, control, this));
    }

    getSocketPosition(io: IO) {
        const socket = this.sockets.get(io);

        if (!socket) throw new Error(`Socket not found for ${io.name} with key ${io.key}`);

        return socket.getPosition(this.node);
    }

    onSelect(e: MouseEvent) {
        const payload = { node: this.node, accumulate: e.ctrlKey, e };
    
        this.onStart();
        this.trigger('multiselectnode', payload);
        this.trigger('selectnode', payload);
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

        const [px, py] = node.position;
        const prev: [number, number] = [px, py];

        node.position[0] = params.x;
        node.position[1] = params.y;

        this.update();
        this.trigger('nodetranslated', { node, prev });
    }

    update() {
        const [x, y] = this.node.position;

        this.el.style.transform = `translate(${x}px, ${y}px)`;
    }

    remove() {
        
    }

    destroy() {
        this._drag.destroy();
    }
}
