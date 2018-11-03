import { Node } from './node';

export class Selected {

    list: any[] = [];

    constructor() {}

    add(item: Node, accumulate = false) {
        if (!accumulate)
            this.list = [item]; 
        else if (!this.contains(item))
            this.list.push(item);   
    }

    clear() {
        this.list = [];
    }

    remove(item: any) {
        this.list.splice(this.list.indexOf(item), 1);
    }

    contains(item: any) {
        return this.list.indexOf(item) !== -1;
    }

    each(cb: any) {
        this.list.forEach(cb);
    }
}