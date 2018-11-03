import { KeyValue } from "../interfaces/generic";

export class Component {
    data: any;
    engine: any;
    constructor(public name: string) {
        if (this.constructor === Component)
            throw new TypeError('Can not construct abstract class.');
        
        // this.name = name;
        this.data = {};
        this.engine = null;
    }

    worker(node: any, inputData: KeyValue<any>, outputData: {}, args?: any[]) { }
}