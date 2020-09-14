import { Component, Type } from '@angular/core';
import { Props } from '../types';

export interface ElementProps extends Props {
  component: Type<Component>;
  props: Props;
}
