type ComponentWorkerFunc = (node : any, inputs : any[][], outputs : any[]) => any;
type EngineState = {
  AVALIABLE: 0,
  PROCESSED: 1,
  ABORT: 2
};

interface ComponentWorkerProps {
  worker: ComponentWorkerFunc;
}

export class ComponentWorker {
  name : string;
  worker : ComponentWorkerFunc;

  constructor(name : string, props : ComponentWorkerProps);
}

export class Engine {
  readonly id : string;
  components : ComponentWorker[]
  args : any[];
  data : Object;
  state : EngineState;
  onAbort : () => {};
  constructor(id : string, components : ComponentWorker[]);

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