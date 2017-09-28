export function Item(scope, el, expression, env) {
    var l = env.changeDetector.locals;
    var item = l.subitem || l.item;
    var isFunc = typeof item === 'function';

    d3.select(el)
        .on('click', () => {
            if (isFunc)
                this.onClick(item);
            d3.event.stopPropagation();
        })
        .classed('have-subitems', !isFunc);
}