import {Data} from './field';

export class Patch {


  constructor(private target: string, private id?: string) {
    this.target = target;
    this.id = id || '';
  }

  data: Data = null;

  unwrap(data: any): Patch {
    this.data = data;
    return this;
  }
}
