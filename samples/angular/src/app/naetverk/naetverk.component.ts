import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AngularRenderPlugin } from '@naetverkjs/angular-renderer';
import { AreaPlugin } from '@naetverkjs/area';
import { ConnectionPlugin } from '@naetverkjs/connections';
import { KeyboardPlugin } from '@naetverkjs/keyboard';
import { ArrangePlugin } from '@naetverkjs/arrange';

import { NodeEditor, Engine } from '@naetverkjs/naetverk';
import { NumComponent } from './components/number-component';
import { AddComponent } from './components/add-component';

@Component({
  selector: 'nvk-angular-sample',
  template: `<div class="menu-bar">
      <button id="arrange" (click)="arrange()">Arrange</button>
    </div>
    <div class="wrapper">
      <div #nodeEditor class="node-editor"></div>
    </div>`,
  styleUrls: ['./naetverk.component.scss'],
})
export class NaetverkComponent implements AfterViewInit {
  @ViewChild('nodeEditor', { static: true }) el: ElementRef;

  editor = null;

  async ngAfterViewInit() {
    const container = this.el.nativeElement;

    const components = [new NumComponent(), new AddComponent()];

    const editor = new NodeEditor('demo@0.2.0', container);
    editor.use(ConnectionPlugin);
    editor.use(KeyboardPlugin);
    editor.use(AngularRenderPlugin);
    editor.use(ArrangePlugin, {
      margin: { x: 50, y: 50 },
      depth: null,
      vertical: false,
    });

    editor.use(AreaPlugin, {
      background: 'designer-background',
      snap: { dynamic: true, size: 16 },
      scaleExtent: { min: 0.1, max: 1 },
      translateExtent: { width: 5000, height: 4000 },
    });

    const engine = new Engine('demo@0.2.0');

    components.map((c) => {
      editor.register(c);
      engine.register(c);
    });

    /**
     * Prevent Double click
     */
    editor.on('zoom', ({ source }) => {
      return source !== 'dblclick';
    });

    const n1 = await components[0].createNode({ num: 2 });
    const n2 = await components[0].createNode({ num: 3 });
    const add = await components[1].createNode();

    n1.position = [80, 200];
    n2.position = [80, 400];
    add.position = [500, 240];

    editor.addNode(n1);
    editor.addNode(n2);
    editor.addNode(add);

    editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
    editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

    editor.on(
      [
        'process',
        'nodecreated',
        'noderemoved',
        'connectioncreated',
        'connectionremoved',
      ],
      (async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      }) as any
    );

    editor.view.resize();
    editor.trigger('process');
    this.editor = editor;
  }

  arrange() {
    this.editor.trigger('arrange', {});
  }
}
