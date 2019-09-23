import { listenWindow } from './utils';

interface DeltaWheelEvent { wheelDelta: number }

export class Zoom {

    el: HTMLElement;
    intensity: number;
    onzoom: Function;
    previous: { cx: number; cy: number; distance: number } | null = null;

    pointers: PointerEvent[] = [];
    destroy: () => void;

    constructor(container: HTMLElement, el: HTMLElement, intensity: number, onzoom: Function) {
        this.el = el;
        this.intensity = intensity;
        this.onzoom = onzoom;

        container.addEventListener('wheel', this.wheel.bind(this));
        container.addEventListener('pointerdown', this.down.bind(this));
        container.addEventListener('dblclick', this.dblclick.bind(this));

        const destroyMove = listenWindow('pointermove', this.move.bind(this));
        const destroyUp = listenWindow('pointerup', this.end.bind(this));
        const destroyCancel = listenWindow('pointercancel', this.end.bind(this));

        this.destroy = () => { destroyMove(); destroyUp(); destroyCancel(); }
    }

    get translating() { // is translating while zoom (works on multitouch)
        return this.pointers.length >= 2;
    }

    wheel(e: WheelEvent) {
        e.preventDefault();
        
        const rect = this.el.getBoundingClientRect();
        const wheelDelta = (e as unknown as DeltaWheelEvent).wheelDelta;
        const delta = (wheelDelta ? wheelDelta / 120 : - e.deltaY / 3) * this.intensity;

        const ox = (rect.left - e.clientX) * delta;
        const oy = (rect.top - e.clientY) * delta;

        this.onzoom(delta, ox, oy, 'wheel');
    }

    touches() {
        let e = { touches: this.pointers }
        let [x1, y1] = [e.touches[0].clientX, e.touches[0].clientY];
        let [x2, y2] = [e.touches[1].clientX, e.touches[1].clientY];

        let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

        return {
            cx: (x1 + x2)/2,
            cy: (y1 + y2)/2,
            distance
        };
    }

    down(e: PointerEvent) {
        this.pointers.push(e);
    }

    move(e: PointerEvent) {
        this.pointers = this.pointers.map(p => p.pointerId === e.pointerId ? e : p)
        if (!this.translating) return;

        let rect = this.el.getBoundingClientRect();

        let { cx, cy, distance } = this.touches();

        if (this.previous !== null) {
            let delta = distance / this.previous.distance - 1;
    
            const ox = (rect.left - cx) * delta;
            const oy = (rect.top - cy) * delta;

            this.onzoom(delta, ox - (this.previous.cx - cx), oy - (this.previous.cy - cy), 'touch');
        }
        this.previous = { cx, cy, distance };
    }

    end(e: PointerEvent) {
        this.previous = null;
        this.pointers = this.pointers.filter(p => p.pointerId !== e.pointerId)
    }

    dblclick(e: MouseEvent) {
        e.preventDefault();
        
        const rect = this.el.getBoundingClientRect();
        const delta = 4 * this.intensity;

        const ox = (rect.left - e.clientX) * delta;
        const oy = (rect.top - e.clientY) * delta;

        this.onzoom(delta, ox, oy, 'dblclick'); 
    }
}