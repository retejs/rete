import { Engine } from './engine';
import { Comp1, Comp2 } from '../../../test/components';
import recursiveData from '../../../test/recursive';

describe('Engine', () => {
  const id = 'test@0.0.1';
  const data = { id, nodes: {} };

  function createValidEngine() {
    const eng = new Engine(id);

    eng.events['warn'] = [];
    eng.events['error'] = [];
    eng.register(new Comp1());
    eng.register(new Comp2());
    return eng;
  }

  it('should init without an error', async () => {
    const engine = createValidEngine();
    expect(engine).toHaveProperty('args');
    expect(engine).toHaveProperty('data');
    expect(engine.id).toEqual(id);
  });

  it('should init with an error on a duplicated id', async () => {
    createValidEngine();
    expect(() => new Engine('test@0.1')).toThrow(
      'ID should be valid to name@0.1.0 format'
    );
  });

  describe('instance', async () => {
    let engine: Engine;

    beforeEach(() => {
      engine = createValidEngine();
    });

    it('should return an error when using a wrong id', async () => {
      expect(await engine.process(data)).toEqual('success');
      expect(await engine.process({ id: 'test@1.0.0', nodes: {} })).toEqual(
        'aborted'
      );
    });

    it('should return an error when validation fails', async () => {
      expect(await engine.process(recursiveData as any)).toEqual('aborted');

      //  assert.notStrictEqual(
      //    await engine.process(recursiveData as any),
      //    'success',
      //    'recursive data'
      //  );
    });

    it('clone', () => {
      const engineClone = engine.clone();

      // assert.strictEqual(engineClone instanceof Engine, true, 'is instance');
      // assert.strictEqual(engineClone.id, engine.id, 'id');
      // assert.deepStrictEqual(
      //   engineClone.components,
      //   engine.components,
      //   'components'
      // );
    });

    it('abort', (done) => {
      engine
        .process(data as any)
        .then((v) => {
          /// assert.strictEqual(v, 'aborted', 'Check aborted process');
        })
        .catch(done);
      engine.abort();

      engine
        .process(data as any)
        .then((v) => {
          //// assert.strictEqual(Boolean(v), false, 'Not aborted completely');
        })
        .then(done);
    });

    /*
    describe('process without abort', () => {
      let cw = console.warn;
      before(() => (console.warn = () => {}));
      after(() => (console.warn = cw));

      it('process warn', (done) => {
        engine.process(data);
        engine
          .process(data)
          .then((r) => {
            assert.strictEqual(
              Boolean(r),
              false,
              'cannot process simultaneously'
            );
          })
          .then(done)
          .catch(done);
      });
    });
     */

    /*
    it('process start node', async () => {
      const correctId = Object.keys(addNumbersData.nodes)[0];
      const wrongId = Number.POSITIVE_INFINITY;

      assert.strictEqual(
        await engine.process(addNumbersData as any, correctId),
        'success'
      );
      // assert.strictEqual(await engine.process(addNumbersData as any, wrongId), 'error')
    });
     */
  });
});
