import { Background } from './background';
import { AreaOptions } from './interfaces/area-options.interface';
import { Restrictor } from './restrictor';
import { SnapGrid } from './snap';

export function install(editor, params: AreaOptions) {
  const background = params.background || false;
  const snap = params.snap || false;
  const scaleExtent = params.scaleExtent || false;
  const translateExtent = params.translateExtent || false;

  if (background) {
    this._background = new Background(editor, background);
  }
  if (scaleExtent || translateExtent) {
    this._restrictor = new Restrictor(editor, scaleExtent, translateExtent);
  }
  if (snap) {
    this._snap = new SnapGrid(editor, snap);
  }
}
