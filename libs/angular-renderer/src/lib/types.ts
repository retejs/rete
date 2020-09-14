import { Component, Type } from '@angular/core';
import { Control, IO } from '@naetverkjs/naetverk';

export type SocketType = 'input' | 'output';
export type BindSocket = (el: HTMLElement, type: SocketType, io: IO) => void;
export type BindControl = (el: HTMLElement, control: Control) => void;

export interface Props {
  [key: string]: unknown;
}

export interface ElementProps extends Props {
  component: Type<Component>;
  props: Props;
}

export interface AngularControl<
  P extends Props = {},
  T extends Component = any
> {
  render?: 'angular' | string;
  component: Type<T>;
  props: P;
}

export interface AngularComponentData<
  P extends Props = {},
  T extends Component = any
> {
  render?: 'angular' | string;
  component: Type<T>;
  props?: P;
}

export interface AngularComponent<
  P extends Props = {},
  T extends Component = any
> {
  data: AngularComponentData<P, T>;
}
