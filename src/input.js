import { Connection } from './connection';
import { Control } from './control';
import { IO } from './io';
import { Socket } from './socket';

export class Input extends IO {
   
    constructor(key: string, title: string, socket: Socket, multiConns: boolean = false) {
        super(key, title, socket, multiConns);
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
                    output: c.output.key,
                    data: c.data
                };
            })
        };
    }
}