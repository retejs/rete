export interface Connection {
    node: number;
    data: any;
}

export type InputConnection = Connection & {
    output: string;
}
export type OutputConnection = Connection & {
    input: string;
} 

export interface Input {
    connections: InputConnection[];
}
export interface Output {
    connections: OutputConnection[];
}

export interface Inputs { [key: string]: Input }
export interface Outputs { [key: string]: Output }

export interface Node {
    id: number;
    name: string;
    inputs: Inputs;
    outputs: Outputs;
    data: any;
    position: [number, number];
}

export interface Nodes { [id: string]: Node }

export interface Data {
    id: string;
    nodes: Nodes;
}