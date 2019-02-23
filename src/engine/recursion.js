function intersect(array1, array2) {
    return array1.filter(value => -1 !== array2.indexOf(value));
}

export class Recursion {
    constructor(nodes) {
        this.nodes = nodes;
    }
    
    extractInputNodes(node) {
        return Object.keys(node.inputs).reduce((a, key) => {
            return [...a, ...(node.inputs[key].connections || []).reduce((b, c) => [...b, this.nodes[c.node]], [])]
        }, []);
    }

    findSelf(list, inputNodes) {
        const inters = intersect(list, inputNodes);

        if (inters.length)
            return inters[0];
        
        for (let node of inputNodes) {
            let inter = this.findSelf([node, ...list], this.extractInputNodes(node));

            if (inter)
                return inter;
        }

        return null;
    }

    detect() {
        const nodesArr = Object.keys(this.nodes).map(id => this.nodes[id]);

        for (let node of nodesArr) {
            let inters = this.findSelf([node], this.extractInputNodes(node));

            if (inters)
                return inters;
        }

        return null;
    }
}