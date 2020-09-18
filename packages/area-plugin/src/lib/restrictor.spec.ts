import { NodeEditor } from '@naetverkjs/naetverk/src/index';
import { Restrictor } from './restrictor';

describe('Restrict', () => {
  let editor: NodeEditor;

  beforeEach(() => {
    const container = document.createElement('div');
    editor = new NodeEditor('demo@0.2.0', container);
  });

  it('should register restrict translation', () => {
    const restrictor = new Restrictor(editor, false, true);
    const data = { x: 2, y: 1, transform: { k: 3 } };
    restrictor.restrictTranslate(data);
    expect(editor.events.translate.length).toEqual(1);
  });

  it('should not register restrict translation', () => {
    const restrictor = new Restrictor(editor, false, false);
    const data = { x: 2, y: 1, transform: { k: 3 } };
    restrictor.restrictTranslate(data);
    expect(editor.events.translate.length).toEqual(0);
  });

  it('should register restrict zoom', () => {
    const restrictor = new Restrictor(editor, true, false);
    const data = {
      zoom: 10,
      source: 'scroll',
      transform: { k: 2, x: 12, y: 43 },
    };

    restrictor.restrictZoom(data);
    expect(editor.events.zoom.length).toEqual(1);
  });

  it('should not register restrict zoom', () => {
    const restrictor = new Restrictor(editor, false, false);
    const data = {
      zoom: 10,
      source: 'scroll',
      transform: { k: 2, x: 12, y: 43 },
    };
    restrictor.restrictZoom(data);
    expect(editor.events.zoom.length).toEqual(0);
  });
});
