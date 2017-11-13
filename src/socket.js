export class Socket {

    constructor(id: string, name: string, hint: string) {
        this.id = id;
        this.name = name;
        this.hint = hint;
        this.compatible = [];
    }

    combineWith(socket: Socket) {
        this.compatible.push(socket);
    }

    compatibleWith(socket: Socket) {
        return this === socket || this.compatible.includes(socket);
    }
}