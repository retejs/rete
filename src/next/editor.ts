import { Scope } from './scope'
import { BaseSchemes, NodeEditorData } from './types'

export type Root<Scheme extends BaseSchemes> =
  | { type: 'nodecreate', data: Scheme['Node'] }
  | { type: 'nodecreated', data: Scheme['Node'] }
  | { type: 'noderemove', data: Scheme['Node']['id'] }
  | { type: 'noderemoved', data: Scheme['Node']['id'] }
  | { type: 'connectioncreate', data: Scheme['Connection'] }
  | { type: 'connectioncreated', data: Scheme['Connection'] }
  | { type: 'connectionremove', data: Scheme['Connection']['id'] }
  | { type: 'connectionremoved', data: Scheme['Connection']['id'] }
  | { type: 'clear' }
  | { type: 'cleared' }
  | { type: 'import', data: NodeEditorData<Scheme> }
  | { type: 'imported', data: NodeEditorData<Scheme> }
  | { type: 'export', data: NodeEditorData<Scheme> }
  | { type: 'exported', data: NodeEditorData<Scheme> }

export class NodeEditor<Scheme extends BaseSchemes> extends Scope<Root<Scheme>> {
  private nodes: Scheme['Node'][] = []
  private connections: Scheme['Connection'][] = []

  constructor() {
    super('NodeEditor')
  }

  public getNode(id: Scheme['Node']['id']) {
    return this.nodes.find(node => node.id === id)
  }

  public getNodes() {
    return this.nodes
  }

  public getConnections() {
    return this.connections
  }

  public getConnection(id: Scheme['Connection']['id']) {
    return this.connections.find(connection => connection.id === id)
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

  async removeNode(id: Scheme['Node']['id']) {
    const index = this.nodes.findIndex(n => n.id === id)

    if (index < 0) throw new Error('cannot find node')

    if (!await this.emit({ type: 'noderemove', data: id })) return false

    this.nodes.splice(index, 1)

    await this.emit({ type: 'noderemoved', data: id })
    return true
  }

  async removeConnection(id: Scheme['Connection']['id']) {
    const index = this.connections.findIndex(n => n.id === id)

    if (index < 0) throw new Error('cannot find connection')

    if (!await this.emit({ type: 'connectionremove', data: id })) return false

    this.connections.splice(index, 1)

    await this.emit({ type: 'connectionremoved', data: id })
    return true
  }

  async clear() {
    if (!await this.emit({ type: 'clear' })) return false

    await Promise.all(this.connections.map(connection => this.removeConnection(connection.id)))
    await Promise.all(this.nodes.map(node => this.removeNode(node.id)))

    await this.emit({ type: 'cleared' })
    return true
  }

  async import(data: NodeEditorData<Scheme>): Promise<boolean> {
    if (!await this.emit({ type: 'import', data })) return false

    await Promise.all(data.nodes.map(node => this.addNode(node)))
    await Promise.all(data.connections.map(connection => this.addConnection(connection)))

    await this.emit({ type: 'imported', data })

    return true
  }

  async export(): Promise<NodeEditorData<Scheme> | false> {
    const data: NodeEditorData<Scheme> = { nodes: [], connections: [] }

    if (!await this.emit({ type: 'export', data })) return false

    data.nodes.push(...this.nodes)
    data.connections.push(...this.connections)

    await this.emit({ type: 'exported', data })

    return data
  }
}
