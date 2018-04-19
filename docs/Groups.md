Groups
-

![Group](https://i.imgur.com/10Sw9HD.png)

Grouping nodes helps to highlight a few nodes with a common sub-goal.

To **add groups**, there are two ways: select the desired node and press the **G** key or by using the [context menu](https://github.com/Ni55aN/D3-Node-Editor/wiki/Context-menu). This creates the group to which the selected node will be added. To **add other nodes**, you can move them over a group or **resize** the group by placing it under the desired nodes. Reverse actions allow you to **remove nodes from the group**. To **remove a group**, you can select a group (by clicking on it), and press **Del** or use the context menu. In this case, all nodes in it are not removed

Group has a title that you can change by clicking on it.

Creating groups programmatically:

```js
// creating empty group with same position and sizes
var group = new D3NE.Group("Name", {position: [0,0], width: 400, height:200});
editor.addGroup(group);

// сreate a group with nodes
var group = new D3NE.Group("Name", {nodes: arrayNodes});
// or add nodes latelly
group.coverNodes(arrayNodes); // position and sized of the group are calculated to cover the selected nodes
```
Also you can add (or remove) same node to group, but because of this there may be a mismatch with the belonging of the node to the group and the arrangement above it:
```js
if(group.isCoverNode(node)) // check if the node is above the group
group.addNode(node);
group.removeNode(node);
```