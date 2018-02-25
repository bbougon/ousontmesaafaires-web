import {Pipe, PipeTransform} from '@angular/core';
import {isObject} from 'rxjs/util/isObject';

@Pipe({name: 'pair'})
export class PairPipe implements PipeTransform {
  transform(value: any): any[] {
    if (Array.isArray(value) || !isObject(value)) {
      return value;
    }
    return Object.keys(value).map(k => [k, ' ' + value[k]]);
  }
}
