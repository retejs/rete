import * as alight from 'alight';
import * as d3 from 'd3';
import { Utils, ViewUtils } from './utils/index';
import { Component } from './component';
import { ContextMenu } from './contextmenu';
import { Node } from './node';
import { NodeEditor } from './editor';
import { declareViewDirectives } from './directives/index';
import template from './templates/view.pug';

const zoomMargin = 0.9;

export class PathInfo {
    constructor(output, input) {
        this.connection = null;
        this.input = input;
        this.output = output;
    }
}

export class EditorView {

    constructor(editor: NodeEditor, container: HTMLElement, menu: ?ContextMenu) {
        this.editor = editor;
        this.pickedOutput = null;
        this.container = d3.select(container).attr('tabindex', 1);
        this.mouse = [0, 0];
        this.transform = d3.zoomIdentity;

        this.contextMenu = menu || new ContextMenu({}, true, true);

        this.initView();
        this.initial();
    }

    initial() {
        this.setScaleExtent(0.1, 1);
        var size = Math.pow(2, 12);

        this.setTranslateExtent(-size, -size, size, size);
    }

    initView() {
        this.container
            .on('click', () => {
                if (this.container.node() === d3.event.target)
                    this.areaClick()
            });

        this.view = this.container.append('div')
            .style('transform-origin', '0 0')
            .style('width', 1)
            .style('height', 1);

        this.zoom = d3.zoom()
            .on('zoom', () => {
                this.transform = d3.event.transform;
                this.update();
                this.editor.eventListener.trigger('transform', this.transform);
            });

        this.container.call(this.zoom);

        d3.select(window)
            .on('mousemove.d3ne' + this.editor._id, () => {
                
                var k = this.transform.k;
                var position = d3.mouse(this.view.node());

                this.mouse = [position[0]/k, position[1]/k];
                this.update();
            })
            .on('keydown.d3ne' + this.editor._id, (e) => {
                if (this.container.node() === document.activeElement)
                    this.editor.keyDown(e);
            })
            .on('resize.d3ne' + this.editor._id, this.resize.bind(this));

        this.view.html(template());
        this.initAlight();
    }

    initAlight() {
        var al = alight.makeInstance();

        declareViewDirectives(this, al);
        this.$cd = al(this.view.node(), { editor: this.editor });
    }

    getTemplate(node) {
        var component = this.editor.components.find(c => {
            return c.name === node.title
        });

        if (!component)
            throw new Error(`Component not found. Make sure you have defined 
                            the component with the "${node.title}" name`);

        return component.template;
    }

    resize() {
        var width = this.container.node().parentElement.clientWidth;
        var height = this.container.node().parentElement.clientHeight;

        this.container
            .style('width', width + 'px')
            .style('height', height + 'px');

        this.update();
    }

    connectionProducer(x1, y1, x2, y2) {
        var offsetX = 0.3 * Math.abs(x1 - x2);
        var offsetY = 0.1 * (y2 - y1);

        var p1 = [x1, y1];
        var p2 = [x1 + offsetX, y1 + offsetY];
        var p3 = [x2 - offsetX, y2 - offsetY];
        var p4 = [x2, y2];

        return {
            points: [p1, p2, p3, p4],
            curve: 'basis'
        };
    }

    updateConnections() {
        var pathData = [];

        this.editor.nodes.forEach(node => {
            node.getConnections('output').forEach(con => {
                let output = con.output;
                let input = con.input;

                if (input.el) {
                    let pathInfo = new PathInfo(output, input);

                    pathInfo.connection = con;

                    pathData.push({
                        connection: con,
                        d: ViewUtils.getConnectionPath(
                            ViewUtils.getOutputPosition(output),
                            ViewUtils.getInputPosition(input),
                            this.connectionProducer,
                            pathInfo
                        )
                    });
                }
            });
        });

        if (this.pickedOutput !== null && this.pickedOutput.el) {
            let output = this.pickedOutput;
            let input = this.mouse;
            let pathInfo = new PathInfo(output, input);

            pathData.push({
                selected: true,
                d: ViewUtils.getConnectionPath(
                    ViewUtils.getOutputPosition(output),
                    input,
                    this.connectionProducer,
                    pathInfo
                )
            });
        }

        this.editor.paths = pathData;
    }

    update() {
        var t = this.transform;
        
        this.view.style('transform', `translate(${t.x}px, ${t.y}px) scale(${t.k})`);
        this.updateConnections();
        this.$cd.scan();
    }

    assignContextMenuHandler() {
        this.contextMenu.default.onClick = async (item) => {
        
            if (item instanceof Component) {
                let node = item.newNode();

                await item.builder(node);
                this.editor.addNode(node, true);
                this.editor.selectNode(node);
            }
            else
                item();

            this.contextMenu.hide();
        };
    }    

    areaClick() {
        if (this.editor.readOnly) return;
        
        if (this.pickedOutput !== null && !d3.event.ctrlKey)
            this.pickedOutput = null;
        else if (this.contextMenu.visible)
            this.contextMenu.hide();
        else {
            this.assignContextMenuHandler();
            this.contextMenu.show(d3.event.pageX, d3.event.pageY);
        }
        this.update();
    }

    zoomAt(nodes: Node[]) {
        if (nodes.length === 0) return;

        var [w, h] = [this.container.node().clientWidth, this.container.node().clientHeight];
        var bbox = Utils.nodesBBox(nodes);
        var [kw, kh] = [w / bbox.width, h / bbox.height]
        var k = Math.min(kh, kw, 1) * zoomMargin;

        var center = bbox.getCenter();

        this.translate(w / 2 - center[0] * k, h / 2 - center[1] * k);
        this.scale(k);
    }

    translate(x, y) {
        this.transform.x = x;
        this.transform.y = y;
        this.update();
    }

    scale(scale) {
        this.transform.k = scale;
        this.update();
    }

    setScaleExtent(scaleMin: number, scaleMax: number) {
        this.scaleExtent = [scaleMin, scaleMax];
        this.zoom.scaleExtent(this.scaleExtent);
    }

    setTranslateExtent(left: number, top: number, right: number, bottom: number) {
        this.translateExtent = [[left, top], [right, bottom]];
        this.zoom.translateExtent(this.translateExtent);
    }

    destroy() {
        d3.select(window)
            .on('mousemove.d3ne' + this.editor._id, null)
            .on('keydown.d3ne' + this.editor._id, null)
            .on('resize.d3ne' + this.editor._id, null);
    }
}
