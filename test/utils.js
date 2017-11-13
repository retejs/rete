import { Utils } from '../src/utils';
import assert from 'assert';

describe('Utils', () => {
    it('validate id ', () => {
        assert.ok(Utils.isValidId('demo@0.0.0'));
        assert.ok(!Utils.isValidId('demo@0.0g.0'));
    });

    it('validate data', () => {
        var data = {id: 'demo@0.0.0', nodes: null, goups: {} };

        assert.ok(!Utils.isValidData(data));
    });

    it('validate', () => {
        var id = 'demo@0.1.0';
        var data = { id: 'demo@0.0.0', nodes: {}, goups: {} };

        assert.ok(!Utils.validate(id, data).success);
    });
});
    