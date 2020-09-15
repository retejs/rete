import { NodeEditor, Input, Output, Connection } from 'rete';
import { PickerView } from './view';

export class Picker {
  private editor: NodeEditor;
  private _io: Output | Input | null = null;
  public view: PickerView;

  constructor(editor: NodeEditor) {
    this.editor = editor;
    this.view = new PickerView(editor, editor.view);

    editor.on(
      'mousemove',
      () => this.io && this.view.updateConnection(this.io)
    );
  }

  get io(): Output | Input | null {
    return this._io;
  }

  set io(io: Output | Input | null) {
    this._io = io;
    this.view.updatePseudoConnection(io);
  }

  reset() {
    this.io = null;
  }

  pickOutput(output: Output) {
    if (!this.editor.trigger('connectionpick', output)) return;

    if (this.io instanceof Input) {
      if (!output.multipleConnections && output.hasConnection())
        this.editor.removeConnection(output.connections[0]);

      this.editor.connect(output, this.io);
      this.reset();
      return;
    }

    if (this.io) this.reset();
    this.io = output;
  }

  pickInput(input: Input) {
    if (!this.editor.trigger('connectionpick', input)) return;

    if (this.io === null) {
      if (input.hasConnection()) {
        this.io = input.connections[0].output;
        this.editor.removeConnection(input.connections[0]);
      } else {
        this.io = input;
      }
      return true;
    }

    if (!input.multipleConnections && input.hasConnection())
      this.editor.removeConnection(input.connections[0]);

    if (!this.io.multipleConnections && this.io.hasConnection())
      this.editor.removeConnection(this.io.connections[0]);

    if (this.io instanceof Output && this.io.connectedTo(input)) {
      const connection = input.connections.find((c) => c.output === this.io);

      if (connection) {
        this.editor.removeConnection(connection);
      }
    }

    if (this.io instanceof Output) {
      this.editor.connect(this.io, input);
      this.reset();
    }
  }

  pickConnection(connection: Connection) {
    const { output } = connection;

    this.editor.removeConnection(connection);
    this.io = output;
  }
}
