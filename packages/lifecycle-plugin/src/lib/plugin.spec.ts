import { NodeEditor } from '@naetverkjs/naetverk/src/index';
import { LifecyclePlugin } from './plugin';

describe('Init', () => {
  let editor: NodeEditor;

  beforeEach(() => {
    const container = document.createElement('div');
    editor = new NodeEditor('demo@0.2.0', container);
  });

  describe('Plugin can be installed', () => {
    it('should not have the event listeners when not initialized', () => {
      expect(editor.events.nodecreated.length).toEqual(0);
    });

    it('should have the event listeners when initialized', () => {
      editor.use(LifecyclePlugin);
      expect(editor.events.nodecreated.length).toEqual(1);
      expect(editor.events.noderemoved.length).toEqual(1);
      expect(editor.events.connectioncreate.length).toEqual(1);
      expect(editor.events.connectioncreated.length).toEqual(1);
      expect(editor.events.connectionremove.length).toEqual(1);
      expect(editor.events.connectionremoved.length).toEqual(1);
    });
  });
});
