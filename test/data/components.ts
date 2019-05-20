import { Component, Input, Node, Output, Socket } from '../../src';

const socketNum = new Socket('Number');

export class Comp1 extends Component {

    constructor() {
        super('Number');
    }

    async builder(node: Node) {
        node.addOutput(new Output('name', 'Name', socketNum))
    }

    worker() { }
}

export class Comp2 extends Component {

    constructor() {
        super('Add');
    }

    async builder(node: Node) {
        node.addInput(new Input('name', 'Name', socketNum));
    }

    worker() { }
}