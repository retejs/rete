import { Component as ComponentWorker } from './engine/component';
import { Node } from './node';

export class Component extends ComponentWorker {

    public data: any;
    public editor: any;

    constructor(public name: string) {
        super(name);
        if (this.constructor === Component)
            throw new TypeError('Can not construct abstract class.');

        this.editor = null;
        this.data = {};
    }

    async builder(node: Node) { }

    created(some: any) { }

    destroyed(node: Node) { }

    async build(node: Node) {
        await this.builder(node);

        return node;
    }

    async createNode(data = {}) {
        const node = new Node(this.name);
        
        node.data = data;
        await this.build(node);

        return node;
    }
}