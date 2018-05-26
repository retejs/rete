export class Drag {

    constructor(el, onTranslate = () => { }, onStart = () => { }, onDrag = () => { }) {
        this.mouseStart = null;

        this.el = el;
        this.onTranslate = onTranslate;
        this.onStart = onStart;
        this.onDrag = onDrag;

        el.addEventListener('mousedown', this.mousedown.bind(this));
        window.addEventListener('mousemove', this.mousemove.bind(this));
        window.addEventListener('mouseup', this.mouseup.bind(this));
    }

    mousedown(e) {
        e.stopPropagation();
        this.mouseStart = [e.pageX, e.pageY];

        this.onStart();
    }

    mousemove(e) {
        if (!this.mouseStart) return;
        e.preventDefault();
        
        let delta = [e.pageX - this.mouseStart[0], e.pageY - this.mouseStart[1]];
        let zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth;

        this.mouseStart = [e.pageX, e.pageY];

        this.onTranslate(delta[0] / zoom, delta[1] / zoom);
    }

    mouseup(e) {
        this.mouseStart = null;
        
        this.onDrag();
    }
}