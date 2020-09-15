import { Output, Input, Emitter } from 'rete';
import { EditorView } from 'rete/types/view';
import { EventsTypes } from 'rete/types/events';
import { renderConnection, renderPathData, updateConnection } from '../utils';

export class PickerView {
  private el: HTMLElement;

  constructor(
    private emitter: Emitter<EventsTypes>,
    private editorView: EditorView
  ) {
    this.el = document.createElement('div');
    this.el.style.position = 'absolute';
    this.editorView.area.appendChild(this.el);
  }

  updatePseudoConnection(io: Output | Input | null) {
    if (io !== null) {
      this.renderConnection(io);
    } else if (this.el.parentElement) {
      this.el.innerHTML = '';
    }
  }

  private getPoints(io: Output | Input): number[] {
    const mouse = this.editorView.area.mouse;

    if (!io.node) throw new Error('Node in output/input not found');

    const node = this.editorView.nodes.get(io.node);

    if (!node) throw new Error('Node view not found');

    const [x1, y1] = node.getSocketPosition(io);

    return io instanceof Output
      ? [x1, y1, mouse.x, mouse.y]
      : [mouse.x, mouse.y, x1, y1];
  }

  updateConnection(io: Output | Input) {
    const d = renderPathData(this.emitter, this.getPoints(io));

    updateConnection({ el: this.el, d });
  }

  renderConnection(io: Output | Input) {
    const d = renderPathData(this.emitter, this.getPoints(io));

    renderConnection({ el: this.el, d });
  }
}
