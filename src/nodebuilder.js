class NodeBuilder {
  constructor (name, initializer) {
    this.name = name
    this.initializer = initializer
  }

  build () {
    var node = this.initializer()
    if (!(node instanceof Node)) {
      throw new Error('Invalid node instance')
    }
    return node
  }
}
