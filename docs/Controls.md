Controls
-

Controls are necessary in order to allow you to expand the functionality of the nodes. You can insert any html template and a third-party object (input, select, image, jQuery plugin etc).

```js
var template = '<input type="number">';
var ctrl = new D3NE.Control(template, (element, control) => { // called when an element is created in the DOM
    element.value = 1;
    element.addEventListener('change',()=>{
       control.putData('num', element.value); // put data in the node under the key "num"
    });
});
```

As you can see, the controls can not only display some information, but also change it and store it in the node for further processing. For example, [as do](https://github.com/Ni55aN/D3-Node-Editor/wiki/Nodes) the controls added to the input:

```js
var in1 = new D3NE.Input('Number',numSocket); 
var numControl = new D3NE.Control('<input type="number" value="10">',(element, control)=>{
   control.putData('inputNumber', element.value);
    element.addEventListener('change',()=>{
       control.putData('inputNumber', element.value);
    });
});
```
In this case, the control puts a number in the node data. It can be used when there is no connection on the input.

