export class Zoom {

    constructor(container, el, intensity, onzoom) {
        this.el = el;
        this.intensity = intensity;
        this.onzoom = onzoom;

        this.distance = null;

        container.addEventListener('wheel', this.wheel.bind(this));
        container.addEventListener('touchmove', this.move.bind(this));
        container.addEventListener('touchend', this.end.bind(this));
        container.addEventListener('touchcancel', this.end.bind(this));
        container.addEventListener('dblclick', this.dblclick.bind(this));
    }

    wheel(e) {
        e.preventDefault();
        
        var rect = this.el.getBoundingClientRect();
        var delta = (e.wheelDelta ? e.wheelDelta / 120 : - e.deltaY / 3) * this.intensity;

        var ox = (rect.left - e.clientX) * delta;
        var oy = (rect.top - e.clientY) * delta;

        this.onzoom(delta, ox, oy, 'wheel');
    }

    touches(e) {
        let [x1, y1] = [e.touches[0].clientX, e.touches[0].clientY];
        let [x2, y2] = [e.touches[1].clientX, e.touches[1].clientY];
        let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

        return {
            cx: (x1 + x2)/2,
            cy: (y1 + y2)/2,
            distance
        };
    }

    move(e) {
        if (e.touches.length < 2) return;
        
        let rect = this.el.getBoundingClientRect();
        let { cx, cy, distance } = this.touches(e);

        if (this.distance !== null) {
            let delta = distance / this.distance - 1;
    
            var ox = (rect.left - cx) * delta;
            var oy = (rect.top - cy) * delta;

            this.onzoom(delta, ox, oy, 'touch');
        }
        this.distance = distance;
    }

    end() {
        this.distance = null;
    }

    dblclick(e) {
        e.preventDefault();
        
        var rect = this.el.getBoundingClientRect();
        var delta = 4 * this.intensity;

        var ox = (rect.left - e.clientX) * delta;
        var oy = (rect.top - e.clientY) * delta;

        this.onzoom(delta, ox, oy, 'dblclick'); 
    }
}