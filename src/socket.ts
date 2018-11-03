export class Socket {

    private compatible: Socket[] = [];

    constructor(public name: string, public data = {}) {}

    combineWith(socket: Socket) {
        this.compatible.push(socket);
    }

    compatibleWith(socket: Socket) {
        return this === socket || this.compatible.includes(socket);
    }
}