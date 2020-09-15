import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { Control } from '@naetverkjs/naetverk';
import { NodeService } from './node.service';

@Directive({
  selector: '[rete-control]',
})
export class ControlDirective implements OnInit {
  @Input('rete-control') control!: Control;

  constructor(private el: ElementRef, private service: NodeService) {}

  ngOnInit() {
    this.service.bindControl(this.el.nativeElement, this.control);
  }
}
