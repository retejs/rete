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
}