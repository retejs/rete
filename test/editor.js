import './utils/domReady';
import assert from 'assert';
import { renderMock } from './utils/render-mock';

describe('Editor', () => {
    var c = document.querySelector('#d3ne');

    it('init', () => {
        assert.throws(() => new D3NE.NodeEditor('test@0.0.2', null), Error, 'container');
        assert.throws(() => new D3NE.NodeEditor('test', c), Error, 'id');
        assert.throws(() => new D3NE.NodeEditor('test@5.5', c), Error, 'id');
    })

    it('import/export', async () => {
        var editor = new D3NE.NodeEditor('test@0.0.2', c);
        var ret;
        
        ret = await editor.fromJSON({ id: 'test@0.0.1', nodes: {} });
        assert.equal(ret, false, 'can not be taken with another id');
        
        ret = await editor.fromJSON({ id: 'test@0.0.1', nodes: {} });
        assert.equal(ret, false, 'nodes are mandatory');

        ret = await editor.fromJSON({ id: 'test@0.0.2', nodes: {} });
        assert.equal(ret, true, 'correct data');
    });

    it('connections', async () => {
        var socketNum = new D3NE.Socket('Number');

        class Comp1 extends D3NE.Component {

            constructor() {
                super('Num');
            }

            builder(node) {
                node.addOutput(new D3NE.Output('Name', socketNum))
            }

            worker() { }
        }

        class Comp2 extends D3NE.Component {

            constructor() {
                super('Return');
            }

            builder(node) {
                node.addInput(new D3NE.Input('Name', socketNum));
            }

            worker() { }
        }

        var editor = new D3NE.NodeEditor('test@0.0.2', c);

        renderMock(editor);

        var comps = [new Comp1(), new Comp2()]

        editor.register(comps[0])
        editor.register(comps[1])

        const n1 = await comps[0].createNode();
        const n2 = await comps[1].createNode();

        editor.addNode(n1);
        editor.addNode(n2);

        assert.throws(() => editor.connect(n1.outputs[1], n2.inputs[0]), Error, 'no output');
        
        editor.connect(n1.outputs[0], n2.inputs[0]);
        assert.equal(n1.outputs[0].connections.length, 1, 'one connection');
        
        var connection = n1.outputs[0].connections[0];

        assert.doesNotThrow(() => editor.removeConnection(connection), Error, 'remove connection');
        assert.equal(n1.outputs[0].connections.length, 0, 'no connections');
        
    });
})