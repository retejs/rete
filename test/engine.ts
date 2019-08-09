import { Comp1, Comp2 } from './data/components';
import { Engine } from '../src/engine';
import addNumbersData from './data/add-numbers';
import assert from 'assert';
import recursiveData from './data/recursive'

describe('Engine', () => {
    var id = 'test@0.0.1';
    var data = { id, nodes: {} };

    function createValidEngine() {
        let eng = new Engine(id);

        eng.events['warn'] = [];
        eng.events['error'] = [];
        eng.register(new Comp1());
        eng.register(new Comp2());
        return eng;
    }

    it('init', async () => {
        assert.doesNotThrow(createValidEngine, Error, 'valid')
        // assert.throws(() => {
        //     let eng = createValidEngine(); 

        //     eng.register({})
        // }, Error, 'object instead of component');
        assert.throws(() => new Engine('test@0.1'), Error, 'wrong id')
    });

    describe('instance', async () => {
        let engine: Engine;

        beforeEach(() => {
            engine = createValidEngine()
        })

        it('data', async () => {
            assert.equal(await engine.process(data), 'success')
            assert.notEqual(await engine.process({ id: 'test@1.0.0', nodes: {} }), 'success', 'wrong id')
        });
    
        it('validation', async () => {
            assert.notEqual(await engine.process(recursiveData as any), 'success', 'recursive data')
        });  

        it('clone', () => {
            const engineClone = engine.clone();

            assert.equal(engineClone instanceof Engine, true, 'is instance')
            assert.equal(engineClone.id, engine.id, 'id')
            assert.deepEqual(engineClone.components, engine.components, 'components')
        })

        it('abort', (done) => {
            engine.process(data as any).then(v => {
                assert.equal(v, 'aborted', 'Check aborted process')
            }).catch(done)
            engine.abort();
            
            engine.process(data as any).then(v => {
                assert.equal(Boolean(v), false, 'Not aborted completely')
            }).then(done)
        })

        describe('process without abort', () => {
            let cw = console.warn;
            before(() => console.warn = () => {})
            after(() => console.warn = cw)

            it('process warn', (done) => {
                engine.process(data)
                engine.process(data).then(r => {
                    assert.equal(Boolean(r), false, 'cannot process simultaneously')
                }).then(done).catch(done)
            })
        });

        it('process start node', async () => {
            const correctId = Object.keys(addNumbersData.nodes)[0];
            const wrongId = Number.POSITIVE_INFINITY;

            assert.equal(await engine.process(addNumbersData as any, correctId), 'success')
            // assert.equal(await engine.process(addNumbersData as any, wrongId), 'error')
        });
    });
});