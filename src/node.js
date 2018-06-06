import { Component } from './component';
import { Control } from './control';
import { Input } from './input';
import { Output } from './output';

export class Node {
   
    constructor(name: string) {
        this.name = name;
        this.id = Node.incrementId();
        this.position = [0.0, 0.0];

        this.inputs = [];
        this.outputs = [];
        this.controls = [];
        this.data = {};
        this.meta = {};
    }

    addControl(control: Control, index: ?uint8 = this.controls.length) {
        control.parent = this;

        this.controls.splice(index, 0, control);
        return this;
    }

    removeControl(control: Control) {
        control.parent = null;
        this.controls.splice(this.controls.indexOf(control), 1);
    }

    addInput(input: Input, index: ?uint8 = this.inputs.length) {
        if (input.node !== null)
            throw new Error('Input has already been added to the node');
 
        input.node = this;

        this.inputs.splice(index, 0, input);
        return this;
    }

    removeInput(input: Input) {
        input.removeConnections();
        input.node = null;
        this.inputs.splice(this.inputs.indexOf(input), 1);
    }

    addOutput(output: Output, index: ?uint8 = this.outputs.length) {
        if (output.node !== null)
            throw new Error('Output has already been added to the node');
        
        output.node = this;

        this.outputs.splice(index, 0, output);
        return this;
    }

    removeOutput(output: Output) {
        output.removeConnections();
        output.node = null;
        this.outputs.splice(this.outputs.indexOf(output), 1);
    }

    getConnections() {
        const ios = [...this.inputs, ...this.outputs];
        const connections = ios.reduce((arr, io) => {
            return [...arr, ...io.connections];
        }, []);
    
        return connections;
    }

    inputsWithVisibleControl() {
        return this.inputs.filter((input)=> {
            return input.showControl();
        });
    }

    static incrementId() {
        if (!this.latestId)
            this.latestId = 1
        else
            this.latestId++
        return this.latestId
    }

    toJSON() {
        return {
            'id': this.id,
            'data': this.data,
            'inputs': this.inputs.map(input => input.toJSON()),
            'outputs': this.outputs.map(output => output.toJSON()),
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
