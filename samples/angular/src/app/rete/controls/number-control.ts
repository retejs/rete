import { Component, Input, Type } from '@angular/core';
import { Control } from '../../../../../../packages/naetverk/src';
import { AngularControl } from '../../../../../../packages/angular-renderer/src/lib';

@Component({
  template: `<input
    type="number"
    [value]="value"
    [readonly]="readonly"
    (change)="change(+$event.target.value)"
  />`,
  styles: [
    `
      input {
        border-radius: 30px;
        background-color: white;
        padding: 2px 6px;
        border: 1px solid #999;
        font-size: 110%;
        width: 140px;
        box-sizing: border-box;
      }
    `,
  ],
})
export class NumberComponent {
  @Input() value!: number;
  @Input() readonly!: boolean;
  @Input() change!: Function;
  @Input() mounted!: Function;

  ngOnInit() {
    this.mounted();
  }
}

export class NumControl extends Control implements AngularControl {
  component: Type<NumberComponent>;
  props: { [key: string]: unknown };

  constructor(public emitter, public key, readonly = false) {
    super(key);

    this.component = NumberComponent;
    this.props = {
      readonly,
      change: (v) => this.onChange(v),
      value: 0,
      mounted: () => {
        this.setValue(+(this.getData(key) as any) || 0);
      },
    };
  }

  onChange(val: number) {
    this.setValue(val);
    this.emitter.trigger('process');
  }

  setValue(val: number) {
    this.props.value = +val;
    this.putData(this.key, this.props.value);
  }
}
