import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NodeComponent, NodeService } from '@naetverkjs/angular-renderer';

@Component({
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyNodeComponent extends NodeComponent {
  constructor(
    protected service: NodeService,
    protected cdr: ChangeDetectorRef
  ) {
    super(service, cdr);
  }
}
