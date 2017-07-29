D3 Node Editor [![Build Status](https://travis-ci.org/Ni55aN/D3-Node-editor.svg?branch=master)](https://travis-ci.org/Ni55aN/D3-Node-editor)
====
#### JavaScript library 
![node editor](https://drive.google.com/uc?export=download&id=0BzysCNw7yv8MeXdkSV9oeHZLQkk)

### Dependencies
  - [D3.js](https://github.com/d3/d3)
  - [Angular Light](https://github.com/lega911/angular-light)

### Usage
[Download](https://github.com/Ni55aN/D3-Node-editor/releases/latest) the library, templates and styles. Include it in your html.
```html
<script src="js/node-editor.min.js"></script>
<link  href="css/node-editor.css" rel="stylesheet" type="text/css"></link>
```

Create needed sockets
```js
var numSocket = new D3NE.Socket('number', 'Number value', 'hint');
var imageSocket = new D3NE.Socket('image', 'Image', 'hint');
```
Define them styles
```css
.socket.number{
    background: #96b38a
}
.socket.image{
    background: #cc2a6a
}
```
Create some node builders
```js
var builder = {
    "texture": function(){
            var out = new D3NE.Output("Texture",imageSocket);
            return new D3NE.Node("Texture")
                        .addOutput(out);
            },
    "shape": function(){
            var input = new D3NE.Input("Texture",imageSocket);
            var out = new D3NE.Output("Value",numSocket);
            return new D3NE.Node("Shape")
            	    	.addInput(input)
                        .addOutput(out);			
            }
};
```
And create NodeEditor
```js

var menu = new D3NE.ContextMenu('./menu.html',
                        {
                            "Actions":{
                                "Action":function(){alert('Subitem selected');}
                            },
                            "Nodes":{
                                "Shape":builder.shape, 
                                "Texture":builder.texture
                            }
                        });

 var nodeEditor = new D3NE.NodeEditor('demo@0.1.0', container, './view.html', builder, menu, new D3NE.Events());
```
For detail see [demo](https://codepen.io/Ni55aN/pen/jBEKBQ)


License
----
MIT