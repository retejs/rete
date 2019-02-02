export class Drag {

    constructor(el, onTranslate = () => {}, onStart = () => {}, onDrag = () => {}) {
        this.pointerStart = null;

        this.el = el;
        this.onTranslate = onTranslate;
        this.onStart = onStart;
        this.onDrag = onDrag;

        this.initEvents(el);
    }

    initEvents(el) {
        el.style.touchAction = 'none';

        el.addEventListener('pointerdown', this.down.bind(this));
        window.addEventListener('pointermove', this.move.bind(this));
        window.addEventListener('pointerup', this.up.bind(this));
    }

    down(e) {
        e.stopPropagation();
        this.pointerStart = [e.pageX, e.pageY]

        this.onStart(e);
    }

    move(e) {
        if (!this.pointerStart) return;
        e.preventDefault();

        let [x, y] = [e.pageX, e.pageY]
        let delta = [x - this.pointerStart[0], y - this.pointerStart[1]];
        let zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth;

        this.onTranslate(delta[0] / zoom, delta[1] / zoom, e);
    }

    up(e) {
        if (!this.pointerStart) return;
        
        this.pointerStart = null;
        this.onDrag(e);
    }
}