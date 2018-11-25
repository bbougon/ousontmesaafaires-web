import {Item} from '../domain/item';

export class ItemStringFormatter {
  constructor(private item: Item) {

  }

  format(): string {
    const resizedImages = this.item.imageStore.images
      .map(image => `${image.signature};${image.url};${image.secureUrl};${image.resizedImages
        .map(resizedImage => resizedImage.url + ';' + resizedImage.secureUrl + ';'
          + resizedImage.height.toFixed(1) + ';' + resizedImage.width.toFixed(1))
        .join(';')}`)
      .join('|');
    return this.item.item + '|' + this.item.imageStore.folder + '|' + resizedImages;
  }
}
