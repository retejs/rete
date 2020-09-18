import { ScaleExtent, TranslateExtent } from '@naetverkjs/area';

export class Restrictor {
  private editor: any;
  private readonly scaleExtent: ScaleExtent | false;
  private readonly translateExtent: TranslateExtent | false;

  constructor(editor, scaleExtent, translateExtent) {
    this.editor = editor;
    this.scaleExtent = scaleExtent;
    this.translateExtent = translateExtent;

    if (scaleExtent) {
      editor.on('zoom', this.restrictZoom.bind(this));
    }
    if (translateExtent) {
      editor.on('translate', this.restrictTranslate.bind(this));
    }
  }

  restrictZoom(data: {
    zoom: number;
    source: string;
    transform: { k: number; x: number; y: number };
  }) {
    const se =
      typeof this.scaleExtent === 'boolean'
        ? { min: 0.1, max: 1 }
        : this.scaleExtent;

    if (data.zoom < se.min) data.zoom = se.min;
    else if (data.zoom > se.max) data.zoom = se.max;
  }

  restrictTranslate(data) {
    const te =
      typeof this.translateExtent === 'boolean'
        ? { width: 5000, height: 4000 }
        : this.translateExtent;
    const { container } = this.editor.view;
    const k = data.transform.k;
    const [kw, kh] = [te.width * k, te.height * k];
    const cx = container.clientWidth / 2;
    const cy = container.clientHeight / 2;

    data.x -= cx;
    data.y -= cy;

    if (data.x > kw) data.x = kw;
    else if (data.x < -kw) data.x = -kw;

    if (data.y > kh) data.y = kh;
    else if (data.y < -kh) data.y = -kh;

    data.x += cx;
    data.y += cy;
  }
}
