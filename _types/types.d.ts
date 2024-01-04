/**
 * Node id type
 */
export declare type NodeId = string;
/**
 * Connection id type
 * @group Primary
 */
export declare type ConnectionId = string;
/**
 * The base node type
 * @group Primary
 */
export declare type NodeBase = {
    id: NodeId;
};
/**
 * The base connection type
 * @group Primary
 */
export declare type ConnectionBase = {
    id: ConnectionId;
    source: NodeId;
    target: NodeId;
};
/**
 * Get the schemes
 * @example GetSchemes<Node & { myProp: number }, Connection>
 * @group Primary
 */
export declare type GetSchemes<NodeData extends NodeBase, ConnectionData extends ConnectionBase> = {
    Node: NodeData;
    Connection: ConnectionData;
};
/**
 * The base schemes
 * @group Primary
 */
export declare type BaseSchemes = GetSchemes<NodeBase, ConnectionBase>;
//# sourceMappingURL=types.d.ts.map