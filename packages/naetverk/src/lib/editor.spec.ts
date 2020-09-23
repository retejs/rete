import { renderMock } from '../../test/utils/render-mock';
import { Component, Input, Node, NodeEditor, Output } from '../index';
import { Comp1, Comp2 } from '../../test/components';
import addNumbersData from '../../test/add-numbers';

describe('Editor', () => {
  let container: HTMLElement;
  let editor: NodeEditor;

  beforeEach(() => {
    const par = document.createElement('div') as HTMLElement;

    container = document.createElement('div') as HTMLElement;
    par.appendChild(container);

    editor = new NodeEditor('test@0.0.1', container);

    editor.events['warn'] = [];
    editor.events['error'] = [];
  });

  it('init', () => {
    expect(() => new NodeEditor('test', container)).toThrow(
      'ID should be valid to name@0.1.0 format'
    );
    expect(() => new NodeEditor('test@5.5', container)).toThrow(
      'ID should be valid to name@0.1.0 format'
    );
  });

  it('component register', () => {
    const comp = new Comp1();

    expect(() => Boolean(editor.getComponent('Number'))).toThrow(
      'Component Number not found'
    );

    editor.register(comp);
    expect(() => Boolean(editor.getComponent('Number'))).not.toThrow(
      'Component Number not found'
    );
  });

  describe('manage', () => {
    let comps: Component[];

    beforeEach(() => {
      comps = [new Comp1(), new Comp2()];

      comps.forEach((c) => editor.register(c));
    });

    it('import', async () => {
      const ret = await editor.fromJSON({ id: 'test@0.0.2', nodes: {} });
      expect(ret).toBeFalsy();
    });
    it('export', async () => {
      renderMock(editor);
      editor.events['warn'] = editor.events['error'] = [
        (err: any) => {
          return expect(err).toEqual('');
        },
      ];

      const ret = await editor.fromJSON(addNumbersData as any);
      expect(ret).toBeTruthy();
      expect(editor.toJSON()).toEqual(addNumbersData);
    });

    it('connections', async () => {
      renderMock(editor);

      const node1 = await comps[0].createNode();
      const node2 = await comps[1].createNode();

      editor.addNode(node1);
      editor.addNode(node2);

      // assert.throws(() => editor.connect(n1.outputs.get('none'), n2.inputs.get('name')), Error, 'no output');

      editor.connect(
        node1.outputs.get('num') as Output,
        node2.inputs.get('num1') as Input
      );

      expect((node1.outputs.get('num') as Output).connections.length).toEqual(
        1
      );

      expect(() => editor.removeConnection(connection)).toThrow(
        "Cannot access 'connection' before initialization"
      );

      const connection = (node1.outputs.get('num') as Output).connections[0];

      expect(() => editor.removeConnection(connection)).not.toThrow(
        "Cannot access 'connection' before initialization"
      );

      expect((node1.outputs.get('num') as Output).connections.length).toEqual(
        0
      );
    });

    it('nodes', async () => {
      const node1 = await comps[0].createNode();
      const node2 = await comps[0].createNode();

      expect(editor.nodes.length).toEqual(0);
      editor.addNode(node1);
      expect(editor.nodes.length).toEqual(1);

      editor.selectNode(node1);
      expect(editor.selected.contains(node1)).toBeTruthy();

      expect(() => editor.selectNode(node2)).toThrow('Node not exist in list');

      editor.addNode(node2);
      editor.selectNode(node2, false);

      expect(editor.selected.contains(node1)).toBeFalsy();
      expect(editor.selected.contains(node2)).toBeTruthy();

      editor.selectNode(node1, true);
      expect(editor.selected.list.length).toEqual(2);

      editor.removeNode(node1);
      expect(editor.nodes.length).toEqual(1);
      editor.removeNode(node2);
      expect(editor.nodes.length).toEqual(0);
    });

    it('create node with data', async () => {
      const data = {
        some: 'data',
      };
      const node1 = await comps[0].createNode(data);

      editor.addNode(node1);
      expect(editor.nodes[0].data).toEqual(data);
    });

    describe('prevent', () => {
      let node: Node;
      let node2: Node;

      beforeEach(async () => {
        node = await comps[0].createNode();
        node2 = await comps[1].createNode();
      });

      it('adding node', () => {
        editor.on('nodecreate', () => false);
        editor.addNode(node);
        expect(editor.nodes.length).toEqual(0);
      });

      it('removing node', () => {
        editor.on('noderemove', () => false);
        editor.addNode(node);
        editor.removeNode(node);
        expect(editor.nodes.length).toEqual(1);
      });

      it('connection', () => {
        editor.on('connectioncreate', () => false);
        editor.connect(
          node.outputs.get('num') as Output,
          node2.inputs.get('num1') as Input
        );
        expect((node.outputs.get('num') as Output).hasConnection()).toBeFalsy();
      });

      it('connection', () => {
        const output = node.outputs.get('num') as Output;

        editor.on('connectionremove', () => false);
        editor.connect(output, node2.inputs.get('num1') as Input);
        expect(output.hasConnection()).toBeTruthy();

        editor.removeConnection(output.connections[0]);
        // expect(output.hasConnection()).toBeTruthy();
      });
    });
  });
});
