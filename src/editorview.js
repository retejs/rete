
import {Node} from './node';
import {Utils} from './utils';

export class EditorView {

    constructor(editor, container, template, menu) {

        this.editor = editor;
        this.pickedOutput = null;
        this.dom = container;
        this.dom.tabIndex = 1;
        this.svg = d3.select(this.dom);
        this.mouse = [0, 0];

        this.contextMenu = menu;
        this.contextMenu.onClick = (subitem) => {
            var result = subitem();

            if (result instanceof Node)
                this.editor.addNode(result, true);
            
            this.contextMenu.hide();
        };

        this.clickable = this.svg.append('rect')
            .attr('fill', 'transparent')
            .on('click', this.areaClick.bind(this));

        this.view = this.svg.append('g');
       
        this.zoom = d3.zoom()
            .on('zoom', () => {
                this.view.attr('transform', d3.event.transform);
            });
        
        this.svg.call(this.zoom);
            
        this.setScaleExtent(0.1, 1);
        var size = Math.pow(2, 12);

        this.setTranslateExtent(-size, -size, size, size);
        
        d3.select(window)
            .on('mousemove', () => {
                this.mouse = d3.mouse(this.view.node());
                this.update();
            })    
            .on('keydown.' + editor.id, (e) => {
                if (this.dom === document.activeElement)
                    editor.keyDown(e);
            })
            .on('resize.' + editor.id, this.resize.bind(this));
        
        this.$cd = alight.ChangeDetector();
        this.$cd.scope.editor = editor;

        this.declareDirectives();
        
        d3.text(template, (error, text) => {
            if (error) throw error;
            this.view.html(text);
            alight.bind(this.$cd, this.view.node());
            this.resize();
            editor.loaded = true;
            editor.eventListener.trigger('load');
        });
    }

    declareDirectives() {
        alight.directives.al.dragableNode = (scope, el, expression, env) => {
            var node = env.changeDetector.locals.node;
            var parent = el.parentNode;

            node.el = el;
            d3.select(el).call(d3.drag().on('start', () => {
                d3.select(parent).raise();
                this.editor.selectNode(node);
            }).on('drag', () => {
                node.position[0] += d3.event.dx;
                node.position[1] += d3.event.dy;
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
            }))
        };

        alight.directives.al.nodeLoad = (scope, el, expression, env) => {
            window.addEventListener('load', function () {
                var node = env.changeDetector.locals.node;

                node.width = el.offsetWidth;
                node.height = el.offsetHeight;
                env.scan();
            });  
        }

        alight.directives.al.dragableGroup = (scope, el, expression, env) => {
            var group = env.changeDetector.locals.group;

            d3.select(el).call(d3.drag().on('start', () => {
                this.editor.selectGroup(group);
            }).on('drag', () => {
                group.position[0] += d3.event.dx;
                group.position[1] += d3.event.dy;

                for (var i in group.nodes) {
                    var node = group.nodes[i];

                    node.position[0] += d3.event.dx;
                    node.position[1] += d3.event.dy;
                }

                this.update();
            }).on('end', () => {
                this.editor.eventListener.trigger('change');
            })
            );
        };

        alight.directives.al.dragableGroupHandler = (scope, el, arg, env) => {
            var group = env.changeDetector.locals.group;
            var mousePrev;

            d3.select(el).call(d3.drag().on('start', () => {
                mousePrev = d3.mouse(this.svg.node());
                this.editor.selectGroup(group);
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
                this.editor.nodes.forEach(node => {
                    if (group.isCoverNode(node))
                        group.addNode(node);
                    else
                        group.removeNode(node);
                });

                this.editor.eventListener.trigger('change');
                this.update();
            }))
        };
        
        alight.directives.al.groupTitleClick = (scope, el, expression, env) => {
            var group = env.changeDetector.locals.group;

            d3.select(el).on('click', () => {
                var title = prompt('Please enter title of the group', group.title);

                if (title !== null && title.length > 0)
                    group.title = title;
                env.scan();
            });
        };
        
        alight.directives.al.pickInput = (scope, el, expression, env) => {
            var input = env.changeDetector.locals.input;

            input.el = el;

            d3.select(el).on('mousedown', () => {
                d3.event.preventDefault();
                if (this.pickedOutput === null) {
                    if (input.hasConnection()) {
                        this.pickedOutput = input.connections[0].output;
                        this.editor.removeConnection(input.connections[0]);
                    }
                    this.update();
                    return;
                }
                    
                if (!input.multipleConnections && input.hasConnection())
                    this.editor.removeConnection(input.connections[0]);
                else if (this.pickedOutput.connectedTo(input)) {
                    var connections = input.connections.filter(c => c.output === this.pickedOutput);

                    this.editor.removeConnection(connections[0]);
                }
                
                this.editor.connect(this.pickedOutput, input);

                this.pickedOutput = null;
                this.update();
            });     
        }

        alight.directives.al.pickOutput = (scope, el, expression, env) => {
            var output = env.changeDetector.locals.output;

            output.el = el;

            d3.select(el).on('mousedown', () => {
                this.pickedOutput = output;
            });
        }

        alight.directives.al.control = (scope, el, expression, env) => {
            var locals = env.changeDetector.locals;
            var control = expression.split('.').reduce((o, i) => o[i], locals);

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

        this.update();
    }

    updateConnections() {
        var pathData = [];

        for (var i in this.editor.nodes) {
            var outputs = this.editor.nodes[i].outputs;

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

        this.editor.paths = pathData;
    }

    update() {
        this.updateConnections();
        this.$cd.scan();
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

    setScaleExtent(scaleMin, scaleMax) {
        this.zoom.scaleExtent([scaleMin, scaleMax]);
    }

    setTranslateExtent(left, top, right, bottom) {
        this.zoom.translateExtent([[left, top], [right, bottom]]);
    }   
}