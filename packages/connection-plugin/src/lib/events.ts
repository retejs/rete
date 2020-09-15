import { Connection, Input, Output } from '@naetverkjs/naetverk';

declare module '@naetverkjs/naetverk/types/events' {
  export interface EventsTypes {
    connectionpath: {
      points: number[];
      connection: Connection;
      d: string;
    };
    connectiondrop: Input | Output;
    connectionpick: Input | Output;
    resetconnection: void;
  }
}
