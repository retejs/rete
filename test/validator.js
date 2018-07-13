import { Validator } from '../src/core/validator';
import assert from 'assert';

describe('Validator', () => {
    it('validate id ', () => {
        assert.ok(Validator.isValidId('demo@0.0.0'));
        assert.ok(!Validator.isValidId('demo@0.0g.0'));
    });

    it('validate data', () => {
        
        assert.ok(!Validator.isValidData({ id: 'demo@0.0.0', nodes: null, goups: {} }));
        assert.ok(!Validator.isValidData({ id: 'demo@0.0.0', nodes: [], goups: {} }), 'nodes array');
    });

    it('validate', () => {
        var id = 'demo@0.1.0';
        var data = { id: 'demo@0.0.0', nodes: {}, goups: {} };

        assert.ok(!Validator.validate(id, data).success);
    });
});
    