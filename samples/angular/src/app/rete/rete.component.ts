import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AngularRenderPlugin } from '@naetverkjs/angular-renderer';
import { ConnectionPlugin } from '@naetverkjs/connections';

import { NodeEditor, Engine } from '@naetverkjs/naetverk';
import { NumComponent } from './components/number-component';
import { AddComponent } from './components/add-component';

@Component({
  selector: 'app-rete',
  template: ` <div class="wrapper">
    <div #nodeEditor class="node-editor"></div>
  </div>`,
  styleUrls: ['./rete.component.scss'],
})
export class ReteComponent implements AfterViewInit {
  @ViewChild('nodeEditor', { static: true }) el: ElementRef;

  editor = null;

  async ngAfterViewInit() {
    const container = this.el.nativeElement;

    const components = [new NumComponent(), new AddComponent()];

    const editor = new NodeEditor('demo@0.2.0', container);
    editor.use(ConnectionPlugin);
    editor.use(AngularRenderPlugin); //, { component: MyNodeComponent });
    // editor.use(ContextMenuPlugin);

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
    const n2 = await components[0].createNode({ num: 0 });
    const add = await components[1].createNode();

    n1.position = [80, 200];
    n2.position = [80, 400];
    add.position = [500, 240];

    editor.on('connectiondrop', (io) /* Input or Output */ => {
      console.log('DROP');
    });

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
}
