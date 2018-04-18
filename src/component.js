import { ComponentWorker } from './component-worker';
import { Node } from './node';
import template from './templates/node.pug';

var defaultTemplate = template();

export class Component extends ComponentWorker {
    constructor(name, props) {
        super(name, props);
        this.template = props.template || defaultTemplate;
        this.builder = props.builder;
    }

    newNode() {
        return new Node(this.name);
    }
}