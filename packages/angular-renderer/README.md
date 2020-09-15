# angular-renderer

### Install

```ts
import { AngularRenderPlugin } from '@naetverkjs/angular-renderer';

editor.use(AngularRenderPlugin);
```

Import NaetverkModule

```ts
import { NaetverkModule } from '@naetverkjs/angular-renderer';

@NgModule({
  imports: [NaetverkModule],
})
export class AppModule {}
```

## Examples

- [Codesandbox](https://codesandbox.io/s/retejs-angular-render-v29f9)

## Control

```ts
import { AngularControl } from '@naetverkjs/angular-renderer';

export class NumControl extends Control implements AngularControl {
  component: Type<ControlComponent>
  props: {[key: string]: unknown}

  constructor(key) {
    super(key);

    this.component = ControlComponent;
    this.props = // key-value
// ...
  }
}
```

## Custom node

Extend node component

```ts
import { NodeComponent, NodeService } from '@naetverkjs/angular-renderer';

@Component({
  templateUrl: './node.component.html', // copy template from src/node
  styleUrls: ['./node.component.sass'], // copy styles from src/node
  providers: [NodeService],
})
export class MyNodeComponent extends NodeComponent {
  constructor(protected service: NodeService) {
    super(service);
  }
}
```

Add component to `entryComponents` of your module

```ts
@NgModule({
  entryComponents: [MyNodeComponent],
})
export class AppModule {}
```

Custom component for all nodes

```ts
editor.use(AngularRenderPlugin, { component: MyNodeComponent });
```

Custom component for specific node

```ts
import { Component } from '@naetverkjs/naetverk';
import { AngularComponent, AngularComponentData } from '@naetverkjs/angular-renderer';

export class AddComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('Add');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }
// ...
}
```
