import { NodeData, NodesData } from '../core/data';

function intersect(array1: any[], array2: any[]) {
    return array1.filter(value => -1 !== array2.indexOf(value));
}

export class Recursion {

    nodes: NodesData;

    constructor(nodes: NodesData) {
        this.nodes = nodes;
    }
    
    extractInputNodes(node: NodeData): NodeData[] {
        return Object.keys(node.inputs).reduce((a: any[], key: string) => {
            const { connections } = node.inputs[key];

            return [...a, ...(connections || []).reduce((b: any[], c: any) => [...b, this.nodes[c.node]], [])]
        }, []);
    }

    findSelf(list: any[], inputNodes: NodeData[]): NodeData | null {
        const inters = intersect(list, inputNodes);

        if (inters.length)
            return inters[0];
        
        for (let node of inputNodes) {
            let l = [node, ...list];
            let inter = this.findSelf(l, this.extractInputNodes(node));

            if (inter)
                return inter;
        }

        return null;
    }

    detect(): NodeData | null {
        const nodesArr = Object.keys(this.nodes).map(id => this.nodes[id]);

        for (let node of nodesArr) {
            let inters = this.findSelf([node], this.extractInputNodes(node));

            if (inters)
                return inters;
        }

        return null;
    }
}