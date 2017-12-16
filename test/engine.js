import './utils/domReady';
import assert from 'assert';
import throwsAsync from './utils/throwsAsync';

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

    it('process', async () => {

        assert.doesNotThrow(() => createValidEngine().process(data), Error, 'valid data');
        await throwsAsync(async () => await createValidEngine().process({ id: 'test@1.0.0', nodes: {}, groups: {} }), 'wrong id');
        await throwsAsync(async () => await createValidEngine().process({ id, groups: {} }), 'no nodes');
    });
});