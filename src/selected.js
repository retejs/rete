import { Node } from './node';

export class Selected {

    constructor() {
        this.list = [];
    }

    add(item: Node, accumulate = false) {
        if (accumulate) {
            if (this.contains(item))
                this.remove(item);
            else
                this.list.push(item);
        }
        else
            this.list = [item];    
    }

    clear() {
        this.each(item => {
            this.remove(item);
        });
    }

    remove(item) {
        this.list.splice(this.list.indexOf(item), 1);
    }

    contains(item) {
        return this.list.indexOf(item) !== -1;
    }

    each(callback) {
        this.list.forEach(callback);
    }
}