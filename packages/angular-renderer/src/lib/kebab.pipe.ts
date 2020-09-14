import { Pipe, PipeTransform } from '@angular/core';

type ClassAttr = string | string[];

@Pipe({name: 'kebab'})
export class KebabPipe implements PipeTransform {

  replace(s: string) {
    return s.toLowerCase().replace(/ /g, '-');
  }

  transform(value: ClassAttr): ClassAttr {
    return Array.isArray(value) ? value.map(s => this.replace(s)) : this.replace(value);
  }
}