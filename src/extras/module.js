export class Module {
    
    constructor(data, titlesInput, titlesOutput) {
        var inputs = Module.extractNodes(data, titlesInput);
        var outputs = Module.extractNodes(data, titlesOutput);
    
        this.inputs = [];
        this.outputs = [];
        this.keys = {
            input: inputs.map(n => n.data.name),
            output: outputs.map(n => n.data.name)
        };
    }
    
    static extractNodes(data, titles) {
        return Object.keys(data.nodes)
                .filter(k => titles.includes(data.nodes[k].title))
                .map(k => data.nodes[k])
                .sort((n1, n2) => n1.position[1] > n2.position[1]);
    }
    
    read(inputs) {
        this.keys.input.forEach((key, i) => {
            this.inputs[key] = inputs[i];
        });
    }
    
    write(outputs) {
        this.keys.output.forEach((k, i) => {
            outputs[i] = this.outputs[k];
        });
    }
}
    
export class ModuleManager {
    constructor(titlesInput, titlesOutput) {
        this.engine = null;
        this.titlesInput = titlesInput;
        this.titlesOutput = titlesOutput;
    }
    
    getInputs(data) {
        return Module.extractNodes(data, this.titlesInput)
                .map(n => ({ title: n.title, name: n.data.name }));
    }
    
    getOutputs(data) {
        return Module
                .extractNodes(data, this.titlesOutput)
                .map(n => {
                    return {title: n.title, name: n.data.name};
                });
    }
    
    async workerModule(node, inputs, outputs) {
        var data = node.data.module.data;
        var m = new Module(data, this.titlesInput, this.titlesOutput);
        var engine = this.engine.clone();
            
        m.read(inputs);
        await engine.process(data, null, m);
        m.write(outputs);
    }
    
    workerInputs(node, inputs, outputs, module) {
        if (module) 
            outputs[0] = module.inputs[node.data.name][0];
    }
        
    workerOutputs(node, inputs, outputs, module) {
        if (module) 
            module.outputs[node.data.name] = inputs[0][0];
    }
        
    setEngine(engine) {
        this.engine = engine;
    }
}