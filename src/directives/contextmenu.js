import * as d3 from 'd3';

export function Item(scope, el, expression, env) {
    var l = env.changeDetector.locals;
    var item = l.subitem || l.item;
    var haveSubitems = item.constructor === Object;

    d3.select(el)
        .on('click', () => {
            if (!haveSubitems)
                this.onClick(item);
            d3.event.stopPropagation();
        })
        .classed('have-subitems', haveSubitems);
}