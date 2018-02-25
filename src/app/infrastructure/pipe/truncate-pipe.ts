import {Pipe, PipeTransform} from '@angular/core';
import {InvalidArgumentPipeError} from '../invalid-argument-pipe-error';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: any, limit: number): any {
    function support(supportedValue: any): boolean {
      return typeof supportedValue === 'string';
    }

    if (!support(value)) {
      throw new InvalidArgumentPipeError(TruncatePipe, value);
    }
    return value.length > limit ? value.substr(0, limit) + '...' : value;
  }
}
