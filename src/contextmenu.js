import template from './templates/menu.pug';

export class ContextMenu {

    constructor(items: Object, searchBar: boolean = true) {
        this.visible = false;
        this.x = 0;
        this.y = 0;
        this.default = {
            items,
            searchBar,
            onClick() { throw new TypeError('onClick should be overrided');}
        };
        
        this.$cd = alight.ChangeDetector();
        this.$cd.scope.contextMenu = this;
        this.dom = d3.select('body').append('div');
        this.dom.node().setAttribute('tabindex', 1);
      
        this.dom.html(template());
        alight.bind(this.$cd, this.dom.node());
        
    }

    searchItems(filter: ?string) {
        var regex = new RegExp(filter, 'i'); 

        var items = Object.assign({}, this.items);

        Object.keys(items).forEach(key => {
            if (typeof items[key] !== 'function')
                items[key] = Object.assign({}, items[key]);
        });

        Object.keys(items).forEach(itemKey => {
            var itemObj = items[itemKey];

            if (typeof itemObj === 'function') return;    

            Object.keys(itemObj).forEach(subitem => {
                if (!regex.test(subitem))
                    delete itemObj[subitem];
            });

            if (Object.keys(itemObj).length === 0)
                delete items[itemKey];
        });

        return items;
    }

    isVisible() {
        return this.visible;
    }

    show(x: number, y: number, items: ?Object = null, searchBar: ?boolean = null, onClick = null) {
        this.visible = true;
        this.items = items || this.default.items;
        this.searchBar = searchBar || this.default.searchBar;
        this.onClick = onClick || this.default.onClick;
        this.x = x;
        this.y = y;
        this.$cd.scan();
    }

    hide() {
        this.visible = false;
        this.$cd.scan();
    }
}