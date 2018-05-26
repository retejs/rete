export class Zoom {

    constructor(container, el, intensity, onzoom) {
        this.el = el;
        this.intensity = intensity;
        this.onzoom = onzoom;

        container.addEventListener('wheel', this.wheel.bind(this));
    }

    wheel(e) {
        e.preventDefault();

        var rect = this.el.getBoundingClientRect();
        var delta = e.wheelDelta / 120 * this.intensity;

        var ox = (rect.left - e.pageX) * delta;
        var oy = (rect.top - e.pageY) * delta;

        this.onzoom(delta, ox, oy);
    }

}