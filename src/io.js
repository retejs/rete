import { Connection } from './connection';

export class IO {

    constructor(name, socket, multiConns) {
	    this.node = null;
        this.multipleConnections = multiConns;
        this.connections = [];
	   
        this.name = name;
        this.socket = socket;
    }
    
    removeConnection(connection: Connection) {
        this.connections.splice(this.connections.indexOf(connection), 1);
    }
}