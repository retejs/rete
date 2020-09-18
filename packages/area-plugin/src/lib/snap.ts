export class SnapGrid {
  private editor: any;
  private readonly size: number;

  constructor(editor, { size = 16, dynamic = true }) {
    this.editor = editor;
    this.size = size;

    if (dynamic) this.editor.on('nodetranslate', this.onTranslate.bind(this));
    else
      this.editor.on('rendernode', ({ node, el }) => {
        el.addEventListener('mouseup', this.onDrag.bind(this, node));
        el.addEventListener('touchend', this.onDrag.bind(this, node));
        el.addEventListener('touchcancel', this.onDrag.bind(this, node));
      });
  }

  onTranslate(data) {
    const { x, y } = data;

    data.x = this.snap(x);
    data.y = this.snap(y);
  }

  onDrag(node) {
    const [x, y] = node.position;

    node.position[0] = this.snap(x);
    node.position[1] = this.snap(y);
    console.log(this, x, y, node.position);

    this.editor.view.nodes.get(node).update();
    this.editor.view.updateConnections({ node });
  }

  snap(value) {
    return Math.round(value / this.size) * this.size;
  }
}
