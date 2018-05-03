import {environment} from '../../../environments/environment';

export class Patch {

  version: number = environment.patchVersion;
  data: any = null;

  constructor(private target: string, private id?: string) {
    this.target = target;
    this.id = id || '';
  }

  unwrap(data: any): Patch {
    this.data = data;
    return this;
  }
}
