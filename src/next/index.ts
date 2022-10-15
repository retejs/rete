import { Scope } from './scope'

type NodeId = string
type PortId = string
type ConnectionId = string

type NodeBase = { id: NodeId }
type ConnectionBase = { id: ConnectionId, source: NodeId, target: NodeId }

function getUID() {
  const typedArray = new Uint8Array(10)
  const randomValues = window.crypto.getRandomValues(typedArray)

  return randomValues.join('');
}

export class Socket {
  constructor() {
    1
  }
}

export class Port {
  id: PortId
  socket?: Socket

  constructor() {
    this.id = getUID()
  }
}

export class Input extends Port {

}

export class Output extends Port {

}

export class Control {

}

export class Node implements NodeBase {
  id: NodeId
  ports: Port[] = []
  controls: Control[] = []

  constructor() {
    this.id = getUID()
  }
}

export class Connection implements ConnectionBase {
  id: ConnectionId
  source: NodeId
  target: NodeId
  sourcePort?: Port
  targetPort?: Port

  constructor(source: Node, target: Node) {
    this.id = getUID()
    this.source = source.id
    this.target = target.id
  }
}

export type Root<NodeData, ConnectionData> =
  | { type: 'nodecreate', data: NodeData }
  | { type: 'connectioncreate', data: ConnectionData }

export * from './scope'

export class NodeEditor<
  NodeData extends NodeBase = NodeBase,
  ConnectionData extends ConnectionBase = ConnectionBase
> extends Scope<Root<NodeData, ConnectionData>> {
  public nodes: NodeData[] = []
  public connections: ConnectionData[] = []

  constructor(container: HTMLElement) {
    super('NodeEditor')
    container
  }

  addNode(data: NodeData) {
    this.nodes.push(data)
  }

  addConnection(data: ConnectionData) {
    this.connections.push(data)
  }

  removeNode(idOrData: NodeId | NodeData) {
    const id = typeof idOrData === 'string' ? idOrData : idOrData.id
    const index = this.nodes.findIndex(n => n.id === id)

    if (index < 0) throw new Error('cannot find node')

    this.nodes.splice(index, 1)
  }

  import() {
    1
  }

  export() {
    1
  }
}
