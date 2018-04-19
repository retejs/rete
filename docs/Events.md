Events
-

There may be cases when it is necessary not only to perform some action on the event, but also to decide whether to perform the operation (adding a node, creating a connection, etc.) caused by this event.

The editor can trigger the following events:
1. nodecreate
1. groupcreate
1. connectioncreate
1. noderemove
1. groupremove
1. connectionremove
1. nodeselect
1. groupselect
1. change

Events are added via the `eventListener` property

```js
editor.eventListener.on('change', (_, persistent) => {
      // trigger after each of the first six events
     // `persistent` is false when data is importing into the editor (it is not necessary to perform any actions with the view)
});
```

The first 8 events are called before making changes to the editor (in contrast to the event "change"). They can be prevented with `return false` statement. For example. you can prevent the addition of a node that already exists:

```js
editor.eventListener.on('nodecreate', (node, persistent) => { 
   // trigger after each of the first six events

   /// check if there is already a node with that name
  var haveSomeNode = editor.nodes.some(item => item.name === node.name); 
  return !haveSomeNode; // prevent the addition of a new node
});
```

By default `return true` is not needed.

You can handle multiple events. It may be necessary to perform the processing not with every change in the editor, but only with those that can influence the processing result (for example, there is no sense in executing the processing if the user has only changed the position of the node)

```js
editor.eventListener.on('nodecreate connectioncreate noderemove connectionremove', (_,persistent) => { 
   setTimeout(async () => { //
      await engine.abort();
      await engine.process();
   });
});
```
Note that the listed events are triggered before the changes, so you need to perform processing after this (for example, using a setTimeout)