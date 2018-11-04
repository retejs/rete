import { Connection } from './connection';
import { Socket } from './socket';
import { Node } from './node';

export class IO {

    connections: Connection[] = [];
    node: Node = null;

    constructor(public key: string, public name: string, public socket: Socket, public multipleConnections: boolean) { }

    removeConnection(connection: Connection) {
        this.connections.splice(this.connections.indexOf(connection), 1);
    }

    removeConnections() {
        this.connections.map(connection => this.removeConnection(connection));
    }
}