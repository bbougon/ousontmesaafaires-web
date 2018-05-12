import {ImageStore} from './image-store';

export class Item {

  constructor(public item: {[key: string]: any, hash?: string, imageStore?: ImageStore}) {
  }

}
