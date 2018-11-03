// import { Validator } from '../src/core/validator';
import assert from 'assert';

describe('Validator', () => {
    it('validate id ', () => {
        assert.ok(Rete.Validator.isValidId('demo@0.0.0'));
        assert.ok(!Rete.Validator.isValidId('demo@0.0g.0'));
    });

    it('validate data', () => {
        assert.ok(!Rete.Validator.isValidData({ id: 'demo@0.0.0', nodes: null, goups: {} }));
        assert.ok(!Rete.Validator.isValidData({ id: 'demo@0.0.0', nodes: [], goups: {} }), 'nodes array');
    });

    it('validate', () => {
        var id = 'demo@0.1.0';
        var data = { id: 'demo@0.0.0', nodes: {}, goups: {} };

        assert.ok(!Rete.Validator.validate(id, data).success);
    });
});
    