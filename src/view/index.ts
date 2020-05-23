import { Area } from './area';
import { Component } from '../engine/component';
import { Connection } from '../connection';
import { ConnectionView } from './connection';
import { Emitter } from '../core/emitter';
import { EventsTypes } from '../events';
import { Node } from '../node';
import { NodeView } from './node';
import { listenWindow } from './utils';

export class EditorView extends Emitter<EventsTypes> {

    container: HTMLElement;
    components: Map<string, Component>;
    nodes = new Map<Node, NodeView>();
    connections = new Map<Connection, ConnectionView>();
    area: Area;

    constructor(container: HTMLElement, components: Map<string, Component>, emitter: Emitter<EventsTypes>) {
        super(emitter);

        this.container = container;
        this.components = components;

        this.container.style.overflow = 'hidden';

        this.container.addEventListener('click', this.click.bind(this));
        this.container.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, view: this }));
        emitter.on('destroy', listenWindow('resize', this.resize.bind(this)));
        emitter.on('destroy', () => this.nodes.forEach(view => view.destroy()));
  
        this.on('nodetranslated', this.updateConnections.bind(this));
            
        this.area = new Area(container, this);
        this.container.appendChild(this.area.el);
    }

    addNode(node: Node) {
        const component = this.components.get(node.name);

        if (!component) throw new Error(`Component ${node.name} not found`);
        
        const nodeView = new NodeView(node, component, this);

        this.nodes.set(node, nodeView);
        this.area.appendChild(nodeView.el);
    }

    removeNode(node: Node) {
        const nodeView = this.nodes.get(node);

        this.nodes.delete(node);
        if (nodeView) {
            this.area.removeChild(nodeView.el);
            nodeView.destroy();
        }
    }

    addConnection(connection: Connection) {
        if (!connection.input.node || !connection.output.node)
            throw new Error('Connection input or output not added to node');

        const viewInput = this.nodes.get(connection.input.node);
        const viewOutput = this.nodes.get(connection.output.node);

        if (!viewInput || !viewOutput)
            throw new Error('View node not found for input or output');

        const connView = new ConnectionView(connection, viewInput, viewOutput, this);

        this.connections.set(connection, connView);
        this.area.appendChild(connView.el);
    }

    removeConnection(connection: Connection) {
        const connView = this.connections.get(connection);

        this.connections.delete(connection);
        if (connView)
            this.area.removeChild(connView.el);
    }

    updateConnections({ node }: { node: Node }) {
        node.getConnections().forEach(conn => {
            let connView = this.connections.get(conn);

            if (!connView) throw new Error('Connection view not found');

            connView.update();
        });
    }

    resize() {
        const { container } = this;

        if (!container.parentElement)
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
