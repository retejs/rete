import assert from 'assert';
import { Component, Node, Input, NodeEditor, Output } from '../src';
import { renderMock } from './utils/render-mock';
import { Comp1, Comp2 } from './data/components';
import addNumbersData from './data/add-numbers';
require('jsdom-global')()

describe('Editor', () => {

    let container: HTMLElement;
    let editor: NodeEditor;

    beforeEach(() => {
        let par = document.createElement('div') as HTMLElement;

        container = document.createElement('div') as HTMLElement;
        par.appendChild(container);

        editor = new NodeEditor('test@0.0.1', container);
        
        editor.events['warn'] = [];
        editor.events['error'] = [];
    });

    it('init', () => {
        assert.throws(() => new NodeEditor('test', container), Error, 'id');
        assert.throws(() => new NodeEditor('test@5.5', container), Error, 'id');
    })

    it('component register', () => {
        const comp = new Comp1();

        assert.throws(() => Boolean(editor.getComponent('Number')), 'component not registered')

        editor.register(comp)
        assert.doesNotThrow(() => Boolean(editor.getComponent('Number')), 'component registered')
    });

    describe('manage', () => {
        let comps: Component[];

        beforeEach(() => {
            comps = [new Comp1(), new Comp2()]

            comps.forEach(c => editor.register(c));
        })

        it('import', async () => {
            let ret = await editor.fromJSON({ id: 'test@0.0.2', nodes: {} });
    
            assert.strictEqual(ret, false, 'can not be taken with another id');
        });

        it('export', async () => {
            renderMock(editor);
            editor.events['warn'] = editor.events['error'] = [(err: any) => assert.fail(err)]

            let ret = await editor.fromJSON(addNumbersData as any);

            assert.strictEqual(ret, true, 'correct data');

            assert.deepStrictEqual(editor.toJSON(), addNumbersData)
        });

        it('connections', async () => {
            renderMock(editor);

            const node1 = await comps[0].createNode();
            const node2 = await comps[1].createNode();

            editor.addNode(node1);
            editor.addNode(node2);

            // assert.throws(() => editor.connect(n1.outputs.get('none'), n2.inputs.get('name')), Error, 'no output');
            
            editor.connect(node1.outputs.get('num') as Output, node2.inputs.get('num1') as Input);
            assert.strictEqual((node1.outputs.get('num') as Output).connections.length, 1, 'one connection');
            
            var connection = (node1.outputs.get('num') as Output).connections[0];

            assert.doesNotThrow(() => editor.removeConnection(connection), Error, 'remove connection');
            assert.strictEqual((node1.outputs.get('num') as Output).connections.length, 0, 'no connections');
        });

        it('nodes', async () => {
            const node1 = await comps[0].createNode();
            const node2 = await comps[0].createNode();

            assert.strictEqual(editor.nodes.length, 0, 'No nodes')
            editor.addNode(node1)
            assert.strictEqual(editor.nodes.length, 1, 'One node exist')

            editor.selectNode(node1)
            assert.strictEqual(editor.selected.contains(node1), true, 'Node selected')

            assert.throws(() => editor.selectNode(node2), 'Unable to select not added node')

            editor.addNode(node2)
            editor.selectNode(node2, false)
            assert.strictEqual(editor.selected.contains(node1), false, 'Previous node unselected')
            assert.strictEqual(editor.selected.contains(node2), true, 'New node selected')

            editor.selectNode(node1, true)
            assert.strictEqual(editor.selected.list.length, 2, 'Both nodes selected')

            editor.removeNode(node1)
            assert.strictEqual(editor.nodes.length, 1, 'First node removed')
            editor.removeNode(node2)
            assert.strictEqual(editor.nodes.length, 0, 'Second node removed')
        })
        
        it('create node with data', async () => {
            const data = {
                some: 'data'
            }
            const node1 = await comps[0].createNode(data);

            editor.addNode(node1)
            assert.equal(editor.nodes[0].data, data)
        });

        describe('prevent', () => {
            let node: Node;
            let node2: Node;

            beforeEach(async () => {
                node = await comps[0].createNode();
                node2 = await comps[1].createNode();
            })

            it('adding node', () => {
                editor.on('nodecreate', () => false);
                editor.addNode(node);
                assert.strictEqual(editor.nodes.length, 0)
            });

            it('removing node', () => {
                editor.on('noderemove', () => false);
                editor.addNode(node);
                editor.removeNode(node);
                assert.strictEqual(editor.nodes.length, 1)
            });

            it('connection', () => {
                editor.on('connectioncreate', () => false);
                editor.connect(node.outputs.get('num') as Output, node2.inputs.get('num1') as Input)
                assert.strictEqual((node.outputs.get('num') as Output).hasConnection(), false)
            });

            it('connection', () => {
                const output = node.outputs.get('num') as Output;

                editor.on('connectionremove', () => false);
                editor.connect(output, node2.inputs.get('num1') as Input)

                assert.strictEqual(output.hasConnection(), true)

                editor.removeConnection(output.connections[0]);

                assert.strictEqual(output.hasConnection(), true)
            });
        });
    });
})
