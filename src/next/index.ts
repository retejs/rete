
export enum ElementType {
  Node = 'node',
  Edge = 'edge'
}

export function createTsSchema<T>() {
  return null as T
}

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

export class NodeEditor<NodeData extends NodeBase = NodeBase, ConnectionData extends ConnectionBase = ConnectionBase> {
  public nodes: NodeData[] = []
  public connections: ConnectionData[] = []

  constructor(container: HTMLElement, schemas?: { [ElementType.Node]?: NodeData, [ElementType.Edge]?: ConnectionData }) {
    container
    schemas
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

type Pipe<T> = (data: T) => Promise<undefined | T> | undefined | T

class Signal<T> {
  pipes: Pipe<T>[] = []

  addPipe(pipe: Pipe<T>) {
    this.pipes.push(pipe)
  }

  async emit<Context extends T>(context: Context): Promise<Context | undefined> {
    let current: Context | undefined = context

    for (const pipe of this.pipes) {
      current = await pipe(current) as Context

      if (typeof current === 'undefined') return
    }
    return current
  }
}

export class Scope<Signals> {
  signal = new Signal<Signals>()

  constructor(public name: string) {}

  addPipe(middleware: Pipe<Signals>) {
    this.signal.addPipe(middleware)
  }

  use<T>(plugin: Scope<T | Signals>) {
    this.addPipe(context => {
      return plugin.signal.emit<Signals>(context)
    })
  }

  emit(context: Signals) {
    return this.signal.emit(context)
  }
}
