import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { Control } from '@naetverkjs/naetverk';
import { NodeService } from './node.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[nvk-control]',
})
export class ControlDirective implements OnInit {
  @Input('nvk-control') control!: Control;

  constructor(private el: ElementRef, private service: NodeService) {}

  ngOnInit() {
    this.service.bindControl(this.el.nativeElement, this.control);
  }
}
