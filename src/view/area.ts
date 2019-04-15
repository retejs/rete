import { Drag } from './drag';
import { Emitter } from '../core/emitter';
import { EventsTypes } from '../events';
import { Zoom } from './zoom';

export interface Transform { k: number; x: number; y: number }
export interface Mouse { x: number; y: number }
export type ZoomSource = 'wheel' | 'touch' | 'dblclick';

export class Area extends Emitter<EventsTypes> {

    el: HTMLElement;
    container: HTMLElement;
    transform: Transform = { k: 1, x: 0, y: 0 };
    mouse: Mouse = { x: 0, y: 0 }

    private _startPosition: any = null

    constructor(container: HTMLElement, emitter: Emitter<EventsTypes>) {
        super(emitter);
        
        const el = this.el = document.createElement('div');

        this.container = container;
        el.style.transformOrigin = '0 0';

        new Zoom(container, el, 0.1, this.onZoom.bind(this));
        new Drag(container, this.onTranslate.bind(this) as any, this.onStart.bind(this));
        this.container.addEventListener('pointermove', this.pointermove.bind(this));

        this.update();
    }

    update() {
        const t = this.transform;

        this.el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.k})`;
    }

    pointermove(e: PointerEvent) {
        const { clientX, clientY } = e;
        const rect = this.el.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const k = this.transform.k;
        
        this.mouse = { x: x / k, y: y / k };
        this.trigger('mousemove', { ...this.mouse }); // TODO rename on `pointermove`
    }

    onStart() {
        this._startPosition = { ...this.transform };
    }

    onTranslate(dx: number, dy: number) {
        this.translate(this._startPosition.x + dx, this._startPosition.y + dy)
    }

    onZoom(delta: number, ox: number, oy: number, source: ZoomSource) {
        this.zoom(this.transform.k * (1 + delta), ox, oy, source);

        this.update();
    }

    translate(x: number, y: number) {
        const params = { transform: this.transform, x, y };

        if (!this.trigger('translate', params)) return;

        this.transform.x = params.x;
        this.transform.y = params.y;

        this.update();
        this.trigger('translated');
    }

    zoom(zoom: number, ox = 0, oy = 0, source: ZoomSource) {
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