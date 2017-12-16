import './utils/domReady';
import assert from 'assert';

describe('Editor', () => {

    var c = document.querySelector('#d3ne');
    var menu = new D3NE.ContextMenu({});

    it('init', () => {
        assert.throws(() => new D3NE.NodeEditor('test@0.0.2', null, [], menu), Error, 'container');
        assert.throws(() => new D3NE.NodeEditor('test@0.0.2', c, {}, menu), Error, 'components');
        assert.throws(() => new D3NE.NodeEditor('test', c, [], menu), Error, 'id');
        assert.throws(() => new D3NE.NodeEditor('test@5.5', c, [], menu), Error, 'id');
        assert.throws(() => new D3NE.NodeEditor('test@0.1.2', c, [], {}), Error, 'menu');
    })

    it('import/export', async () => {
        var editor = new D3NE.NodeEditor('test@0.0.2', c, [], menu);
        var ret;
        
        ret = await editor.fromJSON({ id: 'test@0.0.1', nodes: {}, groups: {} });
        assert.equal(ret, false, 'can not be taken with another id');
        
        ret = await editor.fromJSON({ id: 'test@0.0.1', nodes: {}, groups: {} });
        assert.equal(ret, false, 'nodes are mandatory');

        ret = await editor.fromJSON({ id: 'test@0.0.2', nodes: {}, groups: {} });
        assert.equal(ret, true, 'correct data');
    });

    it('connections', async () => {
        var comps = [new D3NE.Component('Num', {
            builder(node) {
                node.addOutput(new D3NE.Output('Name', socketNum))
            },
            worker() {
                
            }
        }),
            new D3NE.Component('Return', {
                builder(node) {
                    node.addInput(new D3NE.Input('Name', socketNum));
                },
                worker() {
                    
                }
            })
        ];

        var editor = new D3NE.NodeEditor('test@0.0.2', c, comps, menu);
        var socketNum = new D3NE.Socket('num', 'Number', '');

        var n1, n2;

        comps[0].builder(n1 = comps[0].newNode())
        comps[1].builder(n2 = comps[1].newNode())

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