import {Item} from '../domain/item';

export class ItemStringFormatter {
  constructor(private item: Item) {

  }

  format(): string {
    const features = Object.keys(this.item.item)
      .filter(item => item !== 'hash' && item !== 'imageStore')
      .map(item => {
        return Object.keys(this.item.item[item])
            .map(value => value + ';' + this.item.item[item][value])
            .join(';');
        }
      )
      .join(';');
    const resizedImages = this.item.item.imageStore.images
      .map(image => `${image.signature};${image.url};${image.secureUrl};${image.resizedImages
        .map(resizedImage => resizedImage.url + ';' + resizedImage.secureUrl + ';'
          + resizedImage.height.toFixed(1) + ';' + resizedImage.width.toFixed(1))
        .join(';')}`)
      .join('|');
    return features + '|' + this.item.item.imageStore.folder + '|' + resizedImages;
  }
}
