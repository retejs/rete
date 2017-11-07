import { Component } from '../component';
import { Utils } from '../utils';

var State = { AVALIABLE:0, PROCESSED: 1, ABORT: 2};

export class Engine {

    constructor(id: string, components: Component[]) {

        if (!Utils.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');  
        
        this.id = id;
        this.components = components;
        this.args = [];
        this.data = null;
        this.state = State.AVALIABLE;
        this.onAbort = () => { };
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
            this.onAbort = () => { }
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

    async lock(node) {
        return new Promise(res => {
            node.unlockPool = node.unlockPool || [];
            if (node.busy && !node.outputData)
                node.unlockPool.push(res);
            else 
                res();
            
            node.busy = true;
        });    
    }

    unlock(node) {
        node.unlockPool.forEach(a => a());
        node.unlockPool = [];
        node.busy = false;
    }

    async extractInputData(node) {
        return await Promise.all(node.inputs.map(async (input) => {
            var conns = input.connections;
            let connData = await Promise.all(conns.map(async (c) => {

                let outputs = await this.processNode(this.data.nodes[c.node]);

                if (!outputs) 
                    this.abort();
                else
                    return outputs[c.output];
            }));

            return connData;
        }));
    }

    async processNode(node) {
        if (this.state === State.ABORT || !node)
            return null;
        
        await this.lock(node);

        if (!node.outputData) {
            let inputData = await this.extractInputData(node);

            node.outputData = node.outputs.map(() => null);
        
            var key = node.title;
            var component = this.components.find(c => c.name === key);

            try {
                await component.worker(node, inputData, node.outputData, ...this.args);
            } catch (e) {
                this.abort();
                console.error(e);
            }
            if (node.outputData.length !== node.outputs.length)
                throw new Error('Output data does not correspond to number of outputs');
            
        }

        this.unlock(node);
        return node.outputData;
    }

    async forwardProcess(node) {
        
        if (this.state === State.ABORT)
            return null;

        return await Promise.all(node.outputs.map(async (output) => {
            return await Promise.all(output.connections.map(async (c) => {
                await this.processNode(this.data.nodes[c.node]);
                await this.forwardProcess(this.data.nodes[c.node]);
            }));
        }));
    }

    copy(data) {
        data = Object.assign({}, data);
        data.nodes = Object.assign({}, data.nodes);
        
        Object.keys(data.nodes).forEach(key => {
            data.nodes[key] = Object.assign({}, data.nodes[key])
        });
        return data;
    }

    async process(data: Object, startId = null, ...args) {
        var checking = Utils.validate(this.id, data);

        if (!checking.success)
            throw new Error(checking.msg);  
        
        this.data = this.copy(data);
        this.args = args;
        
        if (startId) {
            let startNode = this.data.nodes[startId];

            await this.processNode(startNode);
            await this.forwardProcess(startNode);
        }
        
        for (var i in this.data.nodes) // process nodes that have not been reached
            if (typeof this.data.nodes[i].outputData === 'undefined') {
                var node = this.data.nodes[i];

                await this.processNode(node);
                await this.forwardProcess(node);
            }
        
        return this.processDone()?'success':'aborted';
    }
}