import { Input, Output, Node, Connection } from '@naetverkjs/naetverk';

export interface OnCreated {
  created(node: Node): void;
}

export interface OnDestroyed {
  destroyed(node: Node): void;
}

export interface OnConnect {
  onconnect(io: Input | Output): boolean;
}

export interface OnConnected {
  connected(io: Connection): void;
}

export interface OnDisconnect {
  ondisconnect(io: Connection): boolean;
}

export interface OnDisconnected {
  disconnected(io: Connection): void;
}
