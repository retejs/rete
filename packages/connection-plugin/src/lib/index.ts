import { NodeEditor } from 'rete';
import { Picker } from './picker';
import {
  renderConnection,
  renderPathData,
  updateConnection,
  getMapItemRecursively,
} from './utils';
import { Flow, FlowParams } from './flow';
import './events';

export function install(editor: NodeEditor) {
  console.log('Register Connections');
  editor.bind('connectionpath');
  editor.bind('connectiondrop');
  editor.bind('connectionpick');
  editor.bind('resetconnection');

  const picker = new Picker(editor);
  const flow = new Flow(picker);
  const socketsParams = new WeakMap<Element, FlowParams>();

  function pointerDown(this: HTMLElement, e: PointerEvent) {
    const flowParams = socketsParams.get(this);

    if (flowParams) {
      const { input, output } = flowParams;

      editor.view.container.dispatchEvent(new PointerEvent('pointermove', e));
      e.preventDefault();
      e.stopPropagation();
      flow.start({ input, output }, input || output);
    }
  }

  function pointerUp(this: Window, e: PointerEvent) {
    const flowEl = document.elementFromPoint(e.clientX, e.clientY);

    if (picker.io) {
      editor.trigger('connectiondrop', picker.io);
    }
    if (flowEl) {
      flow.complete(getMapItemRecursively(socketsParams, flowEl) || {});
    }
  }

  editor.on('resetconnection', () => flow.complete());

  editor.on('rendersocket', ({ el, input, output }) => {
    socketsParams.set(el, { input, output });

    el.removeEventListener('pointerdown', pointerDown);
    el.addEventListener('pointerdown', pointerDown);
  });

  window.addEventListener('pointerup', pointerUp);

  editor.on('renderconnection', ({ el, connection, points }) => {
    const d = renderPathData(editor, points, connection);

    renderConnection({ el, d, connection });
  });

  editor.on('updateconnection', ({ el, connection, points }) => {
    const d = renderPathData(editor, points, connection);

    updateConnection({ el, d });
  });

  editor.on('destroy', () => {
    window.removeEventListener('pointerup', pointerUp);
  });
}
