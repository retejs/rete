import { ConnectionBase, NodeBase } from '../types'
import { getUID } from '../utils'

type PortId = string

export class Socket {
  constructor(public name: string) {

  }
}

export class Port {
  id: PortId

  constructor(public socket: Socket, public label?: string, public multipleConnections?: boolean) {
    this.id = getUID()
  }
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
  constructor(socket: Socket, label?: string, multipleConnections?: boolean) {
    super(socket, label, multipleConnections !== false)
  }
}

export class Control {
  id: string

  constructor() {
    this.id = getUID()
  }
}

export class InputControl<T extends 'text' | 'number', N = T extends 'text' ? string : number> extends Control {
  value?: N

  constructor(public type: T, public readonly = false) {
    super()
    this.id = getUID()
  }

  setValue(value?: N) {
    this.value = value
  }
}

export class Node<Inputs extends string = string, Outputs extends string = string, Controls extends { [key in string]?: Control } = { [key in string]?: Control }> implements NodeBase {
  id: NodeBase['id']
  inputs: {[key in Inputs]?: Input} = {}
  outputs: {[key in Outputs]?: Output} = {}
  controls: Controls = {} as Controls
  selected?: boolean

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

  addControl<K extends keyof Controls>(key: K, control: Controls[K]) {
    if (this.controls[key]) throw new Error(`control with key '${String(key)}' already added`)

    this.controls[key] = control
  }

  removeControl(key: keyof Controls) {
    delete this.controls[key]
  }
}

export class Connection<
  Source extends Node<string, string, {}>,
  Target extends Node<string, string, {}>
> implements ConnectionBase {
  id: ConnectionBase['id']
  source: NodeBase['id']
  target: NodeBase['id']

  constructor(
    source: Source,
    public sourceOutput: Source extends Node<string, infer T, {}> ? T : never,
    target: Target,
    public targetInput: Target extends Node<infer T, string, {}> ? T : never
  ) {
    if (!source.outputs[sourceOutput]) throw new Error(`source node doesn't have output with a key ${sourceOutput}`)
    if (!target.inputs[targetInput]) throw new Error(`target node doesn't have input with a key ${targetInput}`)

    this.id = getUID()
    this.source = source.id
    this.target = target.id
  }
}
