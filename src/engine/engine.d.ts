type EngineState = {
  AVALIABLE: 0,
  PROCESSED: 1,
  ABORT: 2
};

export class Emitter {
  constructor();
  on(names : string, handler : (param?: any) => any) : Emitter;
  trigger(name : string, param?: any) : any;
}

export class Events {
  constructor(handlers : any);
}

export class Context extends Emitter {
  constructor(id : string, events : Events);

  use(plugin: any, options?: any);
}

export abstract class Component {
  name : string;

  constructor(name: string);
  
  worker(node : any, inputs : any[][], outputs : any[]): Promise<any> | any;
}

export class Engine extends Context {
  readonly id : string;
  components : Component[]
  args : any[];
  data : Object;
  state : EngineState;
  onAbort : () => {};
  constructor(id : string);
  
  register(component: Component);

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