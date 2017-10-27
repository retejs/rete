import { Connection } from './connection';
import { Control } from './control';
import { Socket } from './socket';

export class Input {
   
    constructor(title: string, socket: Socket, multiConns: boolean = false) {
        this.node = null;
        this.multipleConnections = multiConns;
        this.connections = [];
        this.title = title;
        this.socket = socket;
        this.control = null;
    }

    hasConnection() {
        return this.connections.length > 0;
    }

    addConnection(connection: Connection) {
        if (!this.multipleConnections && this.hasConnection())
            throw new Error('Multiple connections not allowed');
        this.connections.push(connection);
    }

    removeConnection(connection: Connection) {
        this.connections.splice(this.connections.indexOf(connection), 1);
    }

    removeConnections() {
        this.connections.forEach(c => c.remove());
    }

    addControl(control: Control) {
        this.control = control;
        control.parent = this;
    }

    showControl() {
        return !this.hasConnection() && this.control !== null;
    }

    toJSON() {
        return {
            'connections': this.connections.map(c => {
                return {
                    node: c.output.node.id,
                    output: c.output.node.outputs.indexOf(c.output)
                };
            })
        };
    }
}