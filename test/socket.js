import assert from 'assert';

describe('Socket', () => {
    it('Socket arguments', () => {
        // assert.throws(() => new Rete.Socket(), Error, 'null');
        // assert.throws(() => new Rete.Socket(345), Error, 'number');
        assert.doesNotThrow(() => new Rete.Socket('valid name'), Error, 'valid string');
    });

    it('compatible', () => {
        var s1 = new Rete.Socket('name1');
        var s2 = new Rete.Socket('name2');
        var s3 = new Rete.Socket('name3');
        
        assert.ok(s1.compatibleWith(s1));
        assert.ok(!s1.compatibleWith(s2));
        assert.ok(!s3.compatibleWith(s1));

        s3.combineWith(s1);
        assert.ok(s3.compatibleWith(s1));
        assert.ok(!s1.compatibleWith(s3));
        assert.ok(!s3.compatibleWith(s2));
        
    });
});    