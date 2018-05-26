import { Component as ComponentWorker } from './engine/component';
import { Node } from './node';

export class Component extends ComponentWorker {
    constructor(name) {
        super(name);
        if (this.constructor === Component)
            throw new TypeError('Can not construct abstract class.');

        this.editor = null;
        this.data = {};
    }

    builder() { }

    created() { }

    destroyed() { }

    async build(node: Node) {
        //await this.editor.trigger('componentbuild', { component: this, node });
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