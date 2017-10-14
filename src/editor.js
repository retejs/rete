import { Connection } from './connection';
import { ContextMenu } from './contextmenu';
import { EditorView } from './editorview';
import { EventListener } from './eventlistener';
import { Input } from './input';
import { Group } from './group';
import { Node } from './node';
import { Output } from './output';
import { Selected } from './selected';
import { Utils } from './utils';

export class NodeEditor {

    constructor(id: string, container: HTMLElement, template: string, builder: Object, menu: ContextMenu) {

        if (!Utils.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');  
        
        this.id = id;
        this.builder = builder;
        this.view = new EditorView(this, container, template, menu);
        this.eventListener = new EventListener();
        this.selected = new Selected();
        this.nodes = [];
        this.groups = [];
    }

    addNode(node: Node, mousePlaced = false) {
        if (this.eventListener.trigger('nodecreate', node)) {
            if (mousePlaced)
                node.position = this.view.mouse;
            this.nodes.push(node);
            this.eventListener.trigger('change');
            this.selectNode(node);
        }
    }

    addGroup(group: Group) {
        if (this.eventListener.trigger('groupcreate', group)) {
            this.groups.push(group);
            this.eventListener.trigger('change');
        }
        
        this.view.update();
    }

    removeNode(node: Node) {
        var index = this.nodes.indexOf(node);

        if (this.eventListener.trigger('noderemove', node)) {
            this.nodes.splice(index, 1);
            node.remove();
            this.eventListener.trigger('change');

            if (this.nodes.length > 0)
                this.selectNode(this.nodes[Math.max(0, index - 1)]);
        }

        this.view.update();
    }

    removeGroup(group: Group) {
        if (this.eventListener.trigger('groupremove', group)) {
            group.remove();
            this.groups.splice(this.groups.indexOf(group), 1);
            this.eventListener.trigger('change');
        }    

        this.view.update(); 
    }

    connect(output: Output, input: Input) {
        if (this.eventListener.trigger('connectioncreate', { output, input }))
            try {
                output.connectTo(input);
                this.eventListener.trigger('change');
            } catch (e) {
                console.error(e);
                alert(e.message);
            }
    }

    removeConnection(connection: Connection) {
        if (this.eventListener.trigger('connectionremove', connection)) {
            connection.remove();
            this.eventListener.trigger('change');
        }
    }

    selectNode(node: Node, accumulate: boolean = false) {
        if (this.nodes.indexOf(node) === -1)
            throw new Error('Node not exist in list');
        
        if (this.eventListener.trigger('nodeselect', node))
            this.selected.add(node, accumulate);
        
        this.view.update();
    }

    selectGroup(group: Group, accumulate: boolean = false) {
        if (this.groups.indexOf(group) === -1)
            throw new Error('Group not exist in list');
        
        if (this.eventListener.trigger('groupselect', group))
            this.selected.add(group, accumulate);
        
        this.view.update();
    }
    
    keyDown() {
    
        switch (d3.event.keyCode) {
        case 46:
            this.selected.eachNode(this.removeNode.bind(this));
            this.selected.eachGroup(this.removeGroup.bind(this));
            this.view.update();
            break;
        case 71:
            let nodes = this.selected.getNodes();
                
            if (nodes.length > 0) 
                this.addGroup(new Group('Group', { nodes }));
            
            break;
        }
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

    fromJSON(json: Object) {
        if (!Utils.isValidJSON(json))
            throw new Error('Data are damaged'); 
        if (!Utils.isCompatibleIDs(json.id, this.id))
            throw new Error('IDs not compatible');
		
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
        this.view.update();
    }
}