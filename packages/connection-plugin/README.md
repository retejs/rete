# connection-plugin

Plugin to render the connections between nodes  

### Installation

```js
import { ConnectionPlugin } from '@naetverkjs/connections';

editor.use(ConnectionPlugin);
```

### Styling
To display the connections, add the following scss to your component. You can also overwrite this if you want. 

```scss
.connection {
  overflow: visible !important;
  position: absolute;
  z-index: -1;
  pointer-events: none;
  > * {
    pointer-events: all;
  }

  .main-path {
    fill: none;
    stroke-width: 5px;
    stroke: steelblue;
  }
}
```

### Events
The connections plugin adds events to the editor to render the connecting lines between the node sockets. 
```js
editor.on('connectionpath', (data) => {
  const {
    points, // array of numbers, e.g. [x1, y1, x2, y2]
    connection, // Naetverk.Connection instance
    d, // string, d attribute of <path>
  } = data;

  data.d = `M ${x1} ${y1} ${x2} ${y2}`; // Override of the the path curve
});
```

```js
editor.on('connectiondrop', (io) /* Input or Output */ => {
  // triggered when the user drops picked connection
});
```

```js
editor.on('connectionpick', (io) /* Input or Output */ => {
  // triggered when the user tries to pick a connection
  // you can prevent it
  return false;
});

editor.trigger('resetconnection'); // reset pseudo connection
```
