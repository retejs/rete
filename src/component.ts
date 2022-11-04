import { NodeEditor } from './editor'
import { Component as ComponentWorker } from './engine/component'
import { Node } from './node'

export abstract class Component extends ComponentWorker {

  editor: NodeEditor | null = null
  data: unknown = {}

  constructor(name: string) {
    super(name)
  }

    abstract builder(node: Node): Promise<void>;

    async build(node: Node) {
      await this.builder(node)

      return node
    }

    async createNode(data = {}) {
      const node = new Node(this.name)

      node.data = data
      await this.build(node)

      return node
    }
}
