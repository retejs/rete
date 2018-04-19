Editor
-

![components](https://camo.githubusercontent.com/8491f689a4a14e3c4bc3956ec9b41f22afac6780/68747470733a2f2f692e696d6775722e636f6d2f517750544b55492e706e67)

NodeEditor presents an area with nodes and connections beetween their sockets:
- Available interaction with the working area (moving, zoom) and managing nodes/groups (move, add, delete)
- Each node can have inputs and outputs through which connections to other nodes are created
- Nodes can be placed in [groups](https://github.com/Ni55aN/D3-Node-Editor/wiki/Groups)
- Handle editor [events](https://github.com/Ni55aN/D3-Node-Editor/wiki/Events)
- Multiple node selection can be performed (with a pressed `Ctrl` key for selecting and `Shift` for moving)
- The ability to undo / redo the performed actions (`Ctrl+Z` for undo, `Ctrl+Shif+Z` for redo)
- All editor data can be [exported and imported](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor#exportimport-data) from JSON format

Create the instance of NodeEditor:
```js
var nodeEditor = new D3NE.NodeEditor('demo@0.1.0', container, components, menu);
```
The `demo@0.1.0` parameter is the [identifier](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor#identifier) of your app/editor

The `container` is a simple HTMLelement (div, usually)

The `components` is an array of [Components](https://github.com/Ni55aN/D3-Node-Editor/wiki/Components) that contain [builder](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor#node-builders) and [worker](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine#node-workers) for each type of [Node](https://github.com/Ni55aN/D3-Node-Editor/wiki/Nodes)

The `menu` is a [ContextMenu instance](https://github.com/Ni55aN/D3-Node-Editor/wiki/Context-menu)

## Identifier

Identifier consists of the app name and version. The version is needed to control the import of data into your editor, since the data to previous versions can be incompatible with the current version of your editor (where the main role is played by the Node builders, see below). The same rule exists for the [Engine](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine), which allows to prevent incompatibility of data with implementations in [node workers](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine#node-workers)

## Node builders

These functions must return an [Node instance](https://github.com/Ni55aN/D3-Node-Editor/wiki/Nodes) and are necessary for the editor [to restore](https://github.com/Ni55aN/D3-Node-Editor/wiki/Editor#exportimport-data) all nodes from the JSON data, since the JSON data should store only static information and not the logic of the nodes. Each of the builders must be in the corresponding component:

```js
var components = [
    new D3NE.Component('Number',{
        builder(node){
            // modify node
            return node;
        }
    }),
    new D3NE.Component('Add',{
        builder(node){
            // ...
            return node
        }
    })
];
```

## Export/import data

To save the added nodes in the editor and all connections / groups to them simply call the `toJSON` method of the object *NodeEditor*
```js
var data = editor.toJSON()
```
Tht data have about the following structure:
```json
{  
   "id":"demo@0.1.0",
   "nodes":{  
      "1":{  
         "id":1,
         "data":{"num":1},
         "group":null,
         "inputs":[],
         "outputs":[  
            {"connections":[  
                  {"node":3, "input":0 }
            ]}
         ],
         "position":[ 80, 200 ],
         "title":"Number"
      }
   },
   "groups":{ }
}
```

With the same success you can restore the contents of the editor using this data (provided that the versions of your data and the editor are the same)

```js
await editor.fromJSON(data);
```

In the case of different identifiers in `data` and the `editor`, the method `fromJSON` throws an exception. You must catch it and notify the user or try to fit the data to a new version of your editor

## View

The [EditorView](https://github.com/Ni55aN/D3-Node-Editor/blob/master/src/editorview.js) class is responsible for displaying the editor view. You can call the following methods to change the editor properties:
```js
editor.view.zoomAt(nodes); // adjust the view to display all listed nodes on the screen
editor.view.setScaleExtent(0.1,1); // change the minimum and maximum scale values
editor.view.setTranslateExtent(-1000,-1000, 1000, 1000); /// change left, top, right and bottom borders. In this case, the work area will be equal to 2000x2000 px
editor.view.connectionProducer = (x1,y1,x2,y2) => { // define a method for generating connection points and curve type, where parameters determine the position of output and input
    return {
        points:[[x1,y1],[x2,y2]],
        curve: 'step' // linear, basis or step
    };
};
