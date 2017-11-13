import { Socket } from '../src/socket';
import assert from 'assert';

describe('Socket', () => {
    it('string arguments', () => {
        assert.throws(() => new Socket('abcd', 100, 'defg'), Error, 'second arg');
        assert.throws(() => new Socket(100, 'abcd', 'defg'), Error, 'first arg');
        assert.throws(() => new Socket('abcd', 'defg', 100), Error, 'third arg');
    });

    it('arguments count', () => {
        assert.throws(() => new Socket(), Error, 'no one');
        assert.throws(() => new Socket('abcd'), Error, 'only one');
        assert.throws(() => new Socket('abcd', 'defg'), Error, 'two args');
    });

    it('compatible', () => {
        var s1 = new Socket('id', 'name', 'hint');
        var s2 = new Socket('id', 'name', 'hint');
        var s3 = new Socket('id2', 'name', 'hint');
        
        assert.ok(s1.compatibleWith(s1));
        assert.ok(!s1.compatibleWith(s2));
        assert.ok(!s3.compatibleWith(s1));

        s3.combineWith(s1);
        assert.ok(s3.compatibleWith(s1));
        assert.ok(!s1.compatibleWith(s3));
        assert.ok(!s3.compatibleWith(s2));
        
    });
});    