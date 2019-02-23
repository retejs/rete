import { Component as ComponentWorker } from './engine/component';
import { Node } from './node';

export abstract class Component extends ComponentWorker {

    editor: any = null;
    data: any = {};

    constructor(name: string) {
        super(name);
    }

    abstract async builder(node: Node): Promise<any>;

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