import { ContextMenu } from './contextmenu';
import { Node } from './node';
import { NodeEditor } from './editor';
import { Utils } from './utils';

const zoomMargin = 0.9;

export class EditorView {

    constructor(editor: NodeEditor, container: HTMLElement, template: string, menu: ContextMenu) {
        this.editor = editor;
        this.pickedOutput = null;
        this.dom = container;
        this.dom.tabIndex = 1;
        this.d3Container = d3.select(this.dom);
        this.mouse = [0, 0];
        this.transform = d3.zoomIdentity;

        this.contextMenu = menu;
        this.contextMenu.onClick = (subitem) => {
            var result = subitem();

            if (result instanceof Node)
                this.editor.addNode(result, true);

            this.contextMenu.hide();
        };

        this.d3Container
            .on('click', () => {
                if (this.d3Container.node() === d3.event.target)
                    this.areaClick()
            });

        this.view = this.d3Container.append('div')
            .style('transform-origin', '0 0')
            .style('width', 1)
            .style('height', 1);

        this.zoom = d3.zoom()
            .on('zoom', () => {
                var t = this.transform = d3.event.transform;
                var style = `translate(${t.x}px, ${t.y}px) scale(${t.k})`;

                this.view.style('transform', style);
            });

        this.d3Container.call(this.zoom);

        this.setScaleExtent(0.1, 1);
        var size = Math.pow(2, 12);

        this.setTranslateExtent(-size, -size, size, size);

        d3.select(window)
            .on('mousemove', () => {
                var k = this.transform.k;
                var position = d3.mouse(this.view.node());

                this.mouse = [position[0]/k, position[1]/k];
                
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
            editor.eventListener.trigger('load');
        });
    }

    declareDirectives() {
        alight.directives.al.dragableNode = (scope, el, expression, env) => {
            var node = env.changeDetector.locals.node;
            
            node.el = el;
            d3.select(el).call(d3.drag().on('start', () => {
                d3.select(el).raise();
                this.editor.selectNode(node);
            }).on('drag', () => {
                var dx = d3.event.dx / this.transform.k;
                var dy = d3.event.dy / this.transform.k;

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
            }))
        };

        alight.directives.al.nodeLoad = (scope, el, expression, env) => {
            window.addEventListener('load', () => {
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
                var dx = d3.event.dx / this.transform.k;
                var dy = d3.event.dy / this.transform.k;

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
        };

        alight.directives.al.dragableGroupHandler = (scope, el, arg, env) => {
            var group = env.changeDetector.locals.group;
            var mousePrev;

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

    resize() {
        var width = this.dom.parentElement.clientWidth;
        var height = this.dom.parentElement.clientHeight;

        this.d3Container.style('width', width + 'px')
            .style('height', height + 'px');

        this.update();
    }

    updateConnections() {
        var pathData = [];

        this.editor.nodes.forEach(node => {
            node.outputs.forEach(output => {
                output.connections.forEach(connection => {
                    let input = connection.input;

                    if (input.el)
                        pathData.push({
                            d: Utils.getConnectionPath(
                                ...Utils.getOutputPosition(output),
                                ...Utils.geInputPosition(input)
                            )
                        });
                });
            });
        });

        if (this.pickedOutput !== null) {
            if (!this.pickedOutput.el) return;
            let output = this.pickedOutput;
            let input = this.mouse;

            pathData.push({
                active: true,
                d: Utils.getConnectionPath(
                    ...Utils.getOutputPosition(output),
                    ...input
                )
            });
        }

        this.editor.paths = pathData;
    }

    update() {
        this.updateConnections();
        this.$cd.scan();
    }

    areaClick() {
        if (this.pickedOutput !== null && !d3.event.ctrlKey)
            this.pickedOutput = null;
        else if (this.contextMenu.visible)
            this.contextMenu.hide();
        else
            this.contextMenu.show(d3.event.clientX - 20, d3.event.clientY - 20);
        this.update();
    }

    zoomAt(nodes: Node[]) {
        if (nodes.length === 0) return;

        var bbox = Utils.nodesBBox(nodes);
        var kh = this.dom.clientHeight / Math.abs(bbox.top - bbox.bottom);
        var kw = this.dom.clientWidth / Math.abs(bbox.left - bbox.right);
        var k = Math.min(kh, kw, 1);

        this.zoom.translateTo(this.d3Container, ...bbox.getCenter());
        this.zoom.scaleTo(this.d3Container, zoomMargin * k);
    }

    setScaleExtent(scaleMin: number, scaleMax: number) {
        this.zoom.scaleExtent([scaleMin, scaleMax]);
    }

    setTranslateExtent(left: number, top: number, right: number, bottom: number) {
        this.zoom.translateExtent([[left, top], [right, bottom]]);
    }
}