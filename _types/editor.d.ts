import { Scope } from './scope';
import { BaseSchemes } from './types';
/**
 * Signal types produced by NodeEditor instance
 * @typeParam Scheme - The scheme type
 * @priority 10
 * @group Primary
 */
export declare type Root<Scheme extends BaseSchemes> = {
    type: 'nodecreate';
    data: Scheme['Node'];
} | {
    type: 'nodecreated';
    data: Scheme['Node'];
} | {
    type: 'noderemove';
    data: Scheme['Node'];
} | {
    type: 'noderemoved';
    data: Scheme['Node'];
} | {
    type: 'connectioncreate';
    data: Scheme['Connection'];
} | {
    type: 'connectioncreated';
    data: Scheme['Connection'];
} | {
    type: 'connectionremove';
    data: Scheme['Connection'];
} | {
    type: 'connectionremoved';
    data: Scheme['Connection'];
} | {
    type: 'clear';
} | {
    type: 'clearcancelled';
} | {
    type: 'cleared';
};
/**
 * The NodeEditor class is the entry class. It is used to create and manage nodes and connections.
 * @typeParam Scheme - The scheme type
 * @priority 7
 * @group Primary
 */
export declare class NodeEditor<Scheme extends BaseSchemes> extends Scope<Root<Scheme>> {
    private nodes;
    private connections;
    constructor();
    /**
     * Get a node by id
     * @param id - The node id
     * @returns The node or undefined
     */
    getNode(id: Scheme['Node']['id']): Scheme["Node"];
    /**
     * Get all nodes
     * @returns Copy of array with nodes
     */
    getNodes(): Scheme["Node"][];
    /**
     * Get all connections
     * @returns Copy of array with onnections
     */
    getConnections(): Scheme["Connection"][];
    /**
     * Get a connection by id
     * @param id - The connection id
     * @returns The connection or undefined
     */
    getConnection(id: Scheme['Connection']['id']): Scheme["Connection"];
    /**
     * Add a node
     * @param data - The node data
     * @returns Whether the node was added
     * @throws If the node has already been added
     * @emits nodecreate
     * @emits nodecreated
     */
    addNode(data: Scheme['Node']): Promise<boolean>;
    /**
     * Add a connection
     * @param data - The connection data
     * @returns Whether the connection was added
     * @throws If the connection has already been added
     * @emits connectioncreate
     * @emits connectioncreated
     */
    addConnection(data: Scheme['Connection']): Promise<boolean>;
    /**
     * Remove a node
     * @param id - The node id
     * @returns Whether the node was removed
     * @throws If the node cannot be found
     * @emits noderemove
     * @emits noderemoved
     */
    removeNode(id: Scheme['Node']['id']): Promise<boolean>;
    /**
     * Remove a connection
     * @param id - The connection id
     * @returns Whether the connection was removed
     * @throws If the connection cannot be found
     * @emits connectionremove
     * @emits connectionremoved
     */
    removeConnection(id: Scheme['Connection']['id']): Promise<boolean>;
    /**
     * Clear all nodes and connections
     * @returns Whether the editor was cleared
     * @emits clear
     * @emits clearcancelled
     * @emits cleared
     */
    clear(): Promise<boolean>;
}
//# sourceMappingURL=editor.d.ts.map