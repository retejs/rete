import {Block} from './block';
import {Control} from './control';
import {Input} from './input';
import {Output} from './output';

export class Node extends Block {
   
    constructor(title) {
        super();
        this.id = Node.incrementId();
        this.group = null;
        this.inputs = [];
        this.outputs = [];
        this.controls = [];

        this.title = title;
    }

    static incrementId() {
        if (!this.latestId)
            this.latestId = 1
        else
            this.latestId++
        return this.latestId
    }

    addControl(control) {
        if (!(control instanceof Control)) throw new Error('Invalid instance');
        this.controls.push(control);
        control.parent = this;
        
        return this;
    }

    addInput(input) {
        if (!(input instanceof Input))
            throw new Error('Invalid instance');
        if (input.node !== null)
            throw new Error('Input has already been added to the node');
        input.node = this;
        this.inputs.push(input);
        
        return this;
    }

    addOutput(output) {
        if (!(output instanceof Output))
            throw new Error('Invalid instance');
        if (output.node !== null)
            throw new Error('Output has already been added to the node');
        
        output.node = this;
        this.outputs.push(output);

        return this;
    }
    inputsWithVisibleControl() {
        return this.inputs.filter(function (input) {
            return input.showControl();
        });
    }

    remove() {
        this.inputs.forEach(function(input) {
            input.removeConnections();
        });
        this.outputs.forEach(function(output) {
            output.removeConnections();
        })
    }

    toJSON() {
        return {
            'id': this.id,
            'group': this.group ? this.group.id : null,
            'inputs': this.inputs.map(a => a.toJSON()),
            'outputs': this.outputs.map(a => a.toJSON()),
            'controls': this.controls.map(a => a.toJSON()),
            'position': this.position,
            'title': this.title
        }
    }

    static fromJSON(json, sockets) {
        var node = new Node();

        node.id = json.id;
        node.position = json.position;
        node.title = json.title;
        
        json.inputs.forEach(inputJson => {
            var input = Input.fromJSON(inputJson);

            input.socket = sockets[inputJson.socket];
            if (inputJson.control !== null)
                input.addControl(Control.fromJSON(inputJson.control));
            node.addInput(input);
        });

        json.outputs.forEach(outputJson => {
            var output = Output.fromJSON(outputJson);

            output.socket = sockets[outputJson.socket];
            node.addOutput(output);
        });

        json.controls.forEach(controlJson => {
            var control = Control.fromJSON(controlJson);

            node.addControl(control);
        })

        return node;
    }
}