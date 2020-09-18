import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { IO, Input as NaetverkInput } from '@naetverkjs/naetverk';
import { NodeService } from './node.service';
import { SocketType } from './types';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[nvk-socket]',
})
export class SocketDirective implements OnInit {
  @Input() io!: IO;

  constructor(private el: ElementRef, private service: NodeService) {}

  get type(): SocketType {
    return this.io instanceof NaetverkInput ? 'input' : 'output';
  }

  ngOnInit() {
    this.service.bindSocket(this.el.nativeElement, this.type, this.io);
  }
}
