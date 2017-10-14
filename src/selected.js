import { Group } from './group';
import { Node } from './node';

export class Selected {

    constructor() {
        this.list = [];
    }

    add(item: Node | Group, accumulate = false) {
        if (accumulate) {
            if (this.contains(item))
                this.remove(item);
            else
                this.list.push(item);
        }
        else
            this.list = [item];    
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

    eachNode(callback) {
        this.list.filter(item => item instanceof Node).forEach(callback);
    }

    eachGroup(callback) {
        this.list.filter(item => item instanceof Group).forEach(callback);
    }

    getNodes() {
        return this.list.filter(item => item instanceof Node);
    }

    getGroups() {
        return this.list.filter(item => item instanceof Group);
    }
}