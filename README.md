D3 Node Editor
====
#### JavaScript library
![node editor](https://github.com/Ni55aN/D3-Node-editor/demo/screenshot.png)

### Dependencies
  - [D3.js](https://github.com/d3/d3)
  - [d3-extended](https://github.com/wbkd/d3-extended)

### Usage
Download the library and styles. Include it in your html.
```html
<script src="js/node-editor.min.js"></script>
<link  href="css/node-editor.css" rel="stylesheet" type="text/css"></link>
```
Create needed sockets
```js
var numSocket = new Socket('number', 'Number value', 'hint');
var imageSocket = new Socket('image', 'Image', 'hint');
```
Define them styles
```css
.socket.number{
    fill: #96b38a
}
.socket.image{
    fill: #cc2a6a
}
```
Create some NodeBuilder's
```js
var texturebuilder = new NodeBuilder("Texture",function(){
            var out = new Output("Texture",imageSocket);
            return new Node("Texture")
         					.addOutput(out);
         });
         
var shapebuilder = new NodeBuilder("Shape",function(){
            var input = new Input("Texture",imageSocket);
            var out = new Output("Value",numSocket);
            return new Node("Shape")
            	    	.addInput(input)
         		    	.addOutput(out);			
            });
```
And create NodeEditor
```js
 var nodeEditor = new NodeEditor('nodeEditor', 
             				[],
             				[shapebuilder,texturebuilder],
                            new Events());
```
For detail see [demo](https://github.com/Ni55aN/D3-Node-editor/demo)


License
----
MIT