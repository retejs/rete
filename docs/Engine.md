Engine
-

This component allows you to process [Flow-based](https://en.wikipedia.org/wiki/Flow-based_programming) data in nodes and transfer them from an output to input. The engine is independent of other components of the editor. All it needs is an [identifier](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor#identifier), [workers](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine/#node-workers) from components and [JSON data](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor#exportimport-data).

```js
var engine = new D3NE.Engine('demo@0.1.0', components);

engine.process(data); 
```

It can work independently and without knowing anything about NodeEditor.

## Node workers

Workers is a functions with some key. They receive the parameters `node`, `inputs`, `outputs`, with which you decide what to do with the data in accordance with the key node identifier. Node data, inputs and outputs are corresponds to definitions in the [builders](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor#node-builders)

```js
var components = [
    new D3NE.Component('Number',{
        worker(node, inputs, outputs){
           outputs[0] = node.data.num;
        }
    }),
    new D3NE.Component('Add',{
        async worker(node, inputs, outputs){
            outputs[0] = inputs[0][0] + inputs[1][0];
            await asyncTask();
        }
    })
];
```

As you noticed, you can use asynchronous functions (or promises for previous versions of ES). This is necessary in order to perform complex calculations without blocking the main thread (for example, in WebWorker).

## Processing

Consider the situation when during the work in the editor you need to immediately receive the results of the changes (this is easy to do with [`change` event](https://github.com/Ni55aN/D3-Node-Editor/wiki/Events))

```js
editor.eventListener.on('change', () => {
    engine.process(editor.toJSON()); // imagine that it could take one second of time
});
```
The user will be annoyed that the editor will hang. In fact, the process method is also asynchronous, so you can call it many times without waiting for the previous one to complete. To avoid this, use the abort method, which waits until the previous processing is canceled.

```js
editor.eventListener.on('change', async () => {
    await engine.abort();
    await engine.process(editor.toJSON());   
});
```
Now this gives a guarantee that at one time only one processing will be performed, and the previous one will be canceled when the data is changed


Usually there is some main node from which the processing should start or all data go to it, then you can specify it:

```js
engine.process(data,node.id); 
```

If in any situation you need the data that you specify when processing

```js
engine.process(data,null, arg1, arg2); 
```

To each worker executed by this process will transfared this arguments

```js
worker(node, inputs, outputs, arg1, arg2){
     outputs[0] = node.data.num;
}
```

If an error occurs during processing (detected recursion, wrong startId, invalid data), you can get its message and data (if any)
```js
engine.onError = (msg, obj) => {

};

engine.process(data);// will return 'error' in case of error
```

## Extras

For more complex visual programming stuctures you can use:
- [tasks](https://github.com/Ni55aN/d3-node-editor/wiki/Tasks/#tasks)
- [modules](https://github.com/Ni55aN/d3-node-editor/wiki/Tasks/#modules)
- [difference](https://github.com/Ni55aN/d3-node-editor/wiki/Tasks/#difference)

## Cross-platform
[D3-Node-Engine for C++](https://github.com/Ni55aN/D3-Node-Engine)

