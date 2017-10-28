import { Block } from './block';
import { Control } from './control';
import { Input } from './input';
import { Output } from './output';

export class Node extends Block {
   
    constructor(title: string) {
        super(Node);
        this.group = null;
        this.inputs = [];
        this.outputs = [];
        this.controls = [];
        this.data = {};

        this.title = title;
        [this.width, this.height] = [180, 100];
    }

    addControl(control: Control, index: ?uint8 = null) {
        control.parent = this;

        if (index)
            this.controls.splice(index, 0, control);
        else
            this.controls.push(control);        
        
        return this;
    }

    addInput(input: Input, index: ?uint8 = null) {
        if (input.node !== null)
            throw new Error('Input has already been added to the node');
        
        input.node = this;

        if (index)
            this.inputs.splice(index, 0, input);
        else
            this.inputs.push(input);
        
        return this;
    }

    addOutput(output: Output, index: ?uint8 = null) {
        if (output.node !== null)
            throw new Error('Output has already been added to the node');
        
        output.node = this;

        if (index)
            this.outputs.splice(index, 0, output);
        else
            this.outputs.push(output);

        return this;
    }

    getConnections(type) {
        var conns = [];

        if (type==='input' || !type)
            this.inputs.map(input => {
                input.connections.forEach(c => {
                    conns.push(c);
                });
            });
        
        if (type==='output' || !type)
            this.outputs.forEach(output => {
                output.connections.forEach(c => {
                    conns.push(c);
                });
            });
        return conns;
    }

    inputsWithVisibleControl() {
        return this.inputs.filter((input)=> {
            return input.showControl();
        });
    }

    toJSON() {
        return {
            'id': this.id,
            'data': this.data,
            'group': this.group ? this.group.id : null,
            'inputs': this.inputs.map(input => input.toJSON()),
            'outputs': this.outputs.map(output => output.toJSON()),
            'position': this.position,
            'title': this.title
        }
    }

    static fromJSON(builder: Object, json: Object) {
        var node = builder();

        node.id = json.id;
        node.data = json.data;
        Node.latestId = Math.max(node.id, Node.latestId);
        node.position = json.position;
        node.title = json.title;

        return node;
    }
}