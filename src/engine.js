import {Utils} from './utils';
var State = { AVALIABLE:0, PROCESSED: 1, ABORT: 2};

export class Engine {

    constructor(id, worker) {

        if (!Utils.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');  
        
        this.id = id;
        this.worker = worker;
        this.data = null;
        this.state = State.AVALIABLE;
        this.onAbort = function () { };
    }

    processStart() {
        if (this.state === State.AVALIABLE) {  
            this.state = State.PROCESSED;
            return true;
        }

        return false;
    }

    processDone() {
        var success = this.state !== State.ABORT;

        this.state = State.AVALIABLE;
        
        if (!success) {
            this.onAbort();
            this.onAbort = function () { }
        }    

        return success;
    }

    async abort() {
        return new Promise(ret => {
            if (this.state === State.PROCESSED) {
                this.state = State.ABORT;
                this.onAbort = ret;
            }
            else
                ret();
        });
    }

    async backProcess(node) {
        if (this.state === State.ABORT)
            return null;
        if (node.outputData)
            return node.outputData;
        
        var inputData = await Promise.all(node.inputs.map(async (input) => {
            var connData = await Promise.all(input.connections.map(async (c) => {
                return (await this.backProcess(this.data.nodes[c.node]))[c.output];
            }));

            return connData;
        }));
        
        node.outputData = node.outputs.map(() => null);
        
        var key = node.title.toLowerCase();

        await this.worker[key](node, inputData, node.outputData);
        if (node.outputData.length !== node.outputs.length)
            throw new Error('Output data does not correspond to number of outputs');
        
        return node.outputData;
    }

    async forwardProcess(node) {
        if (this.state === State.ABORT)
            return null;

        await Promise.all(node.outputs.map(async (output) => {
            return await Promise.all(output.connections.map(async (c) => {
                await this.backProcess(this.data.nodes[c.node]);
                await this.forwardProcess(this.data.nodes[c.node]);
            }));
        }));
    }

    async process(data, startNode = null) {
        if (!this.processStart()) return 'not started';

        if (!Utils.isValidJSON(data))
            throw new Error('Data are damaged'); 
        if (!Utils.isCompatibleIDs(data.id, this.id))
            throw new Error('IDs not compatible');

        data = this.data = Object.assign({}, data);
        startNode = startNode || this.data.nodes[Object.keys(data.nodes)[0]];
        
        await this.backProcess(startNode);
        await this.forwardProcess(startNode);
        
        return this.processDone()?'success':'aborted';
    }
}