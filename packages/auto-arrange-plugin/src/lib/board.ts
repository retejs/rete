export class Board {
  private readonly _cols: any[];
  constructor() {
    this._cols = [];
  }

  add(columnIndex, value) {
    if (!this._cols[columnIndex]) this._cols[columnIndex] = [];
    this._cols[columnIndex].push(value);
  }

  toArray() {
    // normalize
    return Object.keys(this._cols)
      .sort((i1, i2) => +i1 - +i2)
      .map((key) => this._cols[key]);
  }
}
