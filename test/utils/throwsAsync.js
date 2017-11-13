import assert from 'assert';

export default async function(fn, msg) {
    let f = () => {};

    try {
        await fn();
    } catch (e) {
        f = () => {throw e};
    } finally {
        assert.throws(f, Error, msg);
    }
}