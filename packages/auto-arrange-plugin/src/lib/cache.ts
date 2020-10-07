export class Cache {
  private _map: WeakMap<object, any>;
  constructor() {
    this._map = new WeakMap();
  }

  track(value) {
    if (this._map.has(value)) return true;
    this._map.set(value, true);
  }
}
