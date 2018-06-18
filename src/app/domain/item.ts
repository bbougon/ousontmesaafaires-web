import {ImageStore} from './image-store';

export class Item {

  constructor(public item: { [key: string]: any}, public imageStore?: ImageStore, public hash?: string ) {
  }

}
