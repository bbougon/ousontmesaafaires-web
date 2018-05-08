import {ResizedImage} from './resized-image';

export class Image {

  constructor(public signature: string, public url: string, public secureUrl: string, public resizedImages: ResizedImage[]) {

  }

}
