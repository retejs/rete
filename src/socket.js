export class Socket {

    constructor(id, name, hint) {
        this.id = id;
        this.name = name;
        this.hint = hint;
        this.compatible = [];

	    this.radius = 0.006; 
	    this.margin = 0.004;
    }

    combineWith(socket) {
        if (!(socket instanceof Socket)) throw new Error('Invalid socket');
        this.compatible.push(socket);
    }

    compatibleWith(socket) {
        if (!(socket instanceof Socket)) throw new Error('Invalid socket');
        return this === socket || this.compatible.indexOf(socket) !== -1;
    }

    height() {
        return 2 * this.radius + 2 * this.margin;
    }
}