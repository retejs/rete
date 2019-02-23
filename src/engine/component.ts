import { Engine } from './index';
import { Node } from '../core/data';

export type IOs = { [key: string]: any };

export abstract class Component {

    name: string;
    data = {};
    engine: Engine | null = null;

    constructor(name: string) {
        this.name = name;
    }

    abstract worker(node: Node, inputs: IOs, outputs: IOs, ...args: any): any;
}