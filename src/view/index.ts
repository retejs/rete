import { Area } from './area';
import { Connection } from '../connection';
import { Emitter } from '../core/emitter';
import { Node } from '../node';
import { Connection as ViewConnection } from './connection';
import { Node as ViewNode } from './node';
import { Component } from '../engine/component';

export class EditorView extends Emitter {

    container: HTMLElement;
    components: Map<string, Component>;
    nodes = new Map<Node, ViewNode>();
    connections = new Map<Connection, ViewConnection>();
    area: Area;

    constructor(container: HTMLElement, components: Map<string, Component>, emitter: Emitter) {
        super(emitter);

        this.container = container;
        this.components = components;

        this.container.style.overflow = 'hidden';

        this.container.addEventListener('click', this.click.bind(this));
        this.container.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, view: this }));
        window.addEventListener('resize', this.resize.bind(this));

        this.on('nodetranslated', this.updateConnections.bind(this));
            
        this.area = new Area(container, this);
        this.container.appendChild(this.area.el);
    }

    addNode(node: Node) {
        const component = this.components.get(node.name);

        if(!component) throw new Error(`Component ${node.name} not found`);
        
        const nodeView = new ViewNode(node, component, this);

        this.nodes.set(node, nodeView);
        this.area.appendChild(nodeView.el);
    }

    removeNode(node: Node) {
        const nodeView = this.nodes.get(node);

        this.nodes.delete(node);
        if(nodeView)
            this.area.removeChild(nodeView.el);
    }

    addConnection(connection: Connection) {
        if(!connection.input.node || !connection.output.node)
            throw new Error('Connection input or output not added to node');

        const viewInput = this.nodes.get(connection.input.node);
        const viewOutput = this.nodes.get(connection.output.node);

        if(!viewInput || !viewOutput)
            throw new Error('View node not fount for input or output');

        const connView = new ViewConnection(connection, viewInput, viewOutput, this);

        this.connections.set(connection, connView);
        this.area.appendChild(connView.el);
    }

    removeConnection(connection: Connection) {
        const connView = this.connections.get(connection);

        this.connections.delete(connection);
        if(connView)
            this.area.removeChild(connView.el);
    }

    updateConnections({ node } : { node: Node }) {
        node.getConnections().map(conn => {
            let connView = this.connections.get(conn);

            if(!connView) throw new Error('Connection view not found');

            connView.update();
        });
    }

    resize() {
        const { container } = this;

        if(!container.parentElement)
            throw new Error('Container doesn\'t have parent element');

        const width = container.parentElement.clientWidth;
        const height = container.parentElement.clientHeight;

        container.style.width = width + 'px';
        container.style.height = height + 'px';
    }

    click(e: Event) {
        const container = this.container;
        
        if (container !== e.target) return;
        if (!this.trigger('click', { e, container })) return;
    }
}
