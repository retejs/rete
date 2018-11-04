import { KeyValue } from "../interfaces/generic";
import { Engine } from "./index";

export class ComponentEngine {

    data: any = {};
    engine: Engine;

    constructor(public name: string) {
        if (this.constructor === ComponentEngine)
            throw new TypeError('Can not construct abstract class.');
    }

    worker(node: any, inputData: KeyValue<any>, outputData: {}, args?: any[]) { }
}