import { Connection } from './connection';
import { Input } from './input';

export class Output {
  
    constructor(title, socket) {
	    this.node = null;
        this.connections = [];
	   
        this.title = title;
        this.socket = socket;
    }

    connectTo(input) {
        if (!(input instanceof Input)) throw new Error('Invalid input');
        if (!this.socket.compatibleWith(input.socket)) throw new Error('Sockets not compatible');
        if (input.hasConnection()) throw new Error('Input already has one connection');

        var connection = new Connection(this, input);

        this.connections.push(connection);
        return connection;
    }

    connectedTo(input) {
        return this.connections.some(function(item) {
            return item.input === input;
        });
    }

    removeConnection(connection, propagate = true) {
        this.connections.splice(this.connections.indexOf(connection), 1);
        if (propagate)
            connection.remove();
    }

    removeConnections() {
        this.connections.forEach(function(connection) {
            connection.remove();
        });
    }

    positionX() {
        return this.node.position[0] + this.node.width;
    }

    positionY() {
        var node = this.node;

        return node.position[1] +
            node.headerHeight() +
            this.socket.margin +
            this.socket.radius +   
            node.outputs.indexOf(this) * this.socket.height();
    }
}