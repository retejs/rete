import { Drag } from './drag';
import { Emitter } from '../core/emitter';
import { Zoom } from './zoom';

export class Area extends Emitter {

    constructor(container, emitter: Emitter) {
        super(emitter);
        
        const el = this.el = document.createElement('div');

        this.container = container;
        this.transform = { k: 1, x: 0, y: 0 };
        this.mouse = [0, 0];

        el.style.transformOrigin = '0 0';

        this._drag = new Drag(container, this.onTranslate.bind(this));
        this._zoom = new Zoom(container, el, 0.1, this.onZoom.bind(this));
        this.container.addEventListener('mousemove', this.mousemove.bind(this));

        this.update();
    }

    update() {
        const t = this.transform;

        this.el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.k})`;
    }

    mousemove(e) {
        const rect = this.el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const k = this.transform.k;
            
        this.trigger('mousemove', { x: x / k, y: y / k });
    }

    onTranslate(dx, dy) {
        this.translate(this.transform.x + dx, this.transform.y + dy)
    }

    onZoom(delta, ox, oy) {
        this.zoom(this.transform.k * (1 + delta), ox, oy);

        this.update();
    }

    translate(x, y) {
        if (!this.trigger('translate', { transform: this.transform, x, y })) return;

        this.transform.x = x;
        this.transform.y = y;

        this.update();
    }

    zoom(zoom, ox = 0, oy = 0) {
        if (!this.trigger('zoom', { transform: this.transform, zoom })) return;
        
        this.transform.k = zoom;
        this.transform.x += ox;
        this.transform.y += oy;
        
        this.update();
    }

    appendChild(el) {
        this.el.appendChild(el)
    }

    removeChild(el) {
        this.el.removeChild(el)
    }
}