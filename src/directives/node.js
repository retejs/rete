export function Node(scope, el, expression, env) {
    var node = env.changeDetector.locals.node;

    node.el = el;

    d3.select(el).call(
        d3.drag().on('start', () => {
            d3.select(el).raise();
            this.editor.selectNode(node);
        }).on('drag', () => {
            var k = this.transform.k;            
            var dx = d3.event.dx / k;
            var dy = d3.event.dy / k;

            node.position[0] += dx;
            node.position[1] += dy;
            this.update();
        }).on('end', () => {
            this.editor.groups.forEach(group => {
                var contain = group.containNode(node);
                var cover = group.isCoverNode(node);

                if (contain && !cover)
                    group.removeNode(node);
                else if (!contain && cover)
                    group.addNode(node);
            });

            this.editor.eventListener.trigger('change');
            this.update();
        })
    );

    window.addEventListener('load', () => {
        node.width = el.offsetWidth;
        node.height = el.offsetHeight;
    });
}
