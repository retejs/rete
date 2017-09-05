import {Block} from './block';
import {Utils} from './utils';

export class Group extends Block {

    constructor(title, params) {
        super();
        this.id = Group.incrementId();
        this.title = title;

        this.nodes = [];
        this.minWidth = 600;
        this.minHeight = 250;

        if (params.nodes)
            this.coverNodes(params.nodes);
        else {
            this.position = params.position;
            this.width = params.width;
            this.height = params.height;
        }
        
    }

    static incrementId() {
        if (!this.latestId)
            this.latestId = 1
        else
            this.latestId++
        return this.latestId
    }

    setWidth(w) {
        return this.width = Math.max(this.minWidth, w);
    }

    setHeight(h) {
        return this.height = Math.max(this.minHeight, h);
    }

    isCoverNode(node) {
        var gp = this.position;
        var np = node.position;

        return np[0] > gp[0] && np[1] > gp[1]
            && np[0] + node.width < gp[0] + this.width
            && np[1] + node.height < gp[1] + this.height;
    }

    coverNodes(nodes) {
        var self = this;
        var margin = 30;
        var bbox = Utils.nodesBBox(nodes);

        nodes.forEach(node => {
            if (node.group !== null) node.group.removeNode(node.group);
            self.addNode(node);
        });
        this.position = [bbox.left - margin, bbox.top - 2 * margin];
        this.setWidth(bbox.right - bbox.left + 2 * margin);
        this.setHeight(bbox.bottom - bbox.top + 3 * margin);
    }

    containNode(node) {
        return this.nodes.indexOf(node) !== -1;
    }

    addNode(node) {
        if (this.containNode(node)) return false;
        if (node.group !== null) node.group.removeNode(node);
        node.group = this;
        this.nodes.push(node);
        return true;
    }

    removeNode(node) {
        if (!this.containNode(node)) return;
        this.nodes.splice(this.nodes.indexOf(node), 1);
        node.group = null;
    }

    remove() {
        this.nodes.forEach(node => {
            node.group = null;
        })
    }

    toJSON() {
        return {
            'id': this.id,
            'title': this.title,
            'nodes': this.nodes.map(a => a.id),
            'minWidth': this.minWidth,
            'minHeight': this.minHeight,
            'position': this.position,
            'width': this.width,
            'height': this.height
        }
    }

    static fromJSON(json) {
        var group = new Group(null, {
            position: json.position,
            width: json.width,
            height: json.height
        });

        group.id = json.id;
        Group.latestId = Math.max(group.id, Group.latestId);
        group.title = json.title;
        group.minWidth = json.minWidth;
        group.minHeight = json.minHeight;
        return group;
    }
}