import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Socket, IO, Input as ReteInput } from '@naetverkjs/naetverk';
import { SocketType } from '../types';

@Component({
  selector: 'rete-socket',
  template: `<div
    *ngIf="socket"
    class="socket"
    [ngClass]="[type, socket.name]"
    [title]="socket.name"
  ></div>`,
  styleUrls: ['./socket.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocketComponent {
  @Input() socket!: Socket;
  @Input() io!: IO;

  get type(): SocketType {
    return this.io instanceof ReteInput ? 'input' : 'output';
  }
}
