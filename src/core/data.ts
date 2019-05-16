export interface ConnectionData {
    node: number;
    data: any;
}

export type InputConnectionData = ConnectionData & {
    output: string;
}
export type OutputConnectionData = ConnectionData & {
    input: string;
} 

export interface InputData {
    connections: InputConnectionData[];
}
export interface OutputData {
    connections: OutputConnectionData[];
}

export interface InputsData { [key: string]: InputData }
export interface OutputsData { [key: string]: OutputData }

export interface NodeData {
    id: number;
    name: string;
    inputs: InputsData;
    outputs: OutputsData;
    data: any;
    position: [number, number];
}

export interface NodesData { [id: string]: NodeData }

export interface Data {
    id: string;
    nodes: NodesData;
}

export interface WorkerInputs { [key: string]: any[] }

export interface WorkerOutputs { [key: string]: any }