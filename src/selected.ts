import { Node } from './node';

export class Selected {

    list: Node[] = [];

    add(item: Node, accumulate = false) {
        if (!accumulate)
            this.list = [item]; 
        else if (!this.contains(item))
            this.list.push(item);   
    }

    clear() {
        this.list = [];
    }

    remove(item: Node) {
        this.list.splice(this.list.indexOf(item), 1);
    }

    contains(item: Node) {
        return this.list.indexOf(item) !== -1;
    }

    each(callback: (n: Node, index: number) => void) {
        this.list.forEach(callback);
    }
}