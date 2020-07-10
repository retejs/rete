import { Node } from './node';

export class Selected {
  list: Node[] = [];

  /**
   * Adds an item to the list
   * @param {Node} item
   * @param {boolean} accumulate defines if the list will be overwritten
   * with the new item or if it will be added to the list.
   */
  add(item: Node, accumulate = false) {
    if (!accumulate) this.list = [item];
    else if (!this.contains(item)) this.list.push(item);
  }

  clear() {
    this.list = [];
  }

  remove(item: Node) {
    this.list.splice(this.list.indexOf(item), 1);
  }

  contains(item: Node) {
    return this.list.indexOf(item) !== -1;
  }

  each(callback: (n: Node, index: number) => void) {
    this.list.forEach(callback);
  }
}
