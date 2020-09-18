import { NodeEditor } from '../../../naetverk/src';
import { install } from './index';

describe('Init', () => {
  describe('Background', () => {
    it('should init with a background', () => {
      const container = document.createElement('div');
      const editor = new NodeEditor('demo@0.2.0', container);
      const backgroundName = 'testBackground';
      install(editor, {
        background: backgroundName,
      });
      expect(container.children[0].children[0].className).toEqual(
        backgroundName + ' default'
      );
    });

    it('should init with no background', () => {
      const container = document.createElement('div');
      const editor = new NodeEditor('demo@0.2.0', container);
      install(editor, {
        background: false,
      });
      expect(container.children[0].children.length).toEqual(0);
    });
  });
});
