
export type NodeId = string
export type ConnectionId = string

export type NodeBase = { id: NodeId }
export type ConnectionBase = { id: ConnectionId, source: NodeId, target: NodeId }

export type GetSchemes<NodeData extends NodeBase, ConnectionData extends ConnectionBase> = { Node: NodeData, Connection: ConnectionData }
export type BaseSchemes = GetSchemes<NodeBase, ConnectionBase>

export interface NodeEditorData<Scheme extends BaseSchemes> {
  nodes: Scheme['Node'][]
  connections: Scheme['Connection'][]
}
