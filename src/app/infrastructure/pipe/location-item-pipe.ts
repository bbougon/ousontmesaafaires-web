import {Pipe, PipeTransform} from '@angular/core';
import {isObject} from 'rxjs/util/isObject';
import {InvalidArgumentPipeError} from '../invalid-argument-pipe-error';

@Pipe({name: 'item'})
export class LocationItemPipe implements PipeTransform {

  constructor() {
  }

  transform(value: any): any {
    if (Array.isArray(value) || !isObject(value)) {
      throw new InvalidArgumentPipeError(LocationItemPipe, value);
    }

    function uppercaseFirstLetter(item: string): string {
      return item.substr(0, 1).toUpperCase()
        + item.substr(1).toLowerCase();
    }

    return Object.keys(value).map(item => (uppercaseFirstLetter(item) + ':').bold() + ' ' + value[item]).join(', ');
  }

}
