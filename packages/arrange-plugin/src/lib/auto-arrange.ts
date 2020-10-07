import { Board } from './board';
import { Cache } from './cache';

export class AutoArrange {
  private readonly editor: any;
  private readonly margin: { x: number; y: number } | null;
  private readonly depth: number | null;
  private readonly vertical: boolean | null;

  constructor(editor, margin, depth, vertical) {
    this.editor = editor;
    this.margin = margin;
    this.depth = depth;
    this.vertical = vertical;
  }

  getNodes(node, type = 'output') {
    const nodes = [];
    const key = `${type}s`;

    for (const io of node[key].values())
      for (const connection of io.connections.values())
        nodes.push(connection[type === 'input' ? 'output' : 'input'].node);

    return nodes;
  }

  getNodesBoard(node, cache = new Cache(), board = new Board(), depth = 0) {
    if (this.depth && depth > this.depth) return;
    if (cache.track(node)) return;

    board.add(depth, node);

    this.getNodes(node, 'output').forEach((n) =>
      this.getNodesBoard(n, cache, board, depth + 1)
    );
    this.getNodes(node, 'input').forEach((n) =>
      this.getNodesBoard(n, cache, board, depth - 1)
    );

    return board;
  }

  getNodeSize(node) {
    const el = this.editor.view.nodes.get(node).el;

    return this.vertical
      ? {
          height: el.clientWidth,
          width: el.clientHeight,
        }
      : {
          width: el.clientWidth,
          height: el.clientHeight,
        };
  }

  translateNode(node, { x, y }) {
    const position = this.vertical ? [y, x] : [x, y];

    this.editor.view.nodes.get(node).translate(...position);
    this.editor.view.updateConnections({ node });
  }

  arrange(firstNode = this.editor.nodes[0]) {
    const board = this.getNodesBoard(firstNode).toArray();
    const margin = this.vertical
      ? { x: this.margin.y, y: this.margin.x }
      : this.margin;

    let x = 0;

    for (const column of board) {
      const sizes = column.map((node) => this.getNodeSize(node));
      const columnWidth = Math.max(...sizes.map((size) => size.width));
      const fullHeight = sizes.reduce(
        (sum, node) => sum + node.height + margin.y,
        0
      );

      let y = 0;

      for (const node of column) {
        const position = { x, y: y - fullHeight / 2 };
        const { height } = this.getNodeSize(node);

        this.translateNode(node, position);

        y += height + margin.y;
      }

      x += columnWidth + margin.x;
    }
  }
}
