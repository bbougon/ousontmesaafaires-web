import {ImageStore} from './image-store';

export class Item {

  constructor(public item: string, public imageStore?: ImageStore, public hash?: string ) {
  }

}
