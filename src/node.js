import {Control} from './control';
import {Input} from './input';
import {Output} from './output';

export class Node {
   
    constructor(title, width) {
        this.id = Node.incrementId();
        this.inputs = [];
        this.outputs = [];
        this.controls = [];
        
        this.position = [0, 0];
        this.title = {
            size: 0.01,
            text: title
        };
        this.margin = 0.005;
        this.width = width || 0.1;
        this.height = 0.05;
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
        if (!(input instanceof Input)) throw new Error('Invalid instance');
        if (input.node !== null) throw new Error('Input has already been added to the node');
        input.node = this;
        this.inputs.push(input);

        this.update();
        return this;
    }

    addOutput(output) {
        if (!(output instanceof Output)) throw new Error('Invalid instance');
        if (output.node !== null) throw new Error('Output has already been added to the node');
        output.node = this;
        this.outputs.push(output);

        this.update();
        return this;
    }

    remove() {
        this.inputs.forEach(function(input) {
            input.removeConnection();
        });
        this.outputs.forEach(function(output) {
            output.removeConnections();
        })
    }
}