import { Node } from './node';

export class Control {

    data: any;
    parent: any;

    constructor(public key: string) {
        if (this.constructor === Control)
            throw new TypeError('Can not construct abstract class');
        if (!key)
            throw new Error('The key parameter is missing in super() of Control ');

        this.data = {};
        this.parent = null;
    }

    getNode(): Node {
        if (this.parent === null)
            throw new Error("Control isn't added to Node/Input");

        return this.parent instanceof Node ? this.parent : this.parent.node;
    }

    getData(key: string) {
        return this.getNode().data[key];
    }

    putData(key: string, data: any) {
        this.getNode().data[key] = data;
    }
}