import { ConnectionBase, NodeBase } from '../types'
import { getUID } from '../utils'

type PortId = string

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
  id: NodeBase['id']
  ports: Port[] = []
  controls: Control[] = []

  constructor() {
    this.id = getUID()
  }
}

export class Connection implements ConnectionBase {
  id: ConnectionBase['id']
  source: NodeBase['id']
  target: NodeBase['id']
  sourcePort?: Port
  targetPort?: Port

  constructor(source: Node, target: Node) {
    this.id = getUID()
    this.source = source.id
    this.target = target.id
  }
}
