export class Socket {

    constructor(name: string, data = {}) {
        this.name = name;
        this.data = data;
        this.compatible = [];
    }

    combineWith(socket: Socket) {
        this.compatible.push(socket);
    }

    compatibleWith(socket: Socket) {
        return this === socket || this.compatible.includes(socket);
    }
}