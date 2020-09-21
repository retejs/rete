# lifecycle-plugin

The lifecycle plugin registers additional events that can be used while working with a component

### Install

```js
import { LifecyclePlugin } from '@naetverkjs/lifecycle';

editor.use(LifecyclePlugin);
```

### New component methods

```typescript
created(node) {
}

destroyed(node) {
}

onconnect(io) {   // input or output
  return false; // prevent connect
}

ondisconnect(connection) {
  return false; // prevent disconnect
}

connected(connection) {
}

disconnected(connection) {
}
```

### Usage: 

```typescript
import { OnCreated, OnDestroyed, OnConnect, OnConnected, OnDisconnect, OnDisconnected } from 'rete-lifecycle-plugin';

class AddComponent extends Naetverk.Component implements OnCreated, ...
```
