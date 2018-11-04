export class Socket {

    private compatible: Socket[] = [];

    constructor(public name: string, public data = {}) {
        if (typeof name !== 'string') {
            throw new Error(`You must specify a reference name in the instance.
                A value of type ${typeof name} was received, a "string" was expected.`);
        }
    }

    combineWith(socket: Socket) {
        this.compatible.push(socket);
    }

    compatibleWith(socket: Socket) {
        return this === socket || this.compatible.includes(socket);
    }
}