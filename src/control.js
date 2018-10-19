import { Node } from './node';

export class Control {

    constructor(key) {
        if (this.constructor === Control)
            throw new TypeError('Can not construct abstract class');
        if (!key)
            throw new Error('The key parameter is missing in super() of Control ');

        this.key = key;
        this.data = {};
        this.parent = null;
    }

    getNode() {
        if (this.parent === null)
            throw new Error("Control isn't added to Node/Input");   
        
        return this.parent instanceof Node ? this.parent : this.parent.node;
    }

    getData(key) {
        return this.getNode().data[key];
    }

    putData(key, data) {
        this.getNode().data[key] = data;
    }  
}