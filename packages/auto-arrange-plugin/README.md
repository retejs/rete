# auto-arrange-plugin

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
editor.arrange(node);
```
