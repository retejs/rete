import {Group} from './group';
import {Node} from './node';
import {Utils} from './utils';

export class NodeEditor {

    constructor(id, container, template, builder, menu, event) {

        if (!Utils.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');  
        
        this.id = id;
        this.builder = builder;
        this.event = event;
        this.active = null;
        this.nodes = [];
        this.groups = [];
     
        this.pickedOutput = null;
        this.dom = container;
        this.dom.tabIndex = 1;
        this.svg = d3.select(this.dom);
        this.loaded = false;   
        this.mouse = [0, 0];

        this.contextMenu = menu;
        this.contextMenu.onClick = (subitem) => {
            var result = subitem();

            if (result instanceof Node)
                this.addNode(result, true);
            
            this.contextMenu.hide();
        };

        this.clickable = this.svg.append('rect')
            .attr('fill', 'transparent')
            .on('click', this.areaClick.bind(this));

        this.view = this.svg.append('g');
       
        this.zoom = d3.zoom()
            .scaleExtent([0.2, 1.5])
            .on('zoom', () => {
                this.view.attr('transform', d3.event.transform);
            });

        this.svg.call(this.zoom);

        d3.select(window)
            .on('mousemove', () => {
                this.mouse = d3.mouse(this.view.node());
                this.update();
            })    
            .on('keydown.' + id, this.keyDown.bind(this))
            .on('resize.' + id, this.resize.bind(this));
        
        this.$scope = alight.Scope();
        this.$scope.editor = this;

        this.declareDirectives();
        
        d3.text(template, (error, text) => {
            if (error) throw error;
            this.view.html(text);
            alight.applyBindings(this.$scope, this.view.node());
            this.resize();
            this.loaded = true;
            this.onload();
        });
        
    }

    onload() {
        
    }

    updateNodeSize(scope) {
        scope.node.width = scope.node.el.offsetWidth;
        scope.node.height = scope.node.el.offsetHeight;
    }

    declareDirectives() {
        alight.directives.al.dragableNode = (scope, el) => {
            var node = scope.node;
            var parent = el.parentNode;

            node.el = el;
            d3.select(el).call(d3.drag().on('start', () => {
                d3.select(parent).raise();
                this.selectNode(node);
            }).on('drag', () => {
                node.position[0] += d3.event.dx;
                node.position[1] += d3.event.dy;
                this.update();
            }).on('end', () => {
                this.groups.forEach(group => {
                    var contain = group.containNode(node);
                    var cover = group.isCoverNode(node);
                    
                    if (contain && !cover)
                        group.removeNode(node);
                    else if (!contain && cover)
                        group.addNode(node);
                });
                this.update();
            }))
        };

        alight.directives.al.dragableGroup = (scope, el) => {
            var group = scope.group;

            d3.select(el).call(d3.drag().on('start', () => {
                this.selectGroup(group);
            }).on('drag', () => {
                group.position[0] += d3.event.dx;
                group.position[1] += d3.event.dy;

                for (var i in group.nodes) {
                    var node = group.nodes[i];

                    node.position[0] += d3.event.dx;
                    node.position[1] += d3.event.dy;
                }

                this.update();
            }));
        };

        alight.directives.al.dragableGroupHandler = (scope, el, arg) => {
            var group = scope.group;
            var mousePrev;

            d3.select(el).call(d3.drag().on('start', () => {
                mousePrev = d3.mouse(this.svg.node());
                this.selectGroup(group);
            }).on('drag', () => {
                var zoom = d3.zoomTransform(this.dom);
                var mouse = d3.mouse(this.svg.node());
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
                this.nodes.forEach(node => {
                    if (group.isCoverNode(node))
                        group.addNode(node);
                    else
                        group.removeNode(node);
                        
                });
                this.update();
            }))
        };

        alight.directives.al.svgBack = (scope, el) => {
            d3.select(el).lower();
            scope.$scan();
        }

        alight.directives.al.groupTitleClick = (scope, el) => {
            var group = scope.group;

            d3.select(el).on('click', () => {
                var title = prompt('Please enter title of the group', group.title);

                if (title !== null && title.length > 0)
                    group.title = title;
                scope.$scan();
            });
        };
        
        alight.directives.al.pickInput = (scope, el) => {
            var input = scope.input;

            input.el = el;

            d3.select(el).on('mousedown', () => {
                d3.event.preventDefault();
                if (this.pickedOutput === null) {
                    if (input.hasConnection()) {
                        this.pickedOutput = input.connections[0].output;
                        this.removeConnection(input.connections[0]);
                    }
                    this.update();
                    return;
                }
                    
                if (!input.multipleConnections && input.hasConnection())
                    this.removeConnection(input.connections[0]);
                else if (this.pickedOutput.connectedTo(input)) {
                    var connections = input.connections.filter(c => c.output === this.pickedOutput);

                    this.removeConnection(connections[0]);
                }
                
                this.connect(this.pickedOutput, input);

                this.pickedOutput = null;
                this.update();
            });     
        }

        alight.directives.al.pickOutput = (scope, el) => {
            var output = scope.output;

            output.el = el;

            d3.select(el).on('mousedown', () => {
                this.pickedOutput = output;
            });
        }

        alight.directives.al.control = (scope, el, obj) => {
            var control = obj.split('.').reduce((o, i) => o[i], scope);

            el.innerHTML = control.html;
            control.handler(el.children[0], control);
        };
    }

    getConnectionPathData(connection, x1, y1, x2, y2) {
        var distanceX = Math.abs(x1-x2);
        var distanceY = y2-y1;

        var p1 = [x1, y1];
        var p4 = [x2, y2];

        var p2 = [x1 + 0.3 * distanceX, y1 + 0.1 * distanceY];
        var p3 = [x2 - 0.3 * distanceX, y2 - 0.1 * distanceY];

        var points = [p1, p2, p3, p4];

        var curve = d3.curveBasis(d3.path());

        curve.lineStart();
        for (var i = 0; i < points.length;i++) {
            var point = points[i];

            curve.point(point[0], point[1]);
        }
        curve.lineEnd();
        var d = curve._context.toString();

        return d;
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

        this.zoom.translateExtent([
            [-size, -size / 2],
            [size * 2, size]
        ]);

        this.update();
    }

    updateConnections() {
        var pathData = [];

        for (var i in this.nodes) {
            var outputs = this.nodes[i].outputs;

            for (var j in outputs) {
                var cons = outputs[j].connections;

                for (var k in cons) {
                    if (!cons[k].input.el) break;
                    let input = cons[k].input;
                    let output = cons[k].output;
                    
                    pathData.push({
                        d: this.getConnectionPathData(cons[k],
                            output.node.position[0] + output.el.offsetLeft + output.el.offsetWidth / 2,
                            output.node.position[1] + output.el.offsetTop + output.el.offsetHeight / 2,
                            input.node.position[0] + input.el.offsetLeft + input.el.offsetWidth / 2,
                            input.node.position[1] + input.el.offsetTop + input.el.offsetHeight / 2)
                    });
                }
            }
        }
        
        if (this.pickedOutput !== null) {
            if (!this.pickedOutput.el) return;
            let output = this.pickedOutput;
            let input = this.mouse;

            pathData.push({
                active: true, d: this.getConnectionPathData(null,
                    output.node.position[0] + output.el.offsetLeft + output.el.offsetWidth / 2,
                    output.node.position[1] + output.el.offsetTop + output.el.offsetHeight / 2,
                    input[0],
                    input[1])
            });
        }  

        this.paths = pathData;
    }

    update() {
        this.updateConnections();
        this.$scope.$scan();
    }

    areaClick() {
        if (this.pickedOutput !== null)
        {
            this.pickedOutput = null;
            this.update();
            return;
        }    
        
        this.contextMenu.show(d3.event.clientX - 20, d3.event.clientY - 20);
        this.update();
    }

    addNode(node, mousePlaced = false) {
        if (!(node instanceof Node))
            throw new Error('Wrong instance');
        
        if (mousePlaced)
            node.position = this.mouse;
        this.nodes.push(node);
        this.selectNode(node);

        this.event.nodeCreated(node);
    }

    addGroup(group) {
        this.groups.push(group);
        this.update();

        this.event.groupCreated(group);
    }

    keyDown() {
        if (this.dom !== document.activeElement)
            return;

        switch (d3.event.keyCode) {
        case 46:
            if (this.active instanceof Node)        
                this.removeNode(this.active);
            else if (this.active instanceof Group)      
                this.removeGroup(this.active);
            this.update();
            break;
        case 71:
            if (!(this.active instanceof Node)) {
                alert('Select the node for adding to group'); return;
            }
            var group = new Group('Group', {nodes:[this.active]});    

            this.addGroup(group);   
            break;
        }
    }

    removeNode(node) {
        var index = this.nodes.indexOf(node);

        this.nodes.splice(index, 1);
        node.remove();

        if (this.nodes.length > 0)
            this.selectNode(this.nodes[Math.max(0, index - 1)]);
        this.update();

        this.event.nodeRemoved(node);
    }

    removeGroup(group) {
        group.remove();
        this.groups.splice(this.groups.indexOf(group), 1);
        this.update();

        this.event.groupRemoved(group);
    }

    connect(output, input) {
        try {
            var connection = output.connectTo(input);

        } catch (e) {
            console.error(e);
            alert(e.message);
        }

        this.event.connectionCreated(connection);
    }

    removeConnection(connection) {
        connection.remove();
        this.event.connectionRemoved(connection);
    }

    selectNode(node) {
        if (this.nodes.indexOf(node) === -1)
            throw new Error('Node not exist in list');

        this.active = node;
        this.update();

        this.event.nodeSelected(node);
    }

    selectGroup(group) {
        this.active = group;
        this.update();

        this.event.groupSelected(group);
    }

    zoomAt(nodes) {
        var bbox = Utils.nodesBBox(nodes);
        var scalar = 0.9;
        var kh = this.dom.clientHeight/Math.abs(bbox.top - bbox.bottom);
        var kw = this.dom.clientWidth/Math.abs(bbox.left - bbox.right);
        var k = Math.min(kh, kw, 1);
        var cx = (bbox.left + bbox.right) / 2;
        var cy = (bbox.top + bbox.bottom) / 2;

        this.zoom.translateTo(this.svg, cx, cy);
        this.zoom.scaleTo(this.svg, scalar * k);
    }

    toJSON() {
        var nodes = {};
        var groups = {};

        this.nodes.forEach(node => nodes[node.id] = node.toJSON());
        this.groups.forEach(group => groups[group.id] = group.toJSON());

        return {
            'id': this.id,
            'nodes': nodes,
            'groups': groups
        };
    }

    fromJSON(json) {
        this.nodes.splice(0, this.nodes.length);
        this.groups.splice(0, this.groups.length);

        var nodes = {};
        
        Object.keys(json.nodes).forEach(id => {
            var node = json.nodes[id];

            nodes[id] = Node.fromJSON(this.builder[node.title.toLowerCase()], node);
            this.addNode(nodes[id]);
        });
        
        Object.keys(json.nodes).forEach(id => {
            var jsonNode = json.nodes[id];
            var node = nodes[id];
                
            jsonNode.outputs.forEach((outputJson, i) => {
                outputJson.connections.forEach(jsonConnection => {
                    var nodeId = jsonConnection.node;
                    var inputIndex = jsonConnection.input;
                    var targetInput = nodes[nodeId].inputs[inputIndex];

                    this.connect(node.outputs[i], targetInput);
                });
            });

        });  

        Object.keys(json.groups).forEach(id => {
            var group = Group.fromJSON(json.groups[id]);

            json.groups[id].nodes.forEach(nodeId => {
                var node = nodes[nodeId];

                group.addNode(node);
            })
            this.addGroup(group);
        });
        this.update();
    }
}