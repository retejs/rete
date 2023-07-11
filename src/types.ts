/**
 * Node id type
 */
export type NodeId = string
/**
 * Connection id type
 * @group Primary
 */
export type ConnectionId = string

/**
 * The base node type
 * @group Primary
 */
export type NodeBase = { id: NodeId }
/**
 * The base connection type
 * @group Primary
 */
export type ConnectionBase = { id: ConnectionId, source: NodeId, target: NodeId }

/**
 * Get the schemes
 * @example GetSchemes<Node & { myProp: number }, Connection>
 * @group Primary
 */
export type GetSchemes<NodeData extends NodeBase, ConnectionData extends ConnectionBase> = { Node: NodeData, Connection: ConnectionData }

/**
 * The base schemes
 * @group Primary
 */
export type BaseSchemes = GetSchemes<NodeBase, ConnectionBase>
