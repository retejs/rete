import {
  Component,
  Input,
  OnInit,
  Injector,
  ComponentFactoryResolver,
  ViewContainerRef,
  Type,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Props } from './types';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomComponent implements OnInit, OnDestroy {
  @Input() component!: Type<Component>;
  @Input() props!: Props;

  constructor(
    private vcr: ViewContainerRef,
    private injector: Injector,
    private factoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    const factory = this.factoryResolver.resolveComponentFactory(
      this.component
    );
    const componentRef = factory.create(this.injector);
    const { props } = this;

    for (const key of Object.keys(props)) {
      Object.defineProperty(componentRef.instance, key, {
        get() {
          return props[key];
        },
        set(val) {
          props[key] = val;
        },
      });
    }

    this.vcr.insert(componentRef.hostView);
  }

  ngOnDestroy() {
    this.vcr.detach(0);
  }
}
