import {ImageStore} from './image-store';

export class Item {

  constructor(public item: { [key: string]: any, imageStore?: ImageStore, hash?: string }) {
  }

}
