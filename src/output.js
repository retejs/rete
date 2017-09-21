import { Connection } from './connection';
import { Input } from './input';
import { Socket } from './socket';

export class Output {
  
    constructor(title: string, socket: Socket) {
	    this.node = null;
        this.connections = [];
	   
        this.title = title;
        this.socket = socket;
    }

    connectTo(input: Input) {
        if (!this.socket.compatibleWith(input.socket))
            throw new Error('Sockets not compatible');
        if (!input.multipleConnections && input.hasConnection())
            throw new Error('Input already has one connection');

        var connection = new Connection(this, input);

        this.connections.push(connection);
        return connection;
    }

    connectedTo(input: Input) {
        return this.connections.some((item) => {
            return item.input === input;
        });
    }

    removeConnection(connection: Connection, propagate:boolean = true) {
        this.connections.splice(this.connections.indexOf(connection), 1);
        if (propagate)
            connection.remove();
    }

    removeConnections() {
        this.connections.forEach((connection) => {
            connection.remove();
        });
    }

    toJSON() {
        return {
            'connections': this.connections.map(c => {
                return {
                    node: c.input.node.id,
                    input: c.input.node.inputs.indexOf(c.input)
                }
            })
        };
    }
}