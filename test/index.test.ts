// import jest globals
import { describe, expect, it } from '@jest/globals'

import { NodeEditor } from '../src/editor'

describe('NodeEditor', () => {
  it('NodeEditor is instantiable', () => {
    expect(new NodeEditor()).toBeInstanceOf(NodeEditor)
  })

  it('addNode should add a node', async () => {
    const editor = new NodeEditor()
    const nodeData = { id: '1', label: 'Node 1' }
    const result = await editor.addNode(nodeData)
    const nodes = editor.getNodes()

    expect(result).toBe(true)
    expect(nodes).toHaveLength(1)
    expect(nodes[0]).toEqual(nodeData)
  })

  it('addNode should not add a node with duplicate id', async () => {
    const editor = new NodeEditor()
    const nodeData = { id: '1', label: 'Node 1' }

    await editor.addNode(nodeData)

    await expect(() => editor.addNode(nodeData)).rejects.toThrowError()
  })

  it('addConnection should add a connection', async () => {
    const editor = new NodeEditor()
    const connectionData = { id: '1', source: '1', target: '2' }

    await editor.addNode({ id: '1' })
    await editor.addNode({ id: '2' })
    const result = await editor.addConnection(connectionData)
    const connections = editor.getConnections()

    expect(result).toBe(true)
    expect(connections).toHaveLength(1)
    expect(connections[0]).toEqual(connectionData)
  })

  it('addConnection should not add a connection with duplicate id', async () => {
    const editor = new NodeEditor()
    const connectionData = { id: '1', source: '1', target: '2' }

    await editor.addNode({ id: '1' })
    await editor.addNode({ id: '2' })
    await editor.addConnection(connectionData)

    await expect(() => editor.addConnection(connectionData)).rejects.toThrowError()
  })
})

