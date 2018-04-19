Components
-

The components are designed to increase the ease of development by combining a closely related template and methods.

The Component contains a template, [builder](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor#node-builders) and [worker](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine#node-workers). 

The builder and the worker are executed independently of each other (the first one works once when creating the node, the second one at each [processing](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine#processing)), but in fact they are closely related with each other. Therefore, it makes more sense to consider separately the nodes and together the creation, presentation and processing of the node (before version `0.5.0`, the builders and the workers were separated).

```js
var myComponent = new D3NE.Component('My component', {
    template: nodeTemplate,
    builder(node){
        /// modify node
        return node;
    },
    worker(node, inputs, outputs){
        
    }
);
```
By default, you do not need to specify a template, then [the following](https://github.com/Ni55aN/D3-Node-Editor/blob/master/src/templates/node.pug) will be used. You can use your template to create a node of the kind you need (for example, it may not contain a title or have elements that are located differently inside).


Templates are rendered using [Angular light](https://github.com/lega911/angular-light), so you can freely modify them and use all available directives and other options

The components can be put on separate files, then they will be convenient to edit using the modular architecture and collect it all by the module builders.

```js
/// nodes/number.js
export default new D3NE.Component('Number',{
   builder(node){
       return node;
   },
   worker(){

  }
});

```

```js
/// index.js
import numberComponent from './nodes/number';

var components = [numberComponent];
```

To find the required components and use them in the context menu, you can use some wrapper over an array of your components

```js
var components = {
    list : [...],
    get(name) {
        var comp = this
            .list
            .find(item => item.name === name);

        if (!comp) 
            throw new Error(`Component '${name}' not found`);
        return comp;
    }
```