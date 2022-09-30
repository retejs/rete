import { InputConnectionData, NodeData, NodesData } from '../core/data';

function intersect<T>(array1: T[], array2: T[]) {
    return array1.filter(value => -1 !== array2.indexOf(value));
}

export class Recursion {

    nodes: NodesData;

    constructor(nodes: NodesData) {
        this.nodes = nodes;
    }

    extractInputNodes(node: NodeData): NodeData[] {
        return Object.keys(node.inputs).reduce((acc: NodeData[], key: string) => {
            const { connections } = node.inputs[key];
            const nodesData = (connections || []).reduce((b: NodeData[], c: InputConnectionData) => {
                return [...b, this.nodes[c.node]];
            }, []);

            return [...acc, ...nodesData]
        }, []);
    }

    findSelf(list: NodeData[], inputNodes: NodeData[]): NodeData | null {
        const inters = intersect<NodeData>(list, inputNodes);

        if (inters.length)
            return inters[0];

        for (const node of inputNodes) {
            const l = [node, ...list];
            const inter = this.findSelf(l, this.extractInputNodes(node));

            if (inter)
                return inter;
        }

        return null;
    }

    detect(): NodeData | null {
        const nodesArr = Object.keys(this.nodes).map(id => this.nodes[id]);

        for (const node of nodesArr) {
            const inters = this.findSelf([node], this.extractInputNodes(node));

            if (inters)
                return inters;
        }

        return null;
    }
}
