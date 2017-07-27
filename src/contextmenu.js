export class ContextMenu {

    constructor(template, items) {
        this.visible = false;
        this.x = 0;
        this.y = 0;
        this.items = items;
        
        this.$scope = alight.Scope();
        this.$scope.contextMenu = this;

        d3.text(template, (error, text) => {
            if (error) throw error;
            var dom = d3.select('body').append('div');

            dom.html(text);
            alight.applyBindings(this.$scope, dom.node());
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
        this.$scope.$scan();
    }

    hide() {
        this.visible = false;
        this.$scope.$scan();
    }
}