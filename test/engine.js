import './utils/domReady';
import assert from 'assert';
import recursiveData from './data/recursive'

describe('Engine', () => {
    
    var id = 'test@0.0.1';
    var data = { id, nodes: {}, groups: {} };
    var dataWithNode = { id, nodes: {1: {id: 1, title: 'name'}}, groups: {} };
    var trueComponents = [new D3NE.Component('name', {})];

    var createValidEngine = () => new D3NE.Engine(id, trueComponents);

    it('init', async () => {
        assert.doesNotThrow(createValidEngine, Error, 'valid');
        assert.throws(() => new D3NE.Engine(id, [trueComponents]), Error, 'array instead of component');
        assert.throws(() => new D3NE.Engine(id, [56]), Error, 'wrong component');
        assert.throws(() => new D3NE.Engine('test@0.1', trueComponents), Error, 'wrong id');
    });

    describe('process', async () => {
        it('data', async () => {
            assert.equal(await createValidEngine().process(data), 'success');
            assert.notEqual(await createValidEngine().process({ id: 'test@1.0.0', nodes: {}, groups: {} }), 'success', 'wrong id');
            assert.notEqual(await createValidEngine().process({ id, groups: {} }), 'success', 'no nodes');
        });
    
        it('validation', async () => {
            assert.notEqual(await createValidEngine().process(recursiveData), 'success', 'recursive data');
        });    
    });
});