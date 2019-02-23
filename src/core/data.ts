export type Connection = {
    node: number;
    data: any;
}

export type InputConnection = Connection & {
    output: string;
}
export type OutputConnection = Connection & {
    input: string;
} 

export type Input = {
    connections: InputConnection[]
}
export type Output = {
    connections: OutputConnection[]
}

export type Inputs = { [key: string]: Input };
export type Outputs = { [key: string]: Output };

export type Node = {
    id: number;
    name: string;
    inputs: Inputs;
    outputs: Outputs;
    data: any;
    position: number[];
}

export type Nodes = { [id: string]: Node };

export type Data = {
    id: string;
    nodes: Nodes;
}