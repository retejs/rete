import { Scope } from './scope'
import { BaseSchemes } from './types'

/**
 * Signal types produced by NodeEditor instance
 * @typeParam Scheme - The scheme type
 * @priority 10
 * @group Primary
 */
export type Root<Scheme extends BaseSchemes> =
  | { type: 'nodecreate', data: Scheme['Node'] }
  | { type: 'nodecreated', data: Scheme['Node'] }
  | { type: 'noderemove', data: Scheme['Node'] }
  | { type: 'noderemoved', data: Scheme['Node'] }
  | { type: 'connectioncreate', data: Scheme['Connection'] }
  | { type: 'connectioncreated', data: Scheme['Connection'] }
  | { type: 'connectionremove', data: Scheme['Connection'] }
  | { type: 'connectionremoved', data: Scheme['Connection'] }
  | { type: 'clear' }
  | { type: 'clearcancelled' }
  | { type: 'cleared' }

/**
 * The NodeEditor class is the entry class. It is used to create and manage nodes and connections.
 * @typeParam Scheme - The scheme type
 * @priority 7
 * @group Primary
 */
export class NodeEditor<Scheme extends BaseSchemes> extends Scope<Root<Scheme>> {
  private nodes: Scheme['Node'][] = []
  private connections: Scheme['Connection'][] = []

  constructor() {
    super('NodeEditor')
  }

  /**
   * Get a node by id
   * @param id - The node id
   * @returns The node or undefined
   */
  public getNode(id: Scheme['Node']['id']) {
    return this.nodes.find(node => node.id === id)
  }

  /**
   * Get all nodes
   * @returns All nodes
   */
  public getNodes() {
    return this.nodes
  }

  /**
   * Get all connections
   * @returns All connections
   */
  public getConnections() {
    return this.connections
  }

  /**
   * Get a connection by id
   * @param id - The connection id
   * @returns The connection or undefined
   */
  public getConnection(id: Scheme['Connection']['id']) {
    return this.connections.find(connection => connection.id === id)
  }

  /**
   * Add a node
   * @param data - The node data
   * @returns Whether the node was added
   * @throws If the node has already been added
   * @emits nodecreate
   * @emits nodecreated
   */
  async addNode(data: Scheme['Node']) {
    if (this.getNode(data.id)) throw new Error('node has already been added')

    if (!await this.emit({ type: 'nodecreate', data })) return false

    this.nodes.push(data)

    await this.emit({ type: 'nodecreated', data })
    return true
  }

  /**
   * Add a connection
   * @param data - The connection data
   * @returns Whether the connection was added
   * @throws If the connection has already been added
   * @emits connectioncreate
   * @emits connectioncreated
   */
  async addConnection(data: Scheme['Connection']) {
    if (this.getConnection(data.id)) throw new Error('connection has already been added')

    if (!await this.emit({ type: 'connectioncreate', data })) return false

    this.connections.push(data)

    await this.emit({ type: 'connectioncreated', data })
    return true
  }

  /**
   * Remove a node
   * @param id - The node id
   * @returns Whether the node was removed
   * @throws If the node cannot be found
   * @emits noderemove
   * @emits noderemoved
   */
  async removeNode(id: Scheme['Node']['id']) {
    const index = this.nodes.findIndex(n => n.id === id)
    const node = this.nodes[index]

    if (index < 0) throw new Error('cannot find node')

    if (!await this.emit({ type: 'noderemove', data: node })) return false

    this.nodes.splice(index, 1)

    await this.emit({ type: 'noderemoved', data: node })
    return true
  }

  /**
   * Remove a connection
   * @param id - The connection id
   * @returns Whether the connection was removed
   * @throws If the connection cannot be found
   * @emits connectionremove
   * @emits connectionremoved
   */
  async removeConnection(id: Scheme['Connection']['id']) {
    const index = this.connections.findIndex(n => n.id === id)
    const connection = this.connections[index]

    if (index < 0) throw new Error('cannot find connection')

    if (!await this.emit({ type: 'connectionremove', data: connection })) return false

    this.connections.splice(index, 1)

    await this.emit({ type: 'connectionremoved', data: connection })
    return true
  }

  /**
   * Clear all nodes and connections
   * @returns Whether the editor was cleared
   * @emits clear
   * @emits clearcancelled
   * @emits cleared
   */
  async clear() {
    if (!await this.emit({ type: 'clear' })) {
      await this.emit({ type: 'clearcancelled' })
      return false
    }

    for (const connection of this.connections.slice()) await this.removeConnection(connection.id)
    for (const node of this.nodes.slice()) await this.removeNode(node.id)

    await this.emit({ type: 'cleared' })
    return true
  }
}
