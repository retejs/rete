# arrange-plugin

Plugin to draw the network on a configurable background with limited zoom and grid snapping

### Installation

**Import**

```js
import { AutoArrangePlugin } from '@naetverkjs/auto-arrange';

editor.use(AutoArrangePlugin);
```

**Use**
The `arrange` call will order the nodes.

```typescript
editor.trigger('arrange', {});
```

**Configuration**

```js
editor.use(ArrangePlugin, {
  margin: { x: 50, y: 50 }, // The Margin between the nodes
  depth: null, // The node depth
  vertical: false, // Vertical or horizontal arrangement
});
```
