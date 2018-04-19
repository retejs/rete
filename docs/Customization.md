Customization
-

### Node templates

With the help of templates you can change the location or behaviour of the necessary elements inside the node (title / inputs / outputs / controls) or add your own. Templates are rendered using [Angular Light](http://angularlight.org/), so you can use all available directives or even define your own.

By default, each node has [a standart template](https://github.com/Ni55aN/D3-Node-Editor/blob/master/src/templates/node.pug). To define your template, you must specify it in the Component:
```js
var componentNum = new D3NE.Component("number", {
   template: template,
    ...
});
```
Then certain nodes created in this component will use your template. You can specify either a single template for each of the components, as well as an individual for a particular type of nodes.

In the scope of the template, an instance of the [Node](https://github.com/Ni55aN/D3-Node-Editor/blob/master/src/node.js) class is available. For example, next expression print the node's title
```html
{{node.title}}
```
Using `al-repeat` directive, it is necessary to display all inputs, outputs and controls. They also have some properties that you can use to add behavior. As in [that example](https://codepen.io/Ni55aN/pen/xPKegM), the number of connections to the socket is checked and a class `used` is assigned if there is at least one connection

```html
<div al-repeat="output in node.outputs" style="text-align: right">
     <div class="output-title">{{output.title}}</div>
     <div class="socket output {{output.socket.id}} {{output.connections.length>0?'used':''}}" 
                al-pick-output="al-pick-output"
                title="{{output.socket.name}} {{output.socket.hint}}">
    </div>
</div>
```
### Connections

Most often in the nodes editors there are connections built using basis curve and four points (one in the output socket, two in the middle, and one in the input socket). They form a curve as in the screenshot below.

![basis connections](https://image.ibb.co/kt1k5m/2017_10_28_12_43_35.png)

But if you need to specify a different kind of connection, you can override [`connectionProducer`](https://github.com/Ni55aN/D3-Node-Editor/blob/d2a7fcb873255871fa336cfd28df515364759a08/src/editorview.js#L98) method by returning points and curve type
```js
editor.view.connectionProducer = (x1,y1,x2,y2) => {
    return {
        points:[[x1,y1],[x2,y2]],
        curve: 'step' // linear, step or basis(default)
    };
};
```
![step connections](https://image.ibb.co/cQZV5m/2017_10_28_12_37_46.png)
### Styling

This is displayed in standard styles

[![default](https://user-images.githubusercontent.com/8259641/31309345-974fc73e-ab8d-11e7-829e-45140a238801.png)](https://user-images.githubusercontent.com/8259641/31309345-974fc73e-ab8d-11e7-829e-45140a238801.png) 

If you prefer a different appearance, then you can override class properties or completely replace the file with the styles on your own.The following screenshot shows the appearance of the nodes to the [UE4 Style example](https://codepen.io/Ni55aN/pen/xPKegM)

 [![ue4](https://user-images.githubusercontent.com/8259641/29428653-a20caf4e-8396-11e7-8c2b-4f247a2d7738.png)](https://user-images.githubusercontent.com/8259641/29428653-a20caf4e-8396-11e7-8c2b-4f247a2d7738.png)

As you can see, the styles have been changed not only for nodes, but for connections and background.

```css
.socket.id-of-socket{
    background: #96b38a
}

.node.title-of-node{
    background: #96b38a
}

.connection.input-id-of-socket{
   stroke: red !important
}

.connection.output-id-of-socket{
   stroke: red !important
}
```
where `id-of-socket` is cebab case of socket id
```js
new D3NE.Socket("ID of socket",...
```
and `title-of-node`:
```js
new D3NE.Component("Title of node", ...
```

There is another way through which you can assign styles to a specific node/connection/group. Each of them has a property style in which you can change the [Style Object Properties](https://www.w3schools.com/jsref/dom_obj_style.asp).
```js
node.style.boxShadow = "2px 2px 20px red";
group.style.BackgroundColor = "black";
connection.style.stroke = 8; // only properties for <path> 

editor.view.update();
```
