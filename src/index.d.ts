type ComponentBuilder = (node : Node) => any;
type ComponentWorker = (node : any, inputs : any[][], outputs : any[]) => any;
type ComponentCreated = (node : any) => any;
type ComponentDestroyed = (node : any) => any;
type EngineState = {
  AVALIABLE: 0,
  PROCESSED: 1,
  ABORT: 2
};

type ConnectionProducerRet = {
  points: number[][],
  curve: string
};
type ConnectionProducer = (x1 : number, y1 : number, x2 : number, y2 : number) => ConnectionProducerRet;

type ComponentProps = {
  template?: string;
  builder: ComponentBuilder;
  worker: ComponentWorker;
  created?: ComponentCreated;
  destroyed?: ComponentDestroyed;
}

declare class Module {
  constructor(data : any, titlesInput : String[], titlesOutput : String[]);
  static extractNodes(data : any, titles : String[]);
  read(inputs : String[]);
  write(outputs : String[]);
}

type ModuleWorker = (node : any, inputs : any[][], outputs : any[]) => any;
type ModuleWorkerIO = (node : any, inputs : any[][], outputs : any[], module : Module) => any;

type ControlHandler = (element : HTMLElement, control : Control) => any;

type DiffOutput = {
  node: Number,
  input: Number
}

type DiffConnect = {
  output: Number,
  node: Number,
  removed: DiffOutput[],
  added: DiffOutput[]
};

type DiffResult = {
  removed: Number[],
  added: Number[],
  moved: Number[],
  datachanged: Number[],
  connects: DiffConnect[]
}

type TaskAction = (inputs : any[][], data : any) => any[];

export class Engine {
  readonly id : string;
  components : Component[]
  args : any[];
  data : Object;
  state : EngineState;
  onAbort : () => {};
  constructor(id : string, components : Component[]);

  clone() : Engine;
  abort();

  private processStart() : boolean;
  private processDone() : boolean;

  private lock(node);
  private unlock(node);
  private extractInputData(node);
  private processNode(node);
  private forwardProcess(node);
  private copy(data);

  process(data : Object, startId?: number, ...args);
}

export class Socket {
  constructor(id : string, name : string, hint : string);

  combineWith(socket : Socket);
  compatibleWith(socket : Socket);
}

export class Block {
  readonly id : number;
  position : number[];
  width : number;
  height : number;
  style : any;

  constructor(Class);

  private static incrementId(Class)
}

export class Connection {
  private input : Input;
  private output : Output;
}

export class EventListener {
  private events : Object;
  persistent : boolean;

  constructor();
  on(names : string, handler : (param?: any, persistent?: boolean) => any) : EventListener;
  trigger(name : string, param?: any) : any;
}

export class EditorView {

  editor : NodeEditor;
  pickedOutput?: Output;
  mouse : number[];
  transform : Object;
  contextMenu : ContextMenu;

  container : Object

  private view : Object;
  private zoom : Object;

  constructor(editor : NodeEditor, container : HTMLElement, menu : ContextMenu);

  private getTemplate(node);

  resize();
  connectionProducer : ConnectionProducer;

  updateConnections();
  update();

  private assignContextMenuHandler();
  private areaClick();

  zoomAt(nodes : Node[]);
  translate(x : number, y : number);
  scale(scale : number);
  setScaleExtent(scaleMin : number, scaleMax : number);
  setTranslateExtent(left : number, top : number, right : number, bottom : number);
}

export class NodeEditor {

  readonly id : string;
  readonly _id : number;
  components : Component[];
  view : EditorView;
  eventListener : EventListener;
  private selected : Selected;
  private history : History;
  nodes : Node[];
  groups : Group[];
  readOnly : boolean;
  constructor(id : string, container : HTMLElement, components : Component[], menu : ContextMenu);

  addNode(node : Node, mousePlaced?: boolean)
  addGroup(group : Group);
  removeNode(node : Node);
  removeGroup(group : Group);
  connect(output : Output | Connection, input?: Input);
  removeConnection(connection : Connection);
  selectNode(node : Node, accumulate?: boolean);
  selectGroup(group : Group, accumulate?: boolean);

  keyDown();
  clear();
  toJSON();
  fromJSON(json : any);
}

export class History {

  constructor(editor : NodeEditor);
  add(exec, undo, args);
  undo();
  redo();
}

export class ContextMenu {
  visible : number;
  x : number;
  y : number;

  constructor(items : any, searchBar?: boolean)

  private bindTemplate(t);

  private searchItems(filter?: string);
  haveSubitems(item);
  isVisible();
  show(x : number, y : number, items?: any, searchBar?: boolean, onClick?: () => {});
  hide();
}

export class Group extends Block {
  title : string;

  nodes : Node[];
  constructor(title : string, params : any);

  setMinSizes(width : number, height : number);
  setWidth(w : number);
  setHeight(h : number);
  isCoverNode(node : Node);
  coverNodes(nodes : Node[]);
  containNode(node : Node);
  addNode(node : Node);
  removeNode(node : Node);
  remove();

  toJSON();

  static fromJSON(json : any);
}

export class Node extends Block {

  group : Group;
  inputs : Input[];
  outputs : Output[];
  controls : Control[];
  data : any;
  title : string;

  constructor(title : string);

  addControl(control : Control, index?: number);
  addInput(input : Input, index?: number);
  addOutput(output : Output, index?: number);
  getConnections(type);

  inputsWithVisibleControl();

  toJSON();

  static fromJSON(component : Component, json : any)
}

export class Selected {

  constructor();

  add(item : Node | Group, accumulate?: boolean)
  clear();
  remove(item : () => {});
  contains(item : () => {});
  each(callback : () => {});
  eachNode(callback : () => {});
  eachGroup(callback : () => {});
  getNodes() : Node[];
  getGroups() : Group[];
}

export class IO {
  node : Node;
  multipleConnections : boolean;
  connections : Connection[];

  title : string;
  socket : Socket;

  constructor(title, socket, multiConns);
  removeConnection(connection : Connection);
}

export class Input extends IO {
  control : Control;

  constructor(title : string, socket : Socket, multiConns?: boolean);
  hasConnection();
  addConnection(connection : Connection);
  addControl(control : Control);
  showControl();
  toJSON();
}

export class Output extends IO {

  constructor(title : string, socket : Socket, multiConns?: boolean)
  hasConnection();
  connectTo(input : Input);
  connectedTo(input : Input);
  toJSON();
}

export class Control {

  constructor(html : string, handler?: ControlHandler);

  getNode();
  getData(key : string);

  putData(key : string, data : any);
}

export class Component {
  name : string;
  template : string;
  builder : ComponentBuilder;
  worker : ComponentWorker;
  created: ComponentCreated;
  destroyed: ComponentDestroyed;

  constructor(name : string, props : ComponentProps);

  newNode() : Node;
}

export class Diff {
  constructor(data1 : any, data2 : any);
  public compare() : DiffResult;
}

export class ModuleManager {
  constructor(titlesInput : String[], titlesOutput : String[]);

  getInputs(data : any);
  getOutputs(data : any);

  workerModule : ModuleWorker;
  workerInputs : ModuleWorkerIO;
  workerOutputs : ModuleWorkerIO;

  setEngine(engine : Engine);
}

export class Task {
  constructor(inputs : any[][], action : TaskAction);
  private getOptions();
  private getOutputs();
  reset();
  run(data : any);
  option(index : Number);
  output(index : Number);
}