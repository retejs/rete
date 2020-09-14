import { numSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { Component } from '../../../../../../packages/naetverk/src/lib/component';
import { Output } from '../../../../../../packages/naetverk/src';

export class NumComponent extends Component {
  constructor() {
    super('Number');
  }

  builder(node) {
    const out1 = new Output('num', 'Number', numSocket);

    return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
  }
}
