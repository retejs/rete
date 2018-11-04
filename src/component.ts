import { ComponentEngine } from './engine/component_engine';
import { Node } from './node';
import { NodeEditor } from './editor';


export class Component extends ComponentEngine {

    public data: any = {};
    public editor: NodeEditor = null;

    constructor(public name: string) {
        super(name);
        if (this.constructor === Component)
            throw new TypeError('Can not construct abstract class.');
    }

    public async builder(node: Node): Promise<Node> {
        return node;
    }

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