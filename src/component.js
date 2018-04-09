import { Node } from './node';
import template from './templates/node.pug';

var defaultTemplate = template();

export class Component {
    constructor(name, props) {
        this.name = name;
        this.template = props.template || defaultTemplate;
        this.builder = props.builder;
        this.worker = props.worker;
        this.created = props.created || function () { }
        this.destroyed = props.destroyed || function () { }
    }

    newNode() {
        return new Node(this.name);
    }
}