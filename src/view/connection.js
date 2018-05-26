import { Emitter } from '../core/emitter';
import { Node as ViewNode } from './node';

export class Connection extends Emitter {

    constructor(connection, inputNode: ViewNode, outputNode: ViewNode, emitter) {
        super(emitter);
        this.connection = connection;
        this.inputNode = inputNode;
        this.outputNode = outputNode;

        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.style.zIndex = '-1';

        this.update();
    }

    update() {
        const [x1, y1] = this.outputNode.getSocketPosition(this.connection.output);
        const [x2, y2] = this.inputNode.getSocketPosition(this.connection.input);

        this.trigger('renderconnection', { el: this.el, connection: this.connection, x1, y1, x2, y2 });
    }
}