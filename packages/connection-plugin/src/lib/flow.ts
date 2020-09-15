import { IO, Input, Output } from 'rete';
import { Picker } from './picker';

export type FlowParams = { input?: Input, output?: Output };

export class Flow {

    private picker: Picker;
    private target?: IO | null;

    constructor(picker: Picker) {
        this.picker = picker;
        this.target = null;
    }

    private act({ input, output }: FlowParams) {
        if (this.unlock(input || output)) return

        if (input)
            this.picker.pickInput(input)
        else if (output)
            this.picker.pickOutput(output)
        else
            this.picker.reset();
    }

    public start(params: FlowParams, io?: IO) {
        this.act(params);
        this.target = io;
    }

    public complete(params: FlowParams = {}) {
        this.act(params);
    }

    public hasTarget() {
        return Boolean(this.target);
    }

    private unlock(io?: IO) {
        const target = this.target;

        this.target = null;

        return target && target === io;
    }
}