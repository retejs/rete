import { NodeEditor } from '@naetverkjs/naetverk/src/index';
import { Restrictor } from './restrictor';

describe('Restrict', () => {
  it('should register restrict zoom', () => {
    const container = document.createElement('div');
    const editor = new NodeEditor('demo@0.2.0', container);
    const restrictor = new Restrictor(editor, true, true);
    let data = { x: 2, y: 1, transform: { k: 3 } };
    restrictor.restrictTranslate(data);
    expect(editor.events.translate.length).toEqual(1);
  });

  it('should noz register restrict zoom', () => {
    const container = document.createElement('div');
    const editor = new NodeEditor('demo@0.2.0', container);
    const restrictor = new Restrictor(editor, true, false);
    let data = { x: 2, y: 1, transform: { k: 3 } };
    restrictor.restrictTranslate(data);
    expect(editor.events.translate.length).toEqual(0);
  });
});
