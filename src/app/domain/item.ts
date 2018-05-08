import {Image} from './image';

export class Item {

  constructor(public item: {[key: string]: any, hash?: string, images?: Image[]}) {
  }

}
