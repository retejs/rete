import './utils/domReady';
import assert from 'assert';
import recursiveData from './data/recursive'

describe('Engine', () => {
    
    class Comp1 extends Rete.Component {

        constructor() {
            super('Num');
        }

        builder() { }

        worker() { }
    }

    var id = 'test@0.0.1';
    var data = { id, nodes: {} };
    var dataWithNode = { id, nodes: { 1: { id: 1, title: 'name' } } };

    var createValidEngine = () => {
        let eng = new Rete.Engine(id);

        eng.register(new Comp1());
        return eng;
    };

    it('init', async () => {
        assert.doesNotThrow(createValidEngine, Error, 'valid');
        // assert.throws(() => {
        //     let eng = createValidEngine(); 

        //     eng.register({})
        // }, Error, 'object instead of component');
        assert.throws(() => new Rete.Engine('test@0.1'), Error, 'wrong id');
    });

    describe('process', async () => {
        it('data', async () => {
            assert.equal(await createValidEngine().process(data), 'success');
            assert.notEqual(await createValidEngine().process({ id: 'test@1.0.0', nodes: {} }), 'success', 'wrong id');
            assert.notEqual(await createValidEngine().process({ id }), 'success', 'no nodes');
        });
    
        it('validation', async () => {
            assert.notEqual(await createValidEngine().process(recursiveData), 'success', 'recursive data');
        });    
    });
});