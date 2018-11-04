import { Drag } from './drag';
import { Emitter } from '../core/emitter';
import { Zoom } from './zoom';

export class Area extends Emitter {

    el: any;
    transform = { k: 1, x: 0, y: 0 };
    mouse = { x: 0, y: 0 };
    _startPosition: any;
    _zoom: Zoom;
    _drag: Drag;

    constructor(public container: HTMLElement, emitter: Emitter) {
        super(emitter);

        const el = this.el = document.createElement('div');

        el.style.transformOrigin = '0 0';
        this._zoom = new Zoom(container, el, 0.1, this.onZoom.bind(this));
        this._drag = new Drag(container, this.onTranslate.bind(this), this.onStart.bind(this));
        this.container.addEventListener('mousemove', this.mousemove.bind(this));

        this.update();
    }

    update() {
        const t = this.transform;

        this.el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.k})`;
    }

    mousemove(e: MouseEvent) {
        const rect = this.el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const k = this.transform.k;

        this.mouse = { x: x / k, y: y / k };
        this.trigger('mousemove', { ...this.mouse });
    }

    onStart() {
        this._startPosition = { ...this.transform };
    }

    onTranslate(dx: number, dy: number) {
        this.translate(this._startPosition.x + dx, this._startPosition.y + dy)
    }

    onZoom(delta: number, ox: number, oy: number, source: any) {
        this.zoom(this.transform.k * (1 + delta), ox, oy, source);

        this.update();
    }

    translate(x: number, y: number) {
        const params = { transform: this.transform, x, y };

        if (!this.trigger('translate', params)) return;

        this.transform.x = params.x;
        this.transform.y = params.y;

        this.update();
        this.trigger('translated', null);
    }

    zoom(zoom: any, ox = 0, oy = 0, source: any) {
        const k = this.transform.k;
        const params = { transform: this.transform, zoom, source };

        if (!this.trigger('zoom', params)) return;

        const d = (k - params.zoom) / ((k - zoom) || 1);

        this.transform.k = params.zoom || 1;
        this.transform.x += ox * d;
        this.transform.y += oy * d;

        this.update();
        this.trigger('zoomed', { source });
    }

    appendChild(el: HTMLElement) {
        this.el.appendChild(el)
    }

    removeChild(el: HTMLElement) {
        this.el.removeChild(el)
    }
}