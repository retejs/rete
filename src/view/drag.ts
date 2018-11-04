export class Drag {

    mouseStart: any = null;

    constructor(public el: HTMLElement,
        public onTranslate = (a: number, b: number, e: any) => { },
        public onStart = (e: any) => { },
        public onDrag = (e: any) => { }
    ) {
        this.initEvents(el);
    }

    initEvents(el: HTMLElement) {
        el.addEventListener('mousedown', this.down.bind(this));
        window.addEventListener('mousemove', this.move.bind(this));
        window.addEventListener('mouseup', this.up.bind(this));

        el.addEventListener('touchstart', this.down.bind(this));
        window.addEventListener('touchmove', this.move.bind(this), {
            passive: false
        });
        window.addEventListener('touchend', this.up.bind(this));
    }

    getCoords(e: any) {
        const props = e.touches ? e.touches[0] : e;

        return [props.pageX, props.pageY];
    }

    down(e: any) {
        e.stopPropagation();
        this.mouseStart = this.getCoords(e);

        this.onStart(e);
    }

    move(e: Event) {
        if (!this.mouseStart) return;
        e.preventDefault();
        e.stopPropagation();

        let [x, y] = this.getCoords(e);
        let delta = [x - this.mouseStart[0], y - this.mouseStart[1]];
        let zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth;

        this.onTranslate(delta[0] / zoom, delta[1] / zoom, e);
    }

    up(e: any) {
        if (!this.mouseStart) return;

        this.mouseStart = null;
        this.onDrag(e);
    }
}