import { ComponentWorker } from './component-worker';
import { Node } from './node';
import template from './templates/node.pug';

var defaultTemplate = template();

export class Component extends ComponentWorker {
    constructor(name, props) {
        super(name, props);
        this.template = props.template || defaultTemplate;
        this.builder = props.builder;
        this.created = props.created || function () { }
        this.destroyed = props.destroyed || function () { }
    }

    newNode() {
        return new Node(this.name);
    }
}