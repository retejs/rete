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
        this.width = 180;
        this.height = 100;
    }

    static incrementId() {
        if (!this.latestId)
            this.latestId = 1
        else
            this.latestId++
        return this.latestId
    }

    addControl(control, index = -1) {
        if (!(control instanceof Control)) throw new Error('Invalid instance');
        
        control.parent = this;

        if (index >= 0)
            this.controls.splice(index, 0, control);
        else
            this.controls.push(control);        
        
        return this;
    }

    addInput(input, index = -1) {
        if (!(input instanceof Input))
            throw new Error('Invalid instance');
        if (input.node !== null)
            throw new Error('Input has already been added to the node');
        
        input.node = this;

        if (index >= 0)
            this.inputs.splice(index, 0, input);
        else
            this.inputs.push(input);
        
        return this;
    }

    addOutput(output, index = -1) {
        if (!(output instanceof Output))
            throw new Error('Invalid instance');
        if (output.node !== null)
            throw new Error('Output has already been added to the node');
        
        output.node = this;

        if (index >= 0)
            this.outputs.splice(index, 0, output);
        else
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
        Node.latestId = Math.max(node.id, Node.latestId);
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