import {Type} from '@angular/core';

export class InvalidArgumentPipeError extends Error {

  constructor(type: Type<any>, value: Object) {
    super(`InvalidPipeArgument: '${value}' for pipe '${type}'`);
  }
}
