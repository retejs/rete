import {Engine, Context, Events, Component as ComponentWorker, Emitter} from './engine/engine.d';
export {Engine, ComponentWorker};

type EngineState = {
  AVALIABLE: 0,
  PROCESSED: 1,
  ABORT: 2
};

export class Socket {
  name: string;
  data: {};

  constructor(name: string, data?: object);

  combineWith(socket: Socket);
  compatibleWith(socket: Socket);
}

export class Connection {
  input: Input;
  output: Output;
}

export class Area extends Emitter {
  appendChild(el: HTMLElement);
  removeChild(el: HTMLElement);

  translate(x: number, y: number);
  zoom(zoom: number, ox?: number, oy?: number);
}

export class EditorView {

  emitter: Emitter;
  components: any;

  nodes: Map<Node, any>;
  connections: Map<Node, any>;

  area: Area;

  private view: Object;
  private zoom: Object;

  addNode(node: Node);
  removeNode(node: Node);
  addConnection(connection: Connection);
  removeConnection(connection: Connection);
  updateConnections(args: any);

  resize();
  click(e: MouseEvent);
}

export class NodeEditor extends Context {

  components: Map<string, Component>;
  selected: Selected;
  view: EditorView;
  nodes: Node[];
  constructor(id: string, container: HTMLElement);

  addNode(node: Node, mousePlaced?: boolean)
  removeNode(node: Node);
  connect(output: Output, input: Input, data?: any);
  removeConnection(connection: Connection);
  selectNode(node: Node, accumulate?: boolean);

  getComponent(name: string): Component;
  register(component: Component);

  clear();
  toJSON();
  fromJSON(json: any);
}

export class Node {
  readonly id: number;
  name: string;
  position: number[];

  inputs: Map<string, Input>;
  outputs: Map<string, Output>;
  controls: Map<string, Control>;
  data: any;
  meta: any;

  constructor(name: string);

  private static incrementId(Class)

  addControl(control: Control);
  addInput(input: Input);
  removeInput(input: Input);
  addOutput(output: Output);
  removeOutput(output: Output);
  getConnections(type);

  inputsWithVisibleControl();

  private static incrementId();
  public static resetId();

  toJSON();
  static fromJSON(json: any)
}

export class Selected {

  constructor();

  add(item: Node, accumulate?: boolean)
  clear();
  remove(item: Node);
  contains(item: Node);
  each(callbackfn: (value: Node, index?: number, array?: Node[]) => void, thisArg?: any);
}

export class IO {
  node: Node;
  multipleConnections: boolean;
  connections: Connection[];

  title: string;
  key: string;
  socket: Socket;

  constructor(key, title, socket, multiConns);
  removeConnection(connection: Connection);
  removeConnections();
}

export class Input extends IO {
  control: Control;

  constructor(key: string, title: string, socket: Socket, multiConns?: boolean);
  hasConnection();
  addConnection(connection: Connection);
  addControl(control: Control);
  showControl();
  toJSON();
}

export class Output extends IO {

  constructor(key: string, title: string, socket: Socket, multiConns?: boolean)
  hasConnection();
  connectTo(input: Input);
  connectedTo(input: Input);
  toJSON();
}

export abstract class Control {

  parent: Input | Node;
  key: string;
  constructor(key: string);

  getNode();
  getData(key: string);

  putData(key: string, data: any);
}

export abstract class Component extends ComponentWorker {

  editor: NodeEditor;
  engine: Engine;

  constructor(name: string);

  builder(node: Node): Promise<any> | any;
  build(node: Node): Promise<Node>;
  created(node: Node);
  destroyed(node: Node);

  createNode(data?: any): Promise<Node>;
}
