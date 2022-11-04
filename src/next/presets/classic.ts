import { ConnectionBase, NodeBase } from '../types'
import { getUID } from '../utils'

type PortId = string

export class Socket {
  constructor(public name: string) {

  }
}

export class Port {
  id: PortId

  constructor(public socket: Socket, public label?: string) {
    this.id = getUID()
  }
}

export class Control {
  component: any

}

export class Input extends Port {
  control: Control | null = null
  showControl = true

  addControl(control: Control) {
    if (this.control) throw new Error('control already added for this input')
    this.control = control
  }

  removeControl() {
    this.control = null
  }
}

export class Output extends Port {

}


export class Node<Inputs extends string = string, Outputs extends string = string, Controls extends string = string> implements NodeBase {
  id: NodeBase['id']
  inputs: {[key in Inputs]?: Input} = {}
  outputs: {[key in Outputs]?: Output} = {}
  controls: {[key in Controls]?: Control} = {}
  preset = 'classic' as const

  constructor(public label: string) {
    this.id = getUID()
  }

  addInput(key: Inputs, input: Input) {
    if (this.inputs[key]) throw new Error(`input with key '${key}' already added`)

    this.inputs[key] = input
  }

  removeInput(key: Inputs) {
    delete this.inputs[key]
  }

  addOutput(key: Outputs, output: Output) {
    if (this.outputs[key]) throw new Error(`output with key '${key}' already added`)

    this.outputs[key] = output
  }

  removeOutput(key: Outputs) {
    delete this.outputs[key]
  }

  addControl(key: Controls, control: Control) {
    if (this.controls[key]) throw new Error(`control with key '${key}' already added`)

    this.controls[key] = control
  }

  removeControl(key: Controls) {
    delete this.controls[key]
  }
}

export class Connection<
  Source extends Node<string, string, string>,
  Target extends Node<string, string, string>
> implements ConnectionBase {
  id: ConnectionBase['id']
  source: NodeBase['id']
  target: NodeBase['id']
  preset = 'classic' as const

  constructor(
    source: Source,
    public sourceOutput: Source extends Node<string, infer T, string> ? T : never,
    target: Target,
    public targetInput: Target extends Node<infer T, string, string> ? T : never
  ) {
    if (!source.outputs[sourceOutput]) throw new Error(`source node doesn't have output with a key ${sourceOutput}`)
    if (!target.inputs[targetInput]) throw new Error(`target node doesn't have input with a key ${targetInput}`)

    this.id = getUID()
    this.source = source.id
    this.target = target.id
  }
}
