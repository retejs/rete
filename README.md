D3 Node Editor [![Build Status](https://travis-ci.org/Ni55aN/D3-Node-Editor.svg?branch=master)](https://travis-ci.org/Ni55aN/D3-Node-Editor)
====
#### JavaScript library 
![node editor](https://drive.google.com/uc?export=download&id=0BzysCNw7yv8MeXdkSV9oeHZLQkk)

### Usage
[Download](https://github.com/Ni55aN/D3-Node-Editor/releases/latest) the library, templates and styles. Include it in your html.
```html
<script src="js/node-editor.min.js"></script>
<link  href="css/node-editor.css" rel="stylesheet" type="text/css"></link>
```

Create needed sockets
```js
var numSocket = new D3NE.Socket('number', 'Number value', 'hint');
```
Define them styles
```css
.socket.number{
    background: #96b38a
}
```
Create some node builders
```js
var builder = {
    number: function() {
    
        var out = new D3NE.Output('Number',numSocket); 
        var numControl = new D3NE.Control('<input type="number">',(element, control)=>{
            control.putData('num', 1);
         });

        return new D3NE.Node('Number')
                    .addControl(numControl)
                    .addOutput(out);
    },
    add: function(){
        return ...
    }
};
```
And create NodeEditor
```js

var menu = new D3NE.ContextMenu('./menu.html',
                {
                    'Actions':{
                    'Action': function(){alert('Subitem selected');}
                    },
                    'Nodes':{
                        'Number': builder.number, 
                        'Add': builder.add
                    }
                });

 var nodeEditor = new D3NE.NodeEditor('demo@0.1.0', container, './view.html', builder, menu);
```
Use the Engine to start processing the data (also [avaliable](https://github.com/Ni55aN/D3-Node-Engine) cross-platform Engine)
```js
 var engine = new D3NE.Engine('demo@0.1.0', {
    number: function(node, inputs, outputs){
        outputs[0] = node.data.num;
        return outputs;
    },
    add:function(node, inputs, outputs){
        ...
        return outputs;
    }
});
    
nodeEditor.onload = function(){
    engine.process(nodeEditor.toJSON());            
};
```

For detail see [demo](https://codepen.io/Ni55aN/pen/jBEKBQ)

### Assets

It allows you to change the appearance of the editor.
<br>

Build for yourself:
```bash
npm run build-assets --target=myAssets
```
where *myAssets* — folder inside [/assets](https://github.com/Ni55aN/D3-Node-Editor/tree/master/assets). It must contain `menu.pug`, `view.pug`, `style.sass`

License
----
MIT