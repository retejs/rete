import { ContextMenu } from './contextmenu';
import { Node } from './node';
import { NodeEditor } from './editor';
import { Utils } from './utils';
import { declareDirectives } from './directives/index';
import template from './templates/view.pug';

const zoomMargin = 0.9;

export class EditorView {

    constructor(editor: NodeEditor, container: HTMLElement, menu: ContextMenu) {
        this.editor = editor;
        this.pickedOutput = null;
        this.container = d3.select(container).attr('tabindex', 1);
        this.mouse = [0, 0];
        this.transform = d3.zoomIdentity;

        this.contextMenu = menu;
        this.contextMenu.default.onClick = (subitem) => {
            var result = subitem();

            if (result instanceof Node)
                this.editor.addNode(result, true);

            this.contextMenu.hide();
        };

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
                var t = this.transform = d3.event.transform;
                var style = `translate(${t.x}px, ${t.y}px) scale(${t.k})`;

                this.view.style('transform', style);
            });

        this.container.call(this.zoom);

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
                if (this.container.node() === document.activeElement)
                    editor.keyDown(e);
            })
            .on('resize.' + editor.id, this.resize.bind(this));

        this.$cd = alight.ChangeDetector();
        this.$cd.scope.editor = editor;
        
        declareDirectives(this);
        
        this.view.html(template());
        alight.bind(this.$cd, this.view.node());
    }

    getTemplate(node) {
        var component = this.editor.components.find(c => {
            return c.name === node.title.toLowerCase()
        });

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
                    pathData.push({
                        d: Utils.getConnectionPath(
                            Utils.getOutputPosition(output),
                            Utils.getInputPosition(input),
                            this.connectionProducer
                        )
                    });
                }
            });
        });

        if (this.pickedOutput !== null) {
            if (!this.pickedOutput.el) return;
            let output = this.pickedOutput;
            let input = this.mouse;

            pathData.push({
                selected: true,
                d: Utils.getConnectionPath(
                    Utils.getOutputPosition(output),
                    input,
                    this.connectionProducer
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
            this.contextMenu.show(d3.event.clientX, d3.event.clientY);
        this.update();
    }

    zoomAt(nodes: Node[]) {
        if (nodes.length === 0) return;

        var bbox = Utils.nodesBBox(nodes);
        var kh = this.container.node().clientHeight / Math.abs(bbox.top - bbox.bottom);
        var kw = this.container.node().clientWidth / Math.abs(bbox.left - bbox.right);
        var k = Math.min(kh, kw, 1);

        this.zoom.translateTo(this.container, ...bbox.getCenter());
        this.zoom.scaleTo(this.container, zoomMargin * k);
    }

    setScaleExtent(scaleMin: number, scaleMax: number) {
        this.zoom.scaleExtent([scaleMin, scaleMax]);
    }

    setTranslateExtent(left: number, top: number, right: number, bottom: number) {
        this.zoom.translateExtent([[left, top], [right, bottom]]);
    }
}