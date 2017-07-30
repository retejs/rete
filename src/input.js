export class Input {
   
    constructor(title, socket, multipleConnections) {
        this.node = null;
        this.multipleConnections = multipleConnections || false;
        this.connections = [];
        this.title = title;
        this.socket = socket;
        this.control = null;
    }

    hasConnection() {
        return this.connections.length > 0;
    }

    addConnection(c) {
        if (!this.multipleConnections && this.hasConnection())
            throw new Error('Multiple connections not allowed');
        this.connections.push(c);
    }

    removeConnection(connection) {
        this.connections.splice(this.connections.indexOf(connection), 1);
    }

    removeConnections() {
        this.connections.forEach(c => c.remove());
    }

    addControl(control) {
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