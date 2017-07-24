import {Block} from './block';
import {Control} from './control';
import {Input} from './input';
import {Output} from './output';

export class Node extends Block {
   
    constructor(title, width) {
        super();
        this.id = Node.incrementId();
        this.group = null;
        this.inputs = [];
        this.outputs = [];
        this.controls = [];
        
        this.title = {
            size: 20,
            text: title
        };
        this.margin = 10;
        this.width = width || 200;
        this.height = 100;
    }

    static incrementId() {
        if (!this.latestId)
            this.latestId = 1
        else
            this.latestId++
        return this.latestId
    }

    update() {
        this.height = this.headerHeight()
            + this.outputsHeight()
            + this.inputsHeight() 
            + this.controlsHeight()
            + this.margin;
    }

    headerHeight() {
        return 2 * this.margin + this.title.size;
    }

    controlsHeight() {
        return this.controls.reduce(function (a, b) {
            return a + b.height;
        }, 0);
    }

    outputsHeight() {
        return this.outputs.reduce(function(a, b) {
            return a + b.socket.height();
        }, 0);
    }

    inputsHeight() {
        return this.inputs.reduce(function(a, b) {
            return a + b.socket.height();
        }, 0);
    }

    addControl(control) {
        if (!(control instanceof Control)) throw new Error('Invalid instance');
        this.controls.push(control);
        control.parent = this;
        this.update();
        return this;
    }

    addInput(input) {
        if (!(input instanceof Input))
            throw new Error('Invalid instance');
        if (input.node !== null)
            throw new Error('Input has already been added to the node');
        input.node = this;
        this.inputs.push(input);

        this.update();
        return this;
    }

    addOutput(output) {
        if (!(output instanceof Output))
            throw new Error('Invalid instance');
        if (output.node !== null)
            throw new Error('Output has already been added to the node');
        
        output.node = this;
        this.outputs.push(output);

        this.update();
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
            'title': this.title,
            'margin': this.margin,
            'width': this.width,
            'height': this.height
        }
    }

    static fromJSON(json, sockets) {
        var node = new Node();

        node.id = json.id;
        node.position = json.position;
        node.title = json.title;
        node.margin = json.margin;
        node.width = json.width;
        node.height = json.height;
        
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