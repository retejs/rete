export function Group(scope, el, expression, env) {
    var group = env.changeDetector.locals.group;
    var k = this.transform.k;

    d3.select(el).call(
        d3.drag().on('start', () => {
            this.editor.selectGroup(group);
        }).on('drag', () => {
            var dx = d3.event.dx / k;
            var dy = d3.event.dy / k;

            group.position[0] += dx;
            group.position[1] += dy;

            for (var i in group.nodes) {
                var node = group.nodes[i];

                node.position[0] += dx;
                node.position[1] += dy;
            }

            this.update();
        }).on('end', () => {
            this.editor.eventListener.trigger('change');
        })
    );
}

export function GroupHandler(scope, el, arg, env) {
    var group = env.changeDetector.locals.group;
    var mousePrev = null;

    d3.select(el).call(d3.drag().on('start', () => {
        mousePrev = d3.mouse(this.d3Container.node());
        this.editor.selectGroup(group);
    }).on('drag', () => {
        var zoom = d3.zoomTransform(this.dom);
        var mouse = d3.mouse(this.d3Container.node());
        var deltax = (mouse[0] - mousePrev[0]) / zoom.k;
        var deltay = (mouse[1] - mousePrev[1]) / zoom.k;
        var deltaw = Math.max(0, group.width - group.minWidth);
        var deltah = Math.max(0, group.height - group.minHeight);

        if (deltaw !== 0)
            mousePrev[0] = mouse[0];
        if (deltah !== 0)
            mousePrev[1] = mouse[1];

        if (arg.match('l')) {
            group.position[0] += Math.min(deltaw, deltax);
            group.setWidth(group.width - deltax);
        }
        else if (arg.match('r'))
            group.setWidth(group.width + deltax);

        if (arg.match('t')) {
            group.position[1] += Math.min(deltah, deltay);
            group.setHeight(group.height - deltay);
        }
        else if (arg.match('b'))
            group.setHeight(group.height + deltay);

        this.update();
    }).on('end', () => {
        this.editor.nodes.forEach(node => {
            if (group.isCoverNode(node))
                group.addNode(node);
            else
                group.removeNode(node);
        });

        this.editor.eventListener.trigger('change');
        this.update();
    }))
}

export function GroupTitle(scope, el, expression, env) {
    var group = env.changeDetector.locals.group;

    d3.select(el).on('click', () => {
        var title = prompt('Please enter title of the group', group.title);

        if (title !== null && title.length > 0)
            group.title = title;
        env.scan();
    });
}