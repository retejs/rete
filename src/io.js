import { Connection } from './connection';

export class IO {

    constructor(title, socket, multiConns) {
	    this.node = null;
        this.multipleConnections = multiConns;
        this.connections = [];
	   
        this.title = title;
        this.socket = socket;
    }
    
    removeConnection(connection: Connection) {
        this.connections.splice(this.connections.indexOf(connection), 1);
    }
}