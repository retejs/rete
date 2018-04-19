Context menu
-

![context menu](https://i.imgur.com/pxVyXk7.png)

Using the context menu, you can add and delete groups / nodes, and also call your functions. With the LMB you can open the menu with the list of nodes and actions you defined. Right-clicking on a group or node you can open the corresponding menu.

There is a search bar in the menu, which can also be hidden. Using it, you can filter items and sub-items

```js

var items = {
    'Values':{
        'Number': numberComponent, 
        'Action': function(){alert('Subitem selected');}
    },
    'Add': addComponent, 
};

var menu = new D3NE.ContextMenu(items, searchBarIsVisible);
var nodeEditor = new D3NE.NodeEditor('demo@0.1.0', container, components, menu);
```
If you do not want to have a context menu in your editor, you can simply not create it and do not pass it to Editor instance
```js
var nodeEditor = new D3NE.NodeEditor('demo@0.1.0', container, components);
```
Or you can temporarily disable it
```js
menu.disabled = true;
```
The object with functions/components is passed to the ContextMenu, where key is a name of item and must have object with subitems, function or component. Functions can perform any of your actions. Clicking on the item/subitem with the Component will create [Node instance](https://github.com/Ni55aN/D3-Node-Editor/wiki/Nodes), which will be placed next to the cursor.

