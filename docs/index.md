Getting started
-

## Installing

You can take latest build in [Releases](https://github.com/Ni55aN/D3-Node-Editor/releases). Add it and dependencies to your application.

```html
<script src="https://cdn.jsdelivr.net/npm/alight@0.14.0/alight.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@4.10.2/build/d3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-node-editor@0.6.6/build/d3-node-editor.js"></script>
<link href="https://cdn.jsdelivr.net/npm/d3-node-editor@0.6.6/build/d3-node-editor.css" rel="stylesheet"></link>
```
Using the build system, you can install a library from npm
```bash
npm install d3-node-editor
```
Import as follows
```js
import * as D3NE from "d3-node-editor";
```

## Getting started

![Editor components](https://i.imgur.com/QwPTKUI.png)

Create needed [Sockets](https://github.com/Ni55aN/D3-Node-Editor/wiki/Sockets)
```js
var numSocket = new D3NE.Socket('number', 'Number value', 'hint');
```
Define them styles
```css
.socket.number{
    background: #96b38a
}
```

Create some [components](https://github.com/Ni55aN/D3-Node-Editor/wiki/Components)
```js
var numComp = new D3NE.Component('Number',{
    builder(node) {
        var out = new D3NE.Output('Number',numSocket); 
        var numControl = new D3NE.Control('<input type="number">',(element, control)=>{
            control.putData('num', 1);
         });

        return node
                  .addControl(numControl)
                  .addOutput(out);
    },
    worker(node, inputs, outputs){
        outputs[0] = node.data.num;
  }
});

var addComp = new D3NE.Component('Add',{
    template: '<div .... ',
    builder(node){
      //...
      return node;
    },
    async worker(node, inputs, outputs){
       await asyncTask();
   }
});

var components = [numComp,addComp];
```
Initialize [context menu](https://github.com/Ni55aN/D3-Node-Editor/wiki/Context-menu) and [node editor](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor)
```html
<div id="d3ne" class="node-editor"></div>
```
```js

var menu = new D3NE.ContextMenu({
                'Actions':{
                    'Action': function(){alert('Subitem selected');}
                },
                'Nodes':{
                    'Number': numComp, 
                    'Add': addComp
                }
           });
var container = document.querySelector('#d3ne');
var editor = new D3NE.NodeEditor('demo@0.1.0', container, components, menu);
```
Use the [Engine](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine) to start processing the data (also [avaliable](https://github.com/Ni55aN/D3-Node-Engine) cross-platform Engine)
```js
var engine = new D3NE.Engine('demo@0.1.0', components);

editor.eventListener.on('change', async () => {
    await engine.abort();            
    var status = await engine.process(editor.toJSON());            
});
```
Full code and example you can take on the [Codepen](https://codepen.io/Ni55aN/pen/jBEKBQ)

## Architecture

![](https://i.imgur.com/MKPpJU9.png)

&nbsp;

![](https://i.imgur.com/P8E61o6.png)

## Dependencies
- [Angular light](https://github.com/lega911/angular-light)
- [D3.js](https://github.com/d3/d3)