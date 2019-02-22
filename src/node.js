import { Control } from './control';
import { Input } from './input';
import { Output } from './output';

export class Node {

    constructor(name: string) {
        this.name = name;
        this.id = Node.incrementId();
        this.position = [0.0, 0.0];

        this.inputs = new Map();
        this.outputs = new Map();
        this.controls = new Map();
        this.data = {};
        this.meta = {};
    }

    _add(list, item, prop) {
        if (list.has(item.key))
            throw new Error(`Item with key '${item.key}' already been added to the node`);
        if (item[prop] !== null)
            throw new Error('Item has already been added to some node');
        
        item[prop] = this;
        list.set(item.key, item);
    }

    addControl(control: Control) {
        this._add(this.controls, control, 'parent');
        return this;
    }

    removeControl(control: Control) {
        control.parent = null;

        this.controls.delete(control.key);
    }

    addInput(input: Input) {
        this._add(this.inputs, input, 'node');
        return this;
    }

    removeInput(input: Input) {
        input.removeConnections();
        input.node = null;

        this.inputs.delete(input.key);
    }

    addOutput(output: Output) {
        this._add(this.outputs, output, 'node');
        return this;
    }

    removeOutput(output: Output) {
        output.removeConnections();
        output.node = null;

        this.outputs.delete(output.key);
    }

    getConnections() {
        const ios = [...this.inputs.values(), ...this.outputs.values()];
        const connections = ios.reduce((arr, io) => {
            return [...arr, ...io.connections];
        }, []);

        return connections;
    }

    update() {}

    static incrementId() {
        if (!this.latestId)
            this.latestId = 1
        else
            this.latestId++
        return this.latestId
    }

    static resetId() {
        this.latestId = 0;
    }

    toJSON() {
        return {
            'id': this.id,
            'data': this.data,
            'inputs': Array.from(this.inputs).reduce((obj, [key, input]) => (obj[key] = input.toJSON(), obj), {}),
            'outputs': Array.from(this.outputs).reduce((obj, [key, output]) => (obj[key] = output.toJSON(), obj), {}),
            'position': this.position,
            'name': this.name
        }
    }

    static fromJSON(json: Object) {
        const node = new Node(json.name);

        node.id = json.id;
        node.data = json.data;
        node.position = json.position;
        node.name = json.name;
        Node.latestId = Math.max(node.id, Node.latestId);

        return node;
    }
}
