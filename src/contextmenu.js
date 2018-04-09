import * as alight from 'alight';
import * as d3 from 'd3';
import { declareMenuDirectives } from './directives/index';
import template from './templates/menu.pug';

export class ContextMenu {

    constructor(items: Object, searchBar: boolean = true, disabled = false) {
        this.visible = false;
        this.disabled = disabled;
        this.x = 0;
        this.y = 0;
        this.default = {
            items,
            searchBar,
            onClick() { throw new TypeError('onClick should be overrided');}
        };

        this.bindTemplate(template());
    }

    bindTemplate(t) {
        this.dom = d3.select('body').append('div');
        this.dom.node().setAttribute('tabindex', 1);
        this.dom.html(t);

        const alightInstance = alight.makeInstance();
        
        declareMenuDirectives(this, alightInstance);
        this.$cd = alightInstance(this.dom.node(), {contextMenu: this});
    }

    searchItems(filter: ?string) {
        var regex = new RegExp(filter, 'i'); 
        var items = {};

        Object.keys(this.items).forEach(key => {
            var item = this.items[key];

            if (item.constructor === Object) {
                var subitems = Object.keys(item).filter(subitem => regex.test(subitem))

                if (subitems.length > 0) {
                    items[key] = {};
                    subitems.forEach(sumitem => {
                        items[key][sumitem] = item[sumitem];
                    });
                }
            }
            
            if (regex.test(key))
                items[key] = item;
        });

        return items;
    }

    haveSubitems(item) {
        return item.constructor === Object;
    }

    isVisible() {
        return this.visible;
    }

    show(x: number, y: number, items: ?Object = null, searchBar: ?boolean = null, onClick = null) {
        if (this.disabled) return;
        
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