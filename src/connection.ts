import { Output } from "./output";
import { Input } from "./input";

export class Connection {

    data: any = {};

    constructor(public output: Output, public input: Input) {
        this.input.addConnection(this);
    }

    remove() {
        this.input.removeConnection(this);
        this.output.removeConnection(this);
    }
}