
import {Field} from './field';

export class Patch {

  fields: Field[] = [];

  unwrap(param: any): Patch {
    this.fields = Object.keys(param).map(par => new Field(par, param[par]));
    console.log('Fields: ' + JSON.stringify(this.fields));
    return this;
  }
}
