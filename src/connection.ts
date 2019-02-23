import { Output } from "./output";
import { Input } from "./input";

export class Connection {

    output: Output;
    input: Input;
    data: any = {};

    constructor(output: Output, input: Input) {
        this.output = output;
        this.input = input;
        this.data = {};

        this.input.addConnection(this);
    }

    remove() {
        this.input.removeConnection(this);
        this.output.removeConnection(this);
    }
}