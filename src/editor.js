import {Connection} from './connection';
import {ContextMenu} from './contextmenu';
import {Node} from './node';

export class NodeEditor {

    constructor(id, nodes, builders, event) {

        var self = this;

        this.event = event;
        this.active = nodes[0];
        this.nodes = nodes;
        this.builders = builders;

        this.pickedOutput = null;
        this.dom = null;

        this.dom = document.getElementById(id);
        this.dom.tabIndex = 1;

        var nodeNames = builders.map(function (e) {
            return e.name;
        });

        this.contextMenu = new ContextMenu(nodeNames, this.addNode.bind(this));
        this.svg = d3.select(this.dom);

        this.clickable = this.svg.append('rect')
            .attr('fill', 'transparent')
            .on('click', this.areaClick.bind(this));

        this.x = d3.scaleLinear();
        this.y = d3.scaleLinear();

        this.view = this.svg.append('g');

        this.zoom = d3.zoom()
            .scaleExtent([0.2, 1.5])
            .on('zoom', function () {
                self.view.attr('transform', d3.event.transform);
            });

        this.svg.call(this.zoom);

        this.valueline = d3.line()
            .curve(d3.curveBasis);

        d3.select(window)
            .on('keydown.' + id, self.keyDown.bind(this))
            .on('resize.' + id, function () {
                self.resize();
                self.update();
            });

        this.resize();
    }

    getConnectionData(c) {
        var distanceX = Math.abs(c.input.positionX() - c.output.positionX());
        var distanceY = c.input.positionY() - c.output.positionY();

        var p1 = [c.output.positionX(), c.output.positionY()];
        var p4 = [c.input.positionX(), c.input.positionY()];

        var p2 = [p1[0] + 0.01 + 0.4 * distanceX, p1[1] + 0.2 * distanceY];
        var p3 = [p4[0] - 0.01 - 0.4 * distanceX, p4[1] - 0.2 * distanceY];

        var points = [p1, p2, p3, p4];

        points.connection = c;
        return points;
    }

    resize() {
        var width = this.dom.parentElement.clientWidth;
        var height = this.dom.parentElement.clientHeight;

        this.svg.style('width', width + 'px')
            .style('height', height + 'px');

        this.clickable
            .attr('width', width + 20)
            .attr('height', height + 20);

        var size = (width + height); // Math.max(width,height);

        this.x.range([0, size]);
        this.y.range([0, size]);

        this.zoom.translateExtent([
            [-size, -size / 2],
            [size * 2, size]
        ]);
    }

    updateNodes() {
        var self = this;

        var rects = this.view
            .selectAll('rect.node')
            .data(this.nodes);

        rects.enter()
            .append('rect')
            .attr('class', 'node')
            .on('click', function (d) {
                self.selectNode(d);
            })
            .call(d3.drag().on('drag', function (d) {
                d3.select(this)
                    .attr('cx', d.position[0] += self.x.invert(d3.event.dx))
                    .attr('cy', d.position[1] += self.y.invert(d3.event.dy));
                self.update();
            }))
            .attr('rx', function () {
                return 8;
            })
            .attr('ry', function () {
                return 8;
            });

        rects.exit().remove();

        this.view.selectAll('rect.node')
            .attr('x', function (d) {
                return self.x(d.position[0]);
            })
            .attr('y', function (d) {
                return self.y(d.position[1]);
            })
            .attr('width', function (d) {
                return self.x(d.width);
            })
            .attr('height', function (d) {
                return self.y(d.height);
            })
            .attr('class', function (d) {
                return self.active === d ? 'node active' : 'node';
            });

        var titles = this.view
            .selectAll('text.title')
            .data(this.nodes);

        titles.enter()
            .append('text')
            .classed('title', true);

        titles.exit().remove();

        this.view.selectAll('text.title')
            .attr('x', function (d) {
                return self.x(d.position[0] + d.margin);
            })
            .attr('y', function (d) {
                return self.y(d.position[1] + d.margin + d.title.size);
            })
            .text(function (d) {
                return d.title.text;
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', function (d) {
                return self.x(d.title.size) + 'px';
            })
            .attr('fill', function (d) {
                return d.title.color;
            });

    }

    updateConnections() {

        var self = this;

        this.valueline
            .x(function (d) {
                return self.x(d[0]);
            })
            .y(function (d) {
                return self.y(d[1]);
            });

        var pathData = [];

        for (var i in this.nodes) {
            var outputs = this.nodes[i].outputs;

            for (var j in outputs) {
                var cons = outputs[j].connections;

                for (var k in cons)
                    pathData.push(this.getConnectionData(cons[k]));
            }
        }

        var path = this.view.selectAll('path')
            .data(pathData);

        path.exit().remove();

        var new_path = path.enter()
            .append('path')
            .on('click', function (d) {
                self.selectConnection(d.connection);
            })
            .each(function () {
                d3.select(this).moveToBack();
            });

        this.view.selectAll('path')
            .attr('d', this.valueline)
            .classed('edge', true)
            .attr('class', function (d) {
                var index = pathData.indexOf(d);

                return self.active === d.connection ? 'edge active' : 'edge';
            });
    }

    updateSockets() {
        var self = this;

        var groups = this.view
            .selectAll('g.gg')
            .data(this.nodes);

        var new_groups = groups.enter()
            .append('g')
            .classed('gg', true)

        groups.exit().remove();

        groups = new_groups.merge(groups);

        var inputs = groups.selectAll('circle.input')
            .data(function (d) {
                return d.inputs;
            });

        inputs.exit().remove();
        var new_inputs = inputs.enter()
            .append('circle');

        inputs = new_inputs.merge(inputs);

        inputs.attr('class', function (d) {
            return 'socket input ' + d.socket.id;
        });

        var outputs = groups.selectAll('circle.output')
            .data(function (d) {
                return d.outputs;
            });

        outputs.exit().remove();
        var new_outputs = outputs.enter()
            .append('circle');

        outputs = new_outputs.merge(outputs);

        outputs.attr('class', function (d) {
            return 'socket output ' + d.socket.id;
        });

        outputs.on('click', function (d) {
            self.pickedOutput = d;

        }).attr('cx', function (d) {
            return self.x(d.positionX());
        })
            .attr('cy', function (d) {
                return self.y(d.positionY());
            })
            .attr('r', function (d) {
                return self.x(d.socket.radius);
            })
            .append('title').text(function (d) {
                return d.socket.hint
            });

        inputs.on('click', function (input) {
            if (self.pickedOutput === null) return;

            try {
                self.pickedOutput.connectTo(input);
            } catch (e) {
                alert(e.message);
            }
            self.pickedOutput = null;
            self.update();

        }).attr('cx', function (d) {
            return self.x(d.positionX());
        })
            .attr('cy', function (d) {
                return self.y(d.positionY());
            })
            .attr('r', function (d) {
                return self.x(d.socket.radius);
            })
            .append('title').text(function (d) {
                return d.socket.hint
            });

    }

    updateControls() {
        var self = this;

        var groups = this.view
            .selectAll('g.controls')
            .data(this.nodes);    
        
        var newGroups = groups
            .enter()
            .append('g')
            .classed('controls', true);

        groups.exit().remove();

        groups = newGroups.merge(groups);

        var controls = groups.selectAll('foreignObject.control')
            .data(function (d) {
                return d.controls.map(function (control) {
                    return { control: control, node: d };
                });
            });

        controls.exit().remove();

        var newControls = controls.enter()
            .append('foreignObject').html(function (d) {
                return d.control.html;
            });
        
        controls = newControls.merge(controls);
        
        controls.attr('class', 'control');
        
        this.view.selectAll('foreignObject.control')
            .attr('x', function (d) {
                return self.x(d.control.margin + d.node.position[0]);
            })
            .attr('y', function (d) {

                var prevControlsHeight = 0;
                var l = d.node.controls.indexOf(d.control);

                for (var i = 0; i < l; i++)
                    prevControlsHeight += d.node.controls[i].height;

                return self.y(d.node.headerHeight() +
                    + d.node.outputsHeight()
                    + prevControlsHeight
                    + d.node.position[1]);
            })
            .attr('width', function (d) {
                return self.x(d.node.width - 2 * d.control.margin)
            })
            .attr('height', function (d) {
                return self.y(d.control.height);
            })
    }

    update() {
        this.updateConnections();
        this.updateNodes();
        this.updateSockets();
        this.updateControls();
    }

    areaClick() {
        if (this.contextMenu.isVisible())
            this.contextMenu.hide();
        else
            this.contextMenu.show(d3.event.clientX, d3.event.clientY);
    }

    addNode(builderName) {
        var builder = this.builders.find(function (builder) {
            return builder.name == builderName;
        });

        var pos = d3.mouse(this.view.node());
        var node = builder.build();

        node.position = [this.x.invert(pos[0]), this.y.invert(pos[1])];

        this.nodes.push(node);

        this.event.nodeCreated(node);
        this.selectNode(node);
    }

    keyDown() {
        if (this.dom !== document.activeElement)
            return;

        switch (d3.event.keyCode) {
        case 46:
            if (this.active instanceof Node)
                this.removeNode(this.active);
            else if (this.active instanceof Connection)
                this.removeConnection(this.active);

            this.update();
            break;
        case 27:

            break;
        }
    }

    removeNode(node) {
        var index = this.nodes.indexOf(node);

        this.nodes.splice(index, 1);
        node.remove();
        this.event.nodeRemoved(node);

        if (this.nodes.length > 0)
            this.selectNode(this.nodes[Math.max(0, index - 1)]);
        this.update();
    }

    removeConnection(connection) {
        connection.remove();
        this.event.connectionRemoved(connection);
        this.selectNode(this.nodes[0]);
    }

    selectNode(node) {
        if (this.nodes.indexOf(node) === -1) throw new Error('Node not exist in list');

        this.active = node;
        this.event.nodeSelected(node);
        this.update();
    }

    selectConnection(connection) {
        if (!(connection instanceof Connection)) throw new Error('Invalid instance');

        this.active = connection;
        this.event.connectionSelected(connection);
        this.update();
    }

    remove() {
        this.dom.remove();
    }
}