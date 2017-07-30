import {Utils} from './utils';

export class Engine {

    constructor(id, worker) {

        if (!Utils.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');  
        
        this.id = id;
        this.worker = worker;
    }

    process(data, startNode = null) {
        
        if (!Utils.isValidJSON(data)) throw new Error('Data are damaged'); 
        if (!Utils.isCompatibleIDs(data.id, this.id)) throw new Error('IDs not compatible');

        data = Object.assign({}, data);
        startNode = startNode || data.nodes[Object.keys(data.nodes)[0]];

        var backProcess = (node) => {
            if (node.outputData)
                return node.outputData;
            
            var inputData = node.inputs.map(input => {
                var connData = input.connections.map(c => {
                    return backProcess(data.nodes[c.node])[c.output];
                });

                return connData;
            });
            var outputData = node.outputs.map(() => null);
            
            var key = node.title.toLowerCase();

            node.outputData = this.worker[key](node, inputData, outputData);
            if (node.outputData.length !== node.outputs.length)
                throw new Error('Output data does not correspond to number of outputs');
            
            return node.outputData;
        }

        var forwardProcess = (node) => {

            node.outputs.forEach(output => {
                output.connections.forEach(c => {
                    backProcess(data.nodes[c.node]);
                    forwardProcess(data.nodes[c.node]);
                });
            });
        }

        backProcess(startNode);
        forwardProcess(startNode);
    }
}