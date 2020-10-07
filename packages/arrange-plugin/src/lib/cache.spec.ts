import { Cache } from './cache';

describe('Caching', () => {
  it('should cache no response ', () => {
    const cache = new Cache();
    const map = new WeakMap();
    map.set(new Object({ name: 'test' }), 21);
    expect(cache.track(map)).toBe(undefined);
    expect(cache.track(map)).toBe(true);


    const map1 = new WeakMap().set(new Object({ name: 'test1' }), 21);
    const map2 = new WeakMap().set(new Object({ name: 'test2' }), 21);
    expect(cache.track(map1)).toBe(undefined);
    expect(cache.track(map2)).toBe(undefined);
  });
});
