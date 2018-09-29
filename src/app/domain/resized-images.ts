import {ResizedImage} from './resized-image';

export class ResizedImages {

  static getThumbnail(resizedImages: ResizedImage[]): ResizedImage {
    const minimumWidth = Math.min.apply(Math, resizedImages.map(function (resizedImage) {
      return resizedImage.width;
    }));
    return resizedImages
      .filter(value => value.width === minimumWidth)[0];
  }
}
