import {Pipe, PipeTransform} from '@angular/core';
import {isObject} from 'rxjs/util/isObject';
import {InvalidArgumentPipeError} from '../invalid-argument-pipe-error';
import {isUndefined} from 'util';

@Pipe({name: 'item'})
export class ItemPipe implements PipeTransform {

  constructor() {
  }

  transform(value: any): any {
    if (Array.isArray(value) || !isObject(value)) {
      throw new InvalidArgumentPipeError(ItemPipe, value);
    }

    function uppercaseFirstLetter(item: string): string {
      return item.substr(0, 1).toUpperCase()
        + item.substr(1).toLowerCase();
    }

    if (!isUndefined(value.item)) {
      return Object.keys(value.item).map(item => (uppercaseFirstLetter(item) + ':').bold() + ' ' + value.item[item]).join(', ');
    }
    return Object.keys(value).map(item => (uppercaseFirstLetter(item) + ':').bold() + ' ' + value[item]).join(', ');
  }

}
