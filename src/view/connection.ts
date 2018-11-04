import { Emitter } from '../core/emitter';
import { Node as ViewNode } from './node';
import { Connection as Connection2 } from "../connection";

export class Connection extends Emitter {

    public el: HTMLDivElement;

    constructor(public connection: Connection2, public inputNode: ViewNode, public outputNode: ViewNode, emitter: Emitter) {
        super(emitter);

        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.style.zIndex = '-1';

        this.trigger('renderconnection', {
            el: this.el,
            connection: this.connection,
            points: this.getPoints()
        });
    }

    getPoints() {
        const [x1, y1] = this.outputNode.getSocketPosition(this.connection.output);
        const [x2, y2] = this.inputNode.getSocketPosition(this.connection.input);

        return [x1, y1, x2, y2];
    }

    update() {
        console.log('Update connextion', {
            el: this.el,
            connection: this.connection,
            points: this.getPoints()
        })
        this.trigger('updateconnection', {
            el: this.el,
            connection: this.connection,
            points: this.getPoints()
        });
    }
}