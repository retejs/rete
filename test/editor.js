import './utils/domReady';
import assert from 'assert';
import { renderMock } from './utils/render-mock';

describe('Editor', () => {
    var c = document.querySelector('#Rete');

    it('init', () => {
        assert.throws(() => new Rete.NodeEditor('test@0.0.2', null), Error, 'container');
        assert.throws(() => new Rete.NodeEditor('test', c), Error, 'id');
        assert.throws(() => new Rete.NodeEditor('test@5.5', c), Error, 'id');
    })

    it('import/export', async () => {
        var editor = new Rete.NodeEditor('test@0.0.2', c);
        var ret;
        
        ret = await editor.fromJSON({ id: 'test@0.0.1', nodes: {} });
        assert.equal(ret, false, 'can not be taken with another id');
        
        ret = await editor.fromJSON({ id: 'test@0.0.1', nodes: {} });
        assert.equal(ret, false, 'nodes are mandatory');

        ret = await editor.fromJSON({ id: 'test@0.0.2', nodes: {} });
        assert.equal(ret, true, 'correct data');
    });

    it('connections', async () => {
        var socketNum = new Rete.Socket('Number');

        class Comp1 extends Rete.Component {

            constructor() {
                super('Num');
            }

            builder(node) {
                node.addOutput(new Rete.Output('name', 'Name', socketNum))
            }

            worker() { }
        }

        class Comp2 extends Rete.Component {

            constructor() {
                super('Return');
            }

            builder(node) {
                node.addInput(new Rete.Input('name', 'Name', socketNum));
            }

            worker() { }
        }

        var editor = new Rete.NodeEditor('test@0.0.2', c);

        renderMock(editor);

        var comps = [new Comp1(), new Comp2()]

        editor.register(comps[0])
        editor.register(comps[1])

        const n1 = await comps[0].createNode();
        const n2 = await comps[1].createNode();

        editor.addNode(n1);
        editor.addNode(n2);

        // assert.throws(() => editor.connect(n1.outputs.get('none'), n2.inputs.get('name')), Error, 'no output');
        
        editor.connect(n1.outputs.get('name'), n2.inputs.get('name'));
        assert.equal(n1.outputs.get('name').connections.length, 1, 'one connection');
        
        var connection = n1.outputs.get('name').connections[0];

        assert.doesNotThrow(() => editor.removeConnection(connection), Error, 'remove connection');
        assert.equal(n1.outputs.get('name').connections.length, 0, 'no connections');
        
    });
})