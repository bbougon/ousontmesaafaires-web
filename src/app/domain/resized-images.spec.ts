import {ResizedImage} from './resized-image';
import {Image} from './image';
import {ResizedImages} from './resized-images';

describe('ResizedImages', () => {

  const images = [{
    'signature': 'signature',
    'url': 'assets/testing/url.png',
    'secureUrl': 'assets/testing/secureUrl.png',
    'resizedImages': [{
      'url': 'assets/testing/url2.png',
      'secureUrl': 'assets/testing/secureUrl2.png',
      'height': 110.0,
      'width': 80.0
    }, {
      'url': 'assets/testing/url3.png',
      'secureUrl': 'assets/testing/secureUrl3.png',
      'height': 552.0,
      'width': 400.0
    }, {
      'url': 'assets/testing/url4.png',
      'secureUrl': 'assets/testing/secureUrl4.png',
      'height': 1103.0,
      'width': 800.0
    }]
  },
    {
      'signature': 'signature',
      'url': 'assets/testing/url5.png',
      'secureUrl': 'assets/testing/secureUrl5.png',
      'resizedImages': [{
        'url': 'assets/testing/url6.png',
        'secureUrl': 'assets/testing/secureUrl6.png',
        'height': 110.0,
        'width': 80.0
      }, {
        'url': 'assets/testing/url7.png',
        'secureUrl': 'assets/testing/secureUrl7.png',
        'height': 552.0,
        'width': 400.0
      }, {
        'url': 'assets/testing/url8.png',
        'secureUrl': 'assets/testing/secureUrl8.png',
        'height': 1103.0,
        'width': 800.0
      }]
    }];

  it('returns the smallest image to use as thumbnail', () => {
    const image = new Image(images[0].signature, images[0].url, images[0].secureUrl, createResizedImages(images[0]));

    const retrievedImage: ResizedImage = ResizedImages.getThumbnail(image.resizedImages);

    expect(retrievedImage).toBeTruthy();
    expect(retrievedImage.url).toBe('assets/testing/url2.png');
  });

  const createResizedImage = function (image: Image, index: number): ResizedImage {
    const resizedImage = image.resizedImages[index];
    return new ResizedImage(resizedImage.url, resizedImage.secureUrl, resizedImage.height, resizedImage.width);
  };

  const createResizedImages = function (image: any) {
    const resizedImages: ResizedImage[] = [];
    resizedImages.push(createResizedImage(image, 0), createResizedImage(image, 1), createResizedImage(image, 2));
    return resizedImages;
  };
});
