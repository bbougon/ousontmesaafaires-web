import {Container} from './container';

describe('Container', () => {

  const bodyWithOneItem = {
    'id': 'an-id',
    'name': 'Container',
    'items': [{
      'item': 'chaussure',
      'imageStore': {
        'folder': 'folder_name',
        'images': [{
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
        }]
      },
      'hash': 'hash'
    }]
  };

  const bodyWithTwoItems = {
    'id': 'another-id',
    'name': 'Container 2',
    'items': [{
      'item': 'chaussure',
      'imageStore': {
        'folder': 'folder_name',
        'images': [{
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
        }]
      },
      'hash': 'hash_1'
    },
      {
        'item': 'pantalon',
        'imageStore': {
          'folder': 'other_folder',
          'images': [{
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
          }
          ]
        },
        'hash': 'hash_2'
      }]
  };

  const bodyWithoutImageStoreAndHash = {
    'id': 'a-new-id',
    'name': 'Container without image store and hash',
    'items': [{
      'item': 'chaussure'
    }]
  };

  it('should create a container with one item', () => {
    const container = new Container(bodyWithOneItem);
    expect(container.items.length).toBe(1);
    expect(container.items[0].item).toEqual('chaussure');
    expect(container.items[0].imageStore.folder).toEqual('folder_name');
  });

  it('should create a container with two items', () => {
    const container = new Container(bodyWithTwoItems);
    expect(container.items.length).toBe(2);
    expect(container.items[0].item).toEqual('chaussure');
    expect(container.items[0].imageStore.folder).toEqual('folder_name', 'first item folder');
    expect(container.items[1].item).toEqual('pantalon');
    expect(container.items[1].imageStore.folder).toEqual('other_folder', 'second item folder');
  });

  it('should create a container without image store and hash', () => {
    const container = new Container(bodyWithoutImageStoreAndHash);
    expect(container.items.length).toBe(1);
    expect(container.items[0].item).toEqual('chaussure');
    expect(container.items[0].imageStore).toBeUndefined('image store should be undefined');
    expect(container.items[0].hash).toBeUndefined('hash shouldbe undefined');
  });

});
