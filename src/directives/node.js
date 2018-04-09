import * as d3 from 'd3';
import { Group } from '../group';

export function Node(scope, el, expression, env) {
    var node = env.changeDetector.locals.node;

    function setPosition(item, dx, dy) {
        const extent = this.editor.view.translateExtent;
        const minx = extent[0][0];
        const miny = extent[0][1];
        const maxx = extent[1][0];
        const maxy = extent[1][1];

        item.position[0] = Math.min(maxx, Math.max(minx, item.position[0] + dx));
        item.position[1] = Math.min(maxy, Math.max(miny, item.position[1] + dy));
    }
        
    node.el = el;
    env.watch('node.style', () => {
        Object.assign(el.style, node.style);
    }, { deep: true });
    
    d3.select(el).call(
        d3.drag().on('start', () => {
            d3.select(el).raise();
            if (!d3.event.sourceEvent.shiftKey)
                this.editor.selectNode(node, d3.event.sourceEvent.ctrlKey);
        }).on('drag', () => {
            if (this.editor.readOnly) return;
            
            var k = this.transform.k;            
            var dx = d3.event.dx / k;
            var dy = d3.event.dy / k;

            this.editor.selected.each(item => {
                setPosition.call(this, item, dx, dy);
            });

            this.editor.selected.eachGroup(item => {
                for (var i in item.nodes) {
                    let _node = item.nodes[i];

                    if (this.editor.selected.contains(_node))
                        continue;    

                    setPosition.call(this, _node, dx, dy);
                }
            });
            
            this.update();
        }).on('end', () => {
            this.editor.groups.forEach(group => {
                this.editor.selected.eachNode(_node => {
                    var contain = group.containNode(_node);
                    var cover = group.isCoverNode(_node);

                    if (contain && !cover)
                        group.removeNode(_node);
                    else if (!contain && cover)
                        group.addNode(_node);
                });
            });

            this.editor.eventListener.trigger('change');
            this.update();
        })
    );

    window.addEventListener('load', () => {
        node.width = el.offsetWidth;
        node.height = el.offsetHeight;
    });

    var items = {
        'Remove node': () => {
            this.editor.removeNode(node);
        },
        'Add to group': () => {
            var group = new Group('Group', {nodes:[node]});

            this.editor.addGroup(group);
        }
    };

    var onClick = (subitem) => {
        subitem.call(this);
        this.contextMenu.hide();
    }

    d3.select(el).on('contextmenu', () => {
        if (this.editor.readOnly) return;
        
        var x = d3.event.clientX;
        var y = d3.event.clientY;

        this.editor.selectNode(node);
        this.contextMenu.show(x, y, items, false, onClick);
        d3.event.preventDefault();
    });
}
