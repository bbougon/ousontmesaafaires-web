import {Item} from '../domain/item';
import {ItemStringFormatter} from './item-string-formatter';

describe('ItemStringFormatter', () => {

  const itemWithOneFeatureJson = {
    'item': {
      'type': 'chaussure'
    },
    'imageStore': {
      'folder': 'folder_name',
      'images': [
        {
          'signature': 'signature',
          'url': 'url',
          'secureUrl': 'secureUrl',
          'resizedImages': [
            {
              'url': 'assets/testing/url2.png',
              'secureUrl': 'assets/testing/secureUrl2.png',
              'height': 110.0,
              'width': 80.0
            },
            {
              'url': 'assets/testing/url3.png',
              'secureUrl': 'assets/testing/secureUrl3.png',
              'height': 552.0,
              'width': 400.0
            },
            {
              'url': 'assets/testing/url4.png',
              'secureUrl': 'assets/testing/secureUrl4.png',
              'height': 1103.0,
              'width': 800.0
            }
          ]
        }
      ]
    },
    'hash': 'new-hash'
  };

  const itemWithTwoFeaturesJson = {
    'item': {
      'type': 'chaussure',
      'couleur': 'marron'
    },
    'imageStore': {
      'folder': 'folder_name',
      'images': [
        {
          'signature': 'signature',
          'url': 'url',
          'secureUrl': 'secureUrl',
          'resizedImages': [
            {
              'url': 'assets/testing/url2.png',
              'secureUrl': 'assets/testing/secureUrl2.png',
              'height': 110.0,
              'width': 80.0
            },
            {
              'url': 'assets/testing/url3.png',
              'secureUrl': 'assets/testing/secureUrl3.png',
              'height': 552.0,
              'width': 400.0
            },
            {
              'url': 'assets/testing/url4.png',
              'secureUrl': 'assets/testing/secureUrl4.png',
              'height': 1103.0,
              'width': 800.0
            }
          ]
        },
        {
          'signature': 'signature2',
          'url': 'url5',
          'secureUrl': 'secureUrl5',
          'resizedImages': [
            {
              'url': 'assets/testing/url6.png',
              'secureUrl': 'assets/testing/secureUrl6.png',
              'height': 110.0,
              'width': 80.0
            },
            {
              'url': 'assets/testing/url7.png',
              'secureUrl': 'assets/testing/secureUrl7.png',
              'height': 552.0,
              'width': 400.0
            },
            {
              'url': 'assets/testing/url8.png',
              'secureUrl': 'assets/testing/secureUrl8.png',
              'height': 1103.0,
              'width': 800.0
            }
          ]
        }
      ]
    },
    'hash': 'new-hash'
  };

  it('should format an item with one feature', () => {
    const itemStringFormatter = new ItemStringFormatter(new Item(itemWithOneFeatureJson));

    expect(itemStringFormatter.format()).toBe('type;chaussure|folder_name|' +
      'signature;url;secureUrl;assets/testing/url2.png;assets/testing/secureUrl2.png;110.0;80.0;' +
      'assets/testing/url3.png;assets/testing/secureUrl3.png;552.0;400.0;assets/testing/url4.png;' +
      'assets/testing/secureUrl4.png;1103.0;800.0');
  });

  it('should format an item with two features', () => {
    const itemStringFormatter = new ItemStringFormatter(new Item(itemWithTwoFeaturesJson));

    expect(itemStringFormatter.format()).toBe('type;chaussure;couleur;marron|folder_name|' +
      'signature;url;secureUrl;assets/testing/url2.png;assets/testing/secureUrl2.png;110.0;80.0;' +
      'assets/testing/url3.png;assets/testing/secureUrl3.png;552.0;400.0;assets/testing/url4.png;' +
      'assets/testing/secureUrl4.png;1103.0;800.0|' +
      'signature2;url5;secureUrl5;assets/testing/url6.png;assets/testing/secureUrl6.png;110.0;80.0;' +
      'assets/testing/url7.png;assets/testing/secureUrl7.png;552.0;400.0;assets/testing/url8.png;' +
      'assets/testing/secureUrl8.png;1103.0;800.0');
  });
});
