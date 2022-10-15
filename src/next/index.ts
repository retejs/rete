import { Scope } from './scope'

type NodeId = string
type PortId = string
type ConnectionId = string

export type NodeBase = { id: NodeId }
export type ConnectionBase = { id: ConnectionId, source: NodeId, target: NodeId }

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

export type GetSchemes<NodeData, ConnectionData> = { Node: NodeData, Connection: ConnectionData }
export type BaseSchemes = GetSchemes<NodeBase, ConnectionBase>

export type Root<Scheme extends BaseSchemes> =
  | { type: 'nodecreate', data: Scheme['Node'] }
  | { type: 'nodecreated', data: Scheme['Node'] }
  | { type: 'noderemove', data: Scheme['Node'] }
  | { type: 'noderemoved', data: Scheme['Node'] }
  | { type: 'connectioncreate', data: Scheme['Connection'] }
  | { type: 'connectioncreated', data: Scheme['Connection'] }
  | { type: 'connectionremove', data: Scheme['Connection']['id'] }
  | { type: 'connectionremoved', data: Scheme['Connection']['id'] }
  | { type: 'import' }
  | { type: 'imported' }
  | { type: 'export' }
  | { type: 'exported' }

export * from './scope'

export class NodeEditor<Scheme extends BaseSchemes> extends Scope<Root<Scheme>> {
  public nodes: Scheme['Node'][] = []
  public connections: Scheme['Connection'][] = []

  constructor(container: HTMLElement) {
    super('NodeEditor')
    container
  }

  async addNode(data: Scheme['Node']) {
    if (!await this.emit({ type: 'nodecreate', data })) return false

    this.nodes.push(data)

    await this.emit({ type: 'nodecreated', data })
    return true
  }

  async addConnection(data: Scheme['Connection']) {
    if (!await this.emit({ type: 'connectioncreate', data })) return false

    this.connections.push(data)

    await this.emit({ type: 'connectioncreated', data })
    return true
  }

  async removeNode(idOrData: NodeId | Scheme['Node']) {
    const id = typeof idOrData === 'string' ? idOrData : idOrData.id
    const index = this.nodes.findIndex(n => n.id === id)

    if (index < 0) throw new Error('cannot find node')

    if (!await this.emit({ type: 'connectionremove', data: id })) return false

    this.nodes.splice(index, 1)

    await this.emit({ type: 'connectionremoved', data: id })
    return true
  }

  async import() {
    if (!await this.emit({ type: 'import' })) return false
    1
    await this.emit({ type: 'imported' })
    return true
  }

  async export() {
    if (!await this.emit({ type: 'export' })) return false
    1
    await this.emit({ type: 'exported' })
    return false
  }
}
