import { Engine } from './engine';
import { Comp1, Comp2 } from '../../../test/components';
import recursiveData from '../../../test/recursive';
import addNumbersData from '../../../test/add-numbers';

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

  describe('instance', () => {
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

    it('should clone a engine', () => {
      const engineClone = engine.clone();
      expect(engineClone instanceof Engine).toBe(true);
      expect(engineClone.id).toEqual(engine.id);
      expect(engineClone.components).toEqual(engine.components);
    });

    describe('process without abort', () => {
      const cw = console.warn;
      beforeEach(() => (console.warn = () => {}));
      afterEach(() => (console.warn = cw));

      it('process warn', (done) => {
        engine.process(data);
        engine
          .process(data)
          .then((r) => {
            console.log(r);
            expect(Boolean(r)).toBeFalsy();
          })
          .then(done)
          .catch(done);
      });
    });

    it('should start a process with a valid id', async () => {
      const correctId = Object.keys(addNumbersData.nodes)[0];

      expect(await engine.process(addNumbersData as any, correctId)).toEqual(
        'success'
      );
    });

    it.skip('should abort a process with a invalid id', async () => {
      const wrongId = 323;

      expect(await engine.process(addNumbersData as any, wrongId)).toEqual(
        'aborted'
      );
    });
  });
});
