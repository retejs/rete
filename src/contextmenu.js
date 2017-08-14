export class ContextMenu {

    constructor(template, items) {
        this.visible = false;
        this.x = 0;
        this.y = 0;
        this.items = items;
        
        this.$cd = alight.ChangeDetector();
        this.$cd.scope.contextMenu = this;

        d3.text(template, (error, text) => {
            if (error) throw error;
            var dom = d3.select('body').append('div');

            dom.html(text);
            alight.bind(this.$cd, dom.node());
        });
    }

    onCilck(subitem) {
        throw new TypeError('onClick should be overrided');
    }

    isVisible() {
        return this.visible;
    }

    show(x, y) {
        this.visible = true;
        this.x = x;
        this.y = y;
        this.$cd.scan();
    }

    hide() {
        this.visible = false;
        this.$cd.scan();
    }
}