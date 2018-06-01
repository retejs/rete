import { Area } from './area';
import { Connection } from '../connection';
import { Emitter } from '../core/emitter';
import { Node } from '../node';
import { Connection as ViewConnection } from './connection';
import { Node as ViewNode } from './node';

export class EditorView extends Emitter {

    constructor(container: HTMLElement, components: Object, emitter: Emitter) {
        super(emitter);

        this.container = container;
        this.components = components;

        this.container.style.overflow = 'hidden';

        this.nodes = new Map();
        this.connections = new Map();

        this.container.addEventListener('click', this.click.bind(this));
        this.container.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, view: this }));
        window.addEventListener('resize', this.resize.bind(this));

        this.on('nodetranslated', this.updateConnections.bind(this));
            
        this.area = new Area(container, this);
        this.container.appendChild(this.area.el);
    }

    addNode(node: Node) {
        const nodeView = new ViewNode(node, this.components.get(node.name), this);

        this.nodes.set(node, nodeView);
        this.area.appendChild(nodeView.el);
    }

    removeNode(node: Node) {
        const nodeView = this.nodes.get(node);

        this.nodes.delete(node);
        this.area.removeChild(nodeView.el);
    }

    addConnection(connection: Connection) {
        const viewInput = this.nodes.get(connection.input.node);
        const viewOutput = this.nodes.get(connection.output.node);
        const connView = new ViewConnection(connection, viewInput, viewOutput, this);

        this.connections.set(connection, connView);
        this.area.appendChild(connView.el);
    }

    removeConnection(connection: Connection) {
        const connView = this.connections.get(connection);

        this.connections.delete(connection);
        this.area.removeChild(connView.el);
    }

    updateConnections({ node }) {
        node.getConnections().map(conn => {
            this.connections.get(conn).update();
        });
    }

    resize() {
        const { container } = this;
        const width = container.parentElement.clientWidth;
        const height = container.parentElement.clientHeight;

        container.style.width = width + 'px';
        container.style.height = height + 'px';
    }

    click(e) {
        const container = this.container;
        
        if (container !== e.target) return;
        if (!this.trigger('click', { e, container })) return;
    }
}
