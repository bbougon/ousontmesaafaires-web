import {Image} from './image';

export class ImageStore {


  constructor(public folder: string, public images?: Image[]) {
  }
}
