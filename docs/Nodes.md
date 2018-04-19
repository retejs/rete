Nodes
-

![node](https://i.imgur.com/gUdLn8M.png)

All nodes can contain title, inputs, outputs and controls. 

**Title** must identify a node and point to the target of node.

**Inputs** and **outputs** should be located on the left and right of the node, respectively. They are represented by a [Socket](https://github.com/Ni55aN/D3-Node-Editor/wiki/Sockets) and can have titles. All outputs can have an unlimited number of connections. By default inputs can only have one connection. You can change this passing the third parameter as `true`:
```js
var multiInput = new D3NE.Input('Number',numSocket,true); 
```

**[Controls](https://github.com/Ni55aN/D3-Node-Editor/wiki/Controls)** can be located either directly at the node itself, or refers to a specific input. In fact, the location in the first case is defined in the [standart template](https://github.com/Ni55aN/D3-Node-Editor/wiki/Customization#node-templates). In the second case, the control is displayed when there is no connection at the input. This is necessary to ensure that the control is responsible for providing input data when they are not transferred from another node.

Let's create node:
```js 
var in1 = new D3NE.Input('Number',numSocket); 
var in2 = new D3NE.Input('Number',numSocket, true); //can have multiple connections
var out = new D3NE.Output('Number',numSocket); // the third parameter must be false to deny multiple connections

var numControl = new D3NE.Control('<input type="number">',(element, control)=>{
   control.setValue = (val) => {
      el.value = val;
   }
});

var numNode = new D3NE.Node('Add');
numNode.addInput(in1);
numNode.addInput(in2);
numNode.addControl(numControl)
numNode.addOutput(out);

```

That node has two inputs, one output and control, which has a method ```setValue``` for changing the value in ```<input>``` (this is necessary when updating data from outside, for example from [worker method](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine#Workers))

```js
worker: function(node, inputs, outputs) {
    var sum = inputs[0][0] + inputs[1][0];
    editor.nodes.find(n => n.id == node.id).controls[0].setValue(sum);
    outputs[0] = sum;
}
```