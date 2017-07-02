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

    positionX() {
        return this.node.position[0];
    }

    positionY() {
        var node = this.node;

        return node.position[1] +
            node.headerHeight() +
            node.outputsHeight() +
            node.controlsHeight() +
            this.socket.margin +
            this.socket.radius +   
            node.inputs.indexOf(this) * this.socket.height()
            + this.socket.margin;
    }

    toJSON() {
        return {
            'node': this.node.id,
            'connections': this.connections.map(c => { return { node: c.output.node.id, output: c.output.node.outputs.indexOf(c.output) } }),
            'multipleConnections': this.multipleConnections,
            'title': this.title,
            'socket': this.socket.id,
            'control': this.control?this.control.toJSON():null
        }
    }

    static fromJSON(json) {
        var input = new Input(json.title, null, json.multipleConnections);

        return input;
    }
}