import assert from 'assert';
import { Component, Input, NodeEditor, Output } from '../src';
import { renderMock } from './utils/render-mock';
import { Comp1, Comp2 } from './data/components';
require('jsdom-global')()

describe('Editor', () => {

    let c: HTMLElement;

    beforeEach(() => {
        let par = document.createElement('div') as HTMLElement;

        c = document.createElement('div') as HTMLElement;
        par.appendChild(c);
    });

    it('init', () => {
        assert.throws(() => new NodeEditor('test', c), Error, 'id');
        assert.throws(() => new NodeEditor('test@5.5', c), Error, 'id');
    })

    describe('manage', () => {
        let editor: NodeEditor;

        beforeEach(() => {
            editor = new NodeEditor('test@0.0.2', c);
            editor.events['warn'] = [];
            editor.events['error'] = [];
        })

        it('import/export', async () => {
            var ret;
            
            ret = await editor.fromJSON({ id: 'test@0.0.1', nodes: {} });
            assert.equal(ret, false, 'can not be taken with another id');
            
            ret = await editor.fromJSON({ id: 'test@0.0.1', nodes: {} });
            assert.equal(ret, false, 'nodes are mandatory');

            ret = await editor.fromJSON({ id: 'test@0.0.2', nodes: {} });
            assert.equal(ret, true, 'correct data');

            assert.deepEqual(editor.toJSON(), { id: 'test@0.0.2', nodes: {} })
        });

        it('connections', async () => {
            renderMock(editor);

            var comps: Component[] = [new Comp1(), new Comp2()]

            editor.register(comps[0])
            editor.register(comps[1])

            const n1 = await comps[0].createNode();
            const n2 = await comps[1].createNode();

            editor.addNode(n1);
            editor.addNode(n2);

            // assert.throws(() => editor.connect(n1.outputs.get('none'), n2.inputs.get('name')), Error, 'no output');
            
            editor.connect(n1.outputs.get('name') as Output, n2.inputs.get('name') as Input);
            assert.equal((n1.outputs.get('name') as Output).connections.length, 1, 'one connection');
            
            var connection = (n1.outputs.get('name') as Output).connections[0];

            assert.doesNotThrow(() => editor.removeConnection(connection), Error, 'remove connection');
            assert.equal((n1.outputs.get('name') as Output).connections.length, 0, 'no connections');
        });

        it('events', () => {
            assert.doesNotThrow(() => editor.trigger('nodecreate'), Error, 'nodecreate events exist');
            assert.throws(() => editor.on('wrngevent' as any, () => {}), Error, 'throw exception on non-exist event');
            assert.doesNotThrow(() => editor.on(['nodecreate'], () => {}), Error, 'on events array');
        })

        it('component register', () => {
            const comp = new Comp1();

            assert.throws(() => Boolean(editor.getComponent('Num')), 'component not registered')

            editor.register(comp)
            assert.doesNotThrow(() => Boolean(editor.getComponent('Num')), 'component registered')
        });

        it('nodes', async () => {
            const comp = new Comp1();
            const node1 = await comp.createNode();
            const node2 = await comp.createNode();

            editor.register(comp)

            assert.equal(editor.nodes.length, 0, 'No nodes')
            editor.addNode(node1)
            assert.equal(editor.nodes.length, 1, 'One node exist')

            editor.selectNode(node1)
            assert.equal(editor.selected.contains(node1), true, 'Node selected')

            assert.throws(() => editor.selectNode(node2), 'Unable to select not added node')

            editor.addNode(node2)
            editor.selectNode(node2, false)
            assert.equal(editor.selected.contains(node1), false, 'Previous node unselected')
            assert.equal(editor.selected.contains(node2), true, 'New node selected')

            editor.selectNode(node1, true)
            assert.equal(editor.selected.list.length, 2, 'Both nodes selected')

            editor.removeNode(node1)
            assert.equal(editor.nodes.length, 1, 'First node removed')
            editor.removeNode(node2)
            assert.equal(editor.nodes.length, 0, 'Second node removed')
        })
    });
})