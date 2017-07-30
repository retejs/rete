export class Block {

    constructor() {
        if (this.constructor === Block)
            throw new TypeError('Cannot construct Block instances')
        
        this.position = [0.0, 0.0];
    }
}