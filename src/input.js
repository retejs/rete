export class Input {
   
    constructor(title, socket) {
	    this.node = null;
        this.connection = null;
        this.title = title;
        this.socket = socket;
        this.control = null;
    }

    hasConnection() {
        return this.connection !== null;
    }

    setConnection(c) {
        this.connection = c;
    }

    removeConnection() {
        if (this.connection)
            this.connection.remove();
    }

    addControl(control) {
        this.control = control;
        control.parent = this;
    }

    showControl() {
        return this.connection === null && this.control !== null;
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
        var c = this.connection;

        return {
            'node': this.node.id,
            'connection': c ? { node: c.output.node.id, output: c.output.node.outputs.indexOf(c.output) }:null,
            'title': this.title,
            'socket': this.socket.id,
            'control': this.control?this.control.toJSON():null
        }
    }

    static fromJSON(json) {
        var input = new Input(json.title, null);

        return input;
    }
}