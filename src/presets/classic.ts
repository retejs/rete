import { ConnectionBase, NodeBase } from '../types'
import { getUID } from '../utils'

type PortId = string

export class Socket {
  constructor(public name: string) {

  }
}

export class Port<S extends Socket> {
  id: PortId
  index?: number

  constructor(public socket: S, public label?: string, public multipleConnections?: boolean) {
    this.id = getUID()
  }
}

export class Input<S extends Socket> extends Port<S> {
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

export class Output<S extends Socket> extends Port<S> {
  constructor(socket: S, label?: string, multipleConnections?: boolean) {
    super(socket, label, multipleConnections !== false)
  }
}

export class Control {
  id: string
  index?: number

  constructor() {
    this.id = getUID()
  }
}

type InputControlOptions<N> = {
    readonly?: boolean,
    initial?: N,
    change?: (value: N) => void
  }

export class InputControl<T extends 'text' | 'number', N = T extends 'text' ? string : number> extends Control {
  value?: N
  readonly: boolean

  constructor(public type: T, public options?: InputControlOptions<N>) {
    super()
    this.id = getUID()
    this.readonly = options.readonly

    if (options.initial) this.value = options.initial
  }

  setValue(value?: N) {
    this.value = value
    if (this.options.change) this.options.change(value)
  }
}

export class Node<
  Inputs extends { [key in string]?: Socket } = { [key in string]?: Socket },
  Outputs extends { [key in string]?: Socket } = { [key in string]?: Socket },
  Controls extends { [key in string]?: Control } = { [key in string]?: Control }
> implements NodeBase {
  id: NodeBase['id']
  inputs: {[key in keyof Inputs]?: Input<Exclude<Inputs[key], undefined>>} = {}
  outputs: {[key in keyof Outputs]?: Output<Exclude<Outputs[key], undefined>>} = {}
  controls: Controls = {} as Controls
  selected?: boolean

  constructor(public label: string) {
    this.id = getUID()
  }

  hasInput<K extends keyof Inputs>(key: K) {
    return Object.prototype.hasOwnProperty.call(this.inputs, key)
  }

  addInput<K extends keyof Inputs>(key: K, input: Input<Exclude<Inputs[K], undefined>>) {
    if (this.hasInput(key)) throw new Error(`input with key '${String(key)}' already added`)

    Object.defineProperty(this.inputs, key, { value: input, enumerable: true, configurable: true })
  }

  removeInput(key: keyof Inputs) {
    delete this.inputs[key]
  }

  hasOutput<K extends keyof Outputs>(key: K) {
    return Object.prototype.hasOwnProperty.call(this.outputs, key)
  }

  addOutput<K extends keyof Outputs>(key: K, output: Output<Exclude<Outputs[K], undefined>>) {
    if (this.hasOutput(key)) throw new Error(`output with key '${String(key)}' already added`)

    Object.defineProperty(this.outputs, key, { value: output, enumerable: true, configurable: true })
  }

  removeOutput(key: keyof Outputs) {
    delete this.outputs[key]
  }

  hasControl<K extends keyof Controls>(key: K) {
    return Object.prototype.hasOwnProperty.call(this.controls, key)
  }

  addControl<K extends keyof Controls>(key: K, control: Controls[K]) {
    if (this.hasControl(key)) throw new Error(`control with key '${String(key)}' already added`)

    Object.defineProperty(this.controls, key, { value: control, enumerable: true, configurable: true })
  }

  removeControl(key: keyof Controls) {
    delete this.controls[key]
  }
}

export class Connection<
  Source extends Node,
  Target extends Node
> implements ConnectionBase {
  id: ConnectionBase['id']
  source: NodeBase['id']
  target: NodeBase['id']

  constructor(
    source: Source,
    public sourceOutput: keyof Source['outputs'],
    target: Target,
    public targetInput: keyof Target['inputs']
  ) {
    if (!source.outputs[sourceOutput as string]) {
      throw new Error(`source node doesn't have output with a key ${String(sourceOutput)}`)
    }
    if (!target.inputs[targetInput as string]) {
      throw new Error(`target node doesn't have input with a key ${String(targetInput)}`)
    }

    this.id = getUID()
    this.source = source.id
    this.target = target.id
  }
}
