import { Connection } from './connection';

export class IO {

    constructor(key, name, socket, multiConns) {
	    this.node = null;
        this.multipleConnections = multiConns;
        this.connections = [];
	   
        this.key = key;
        this.name = name;
        this.socket = socket;
    }
    
    removeConnection(connection: Connection) {
        this.connections.splice(this.connections.indexOf(connection), 1);
    }

    removeConnections() {
        this.connections.map(connection => this.removeConnection(connection));
    }
}