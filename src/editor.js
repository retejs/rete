import { Component } from './component';
import { Connection } from './connection';
import { Context } from './core/context';
import { EditorEvents } from './events';
import { EditorView } from './view/index';
import { Input } from './input';
import { Node } from './node';
import { Output } from './output';
import { Selected } from './selected';
import { Validator } from './core/validator';

export class NodeEditor extends Context {

    constructor(id: string, container: HTMLElement) {
        super(id, new EditorEvents());

        this.nodes = [];
        this.components = new Map();

        this.selected = new Selected();
        this.view = new EditorView(container, this.components, this);

        window.addEventListener('keydown', e => this.trigger('keydown', e));
        window.addEventListener('keyup', e => this.trigger('keyup', e));
        this.on('nodecreated', node => this.getComponent(node.name).created(node));
        this.on('noderemoved', node => this.getComponent(node.name).destroyed(node));
        this.on('selectnode', node => this.selectNode(node));
    }

    addNode(node: Node) {
        if (!this.trigger('nodecreate', node)) return;

        this.nodes.push(node);
        this.view.addNode(node);
        
        this.trigger('nodecreated', node);
    }

    removeNode(node: Node) {
        if (!this.trigger('noderemove', node)) return;

        node.getConnections().forEach(c => this.removeConnection(c));

        this.nodes.splice(this.nodes.indexOf(node), 1);
        this.view.removeNode(node);

        this.trigger('noderemoved', node);
    }

    connect(output: Output, input: Input, data = {}) {
        if (!this.trigger('connectioncreate', { output, input })) return;

        try {
            const connection = output.connectTo(input);

            connection.data = data;
            this.view.addConnection(connection);

            this.trigger('connectioncreated', connection);
        } catch (e) {
            this.trigger('warn', e)
        }
    }

    removeConnection(connection: Connection) {
        if (!this.trigger('connectionremove', connection)) return;
            
        this.view.removeConnection(connection);
        connection.remove();

        this.trigger('connectionremoved', connection);
    }

    selectNode(node: Node, accumulate: boolean = false) {
        if (this.nodes.indexOf(node) === -1)
            throw new Error('Node not exist in list');
        
        if (!this.trigger('nodeselect', node)) return;
        
        this.selected.add(node, accumulate);

        this.trigger('nodeselected', node);
    }

    getComponent(name) {
        const component = this.components.get(name);

        if (!component)
            throw `Component ${name} not found`;
        
        return component;
    }

    register(component: Component) {
        component.editor = this;
        this.components.set(component.name, component);
        this.trigger('componentregister', component)
    }

    clear() {
        [...this.nodes].map(node => this.removeNode(node));
    }

    toJSON() {
        const data = { id: this.id, nodes: {} };
        
        this.nodes.forEach(node => data.nodes[node.id] = node.toJSON());
        this.trigger('export', data);
        return data;
    }

    beforeImport(json: Object) {
        var checking = Validator.validate(this.id, json);
        
        if (!checking.success) {
            this.trigger('warn', checking.msg);
            return false;
        }
        
        this.clear();
        this.silent = true;
        this.trigger('import', json);
        return true;
    }

    afterImport() {
        this.silent = false;
        return true;
    }

    async fromJSON(json: Object) {
        if (!this.beforeImport(json)) return false;
        var nodes = {};

        try {
            await Promise.all(Object.keys(json.nodes).map(async id => {
                var node = json.nodes[id];
                var component = this.getComponent(node.name);

                nodes[id] = await component.build(Node.fromJSON(node));
                this.addNode(nodes[id]);
            }));
        
            Object.keys(json.nodes).forEach(id => {
                var jsonNode = json.nodes[id];
                var node = nodes[id];
                
                jsonNode.outputs.forEach((outputJson, i) => {
                    outputJson.connections.forEach(jsonConnection => {
                        var nodeId = jsonConnection.node;
                        var data = jsonConnection.data;
                        var inputIndex = jsonConnection.input;
                        var targetInput = nodes[nodeId].inputs[inputIndex];

                        this.connect(node.outputs[i], targetInput, data);
                    });
                });

            });
        }
        catch (e) {
            this.trigger('warn', e);
            return false;
        }
        return this.afterImport();
    }
}
