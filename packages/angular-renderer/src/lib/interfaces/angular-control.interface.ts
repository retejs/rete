import { Component, Type } from '@angular/core';
import { Props } from '../types';

export interface AngularControl<
  P extends Props = {},
  T extends Component = any
> {
  render?: 'angular' | string;
  component: Type<T>;
  props: P;
}
