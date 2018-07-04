export class Drag {

    constructor(el, onTranslate = () => {}, onStart = () => {}, onDrag = () => {}) {
        this.mouseStart = null;

        this.el = el;
        this.onTranslate = onTranslate;
        this.onStart = onStart;
        this.onDrag = onDrag;

        this.initEvents(el);
    }

    initEvents(el) {
        el.addEventListener('mousedown', this.down.bind(this));
        window.addEventListener('mousemove', this.move.bind(this));
        window.addEventListener('mouseup', this.up.bind(this));

        el.addEventListener('touchstart', this.down.bind(this));
        window.addEventListener('touchmove', this.move.bind(this), {
            passive: false
        });
        window.addEventListener('touchend', this.up.bind(this));
    }

    getCoords(e) {
        const props = e.touches ? e.touches[0] : e;

        return [props.pageX, props.pageY];
    }

    down(e) {
        e.stopPropagation();
        this.mouseStart = this.getCoords(e);

        this.onStart();
    }

    move(e) {
        if (!this.mouseStart) return;
        e.preventDefault();
        e.stopPropagation();

        let [x, y] = this.getCoords(e);
        let delta = [x - this.mouseStart[0], y - this.mouseStart[1]];
        let zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth;

        this.mouseStart = [x, y];

        this.onTranslate(delta[0] / zoom, delta[1] / zoom);
    }

    up(e) {
        this.mouseStart = null;

        this.onDrag();
    }
}