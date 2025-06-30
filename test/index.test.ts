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

  it('removeNode should remove a node', async () => {
    const editor = new NodeEditor()
    const nodeData = { id: '1', label: 'Node 1' }

    await editor.addNode(nodeData)
    await editor.removeNode('1')
    const nodes = editor.getNodes()

    expect(nodes).toHaveLength(0)
  })

  it('removeNode should remove specified nodes', async () => {
    const editor = new NodeEditor()

    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    await Promise.all(ids.map(id => editor.addNode({ id: id })))

    const removeIds = ['1', '2', '3', '4', '5']

    await Promise.all(removeIds.map(id => editor.removeNode(id)))

    const remainIds = editor.getNodes().map(n => n.id)

    await editor.clear()

    expect(remainIds).toEqual(['6', '7', '8', '9', '10'])
  })

  it('removeConnection should remove a connection', async () => {
    const editor = new NodeEditor()
    const connectionData = { id: '1', source: '1', target: '2' }

    await editor.addNode({ id: '1' })
    await editor.addNode({ id: '2' })
    await editor.addConnection(connectionData)
    await editor.removeConnection('1')
    const connections = editor.getConnections()

    expect(connections).toHaveLength(0)
  })

  it('removeConnection should remove specified connections', async () => {
    const editor = new NodeEditor()

    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    await Promise.all(ids.map(id => editor.addNode({ id: `s${id}` })))
    await Promise.all(ids.map(id => editor.addNode({ id: `t${id}` })))
    await Promise.all(ids.map(id => editor.addConnection({ id: id, source: `s${id}`, target: `t${id}` })))

    const removeIds = ['1', '2', '3', '4', '5']

    await Promise.all(removeIds.map(id => editor.removeConnection(id)))

    const remainIds = editor.getConnections().map(c => c.id)

    await editor.clear()

    expect(remainIds).toEqual(['6', '7', '8', '9', '10'])
  })

  it('should clear all nodes and connections', async () => {
    const editor = new NodeEditor()

    await editor.addNode({ id: '1' })
    await editor.addNode({ id: '2' })
    await editor.addConnection({ id: '1', source: '1', target: '2' })
    await editor.clear()
    const nodes = editor.getNodes()
    const connections = editor.getConnections()

    expect(nodes).toHaveLength(0)
    expect(connections).toHaveLength(0)
  })
})

