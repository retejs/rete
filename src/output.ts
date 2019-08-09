import { Connection } from './connection';
import { IO } from './io';
import { Input } from './input';
import { OutputData } from './core/data';
import { Socket } from './socket';

export class Output extends IO {
  
    constructor(key: string, title: string, socket: Socket, multiConns: boolean = true) {
        super(key, title, socket, multiConns);
    }
    
    hasConnection() {
        return this.connections.length > 0;
    }

    connectTo(input: Input) {
        if (!this.socket.compatibleWith(input.socket))
            throw new Error('Sockets not compatible');
        if (!input.multipleConnections && input.hasConnection())
            throw new Error('Input already has one connection');
        if (!this.multipleConnections && this.hasConnection())
            throw new Error('Output already has one connection');

        const connection = new Connection(this, input);

        this.connections.push(connection);
        return connection;
    }

    connectedTo(input: Input) {
        return this.connections.some((item) => {
            return item.input === input;
        });
    }

    toJSON(): OutputData {
        return {
            'connections': this.connections.map(c => {
                if (!c.input.node) throw new Error('Node not added to Input');

                return {
                    node: c.input.node.id,
                    input: c.input.key,
                    data: c.data
                }
            })
        };
    }
}