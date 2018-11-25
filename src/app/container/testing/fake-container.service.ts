import {NewContainer} from '../../domain/new-container';
import {Container} from '../../domain/container';
import {Item} from '../../domain/item';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';
import {ContainerService} from '../container.service';

export const CONTAINER: Container = new Container({
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
  }, {
    'item': 'pantalon marron',
    'imageStore': {
      'folder': 'folder_name_2',
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
    'hash': 'hash_2'
  }],
  'qrcode': 'a qr code',
  'description': 'Description'
});

export class FakeContainerService extends ContainerService {
  private containers: Container[] = [];

  addContainer(container: NewContainer): Observable<Container> {
    const containerCreated = new Container({
      'id': Math.random().toString(36).substring(2, 15),
      'name': container.name,
      'items': container.items,
      'qrcode': 'a qr code'
    });
    this.containers.push(containerCreated);
    return of(containerCreated);
  }

  getContainers(): Observable<Container[]> {
    return of(this.containers);
  }

  addItemToContainer(containerId: String, item: Item): Observable<any> {
    this.containers.forEach(container => {
      if (container.id === containerId) {
        container.add(item);
      }
    });
    return of(null);
  }

  getContainer(containerId: String): Observable<Container> {
    this.containers.forEach(container => {
      if (container.id === containerId) {
        return of(container);
      }
    });
    return of(this.containers[0]);
  }

}
