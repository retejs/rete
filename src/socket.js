export class Socket {

    constructor(id, name, hint) {
        this.id = id;
        this.name = name;
        this.hint = hint;
        this.compatible = [];
    }

    combineWith(socket) {
        if (!(socket instanceof Socket)) throw new Error('Invalid socket');
        this.compatible.push(socket);
    }

    compatibleWith(socket) {
        if (!(socket instanceof Socket)) throw new Error('Invalid socket');
        return this.id === socket.id || this.compatible.indexOf(socket) !== -1;
    }
}