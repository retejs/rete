export class Component {
    constructor(name) {
        if (this.constructor === Component)
            throw new TypeError('Can not construct abstract class.');
        
        this.name = name;
        this.data = {};
        this.engine = null;
    }

    worker() { }
}