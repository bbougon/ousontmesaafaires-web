import {NewContainer} from '../../domain/new-container';
import {Container} from '../../domain/container';
import {Item} from '../../domain/item';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';
import {ContainerService} from '../container.service';

export const CONTAINER: Container = new Container({
  'id': 'an-id', 'name': 'Container',
  'items': [{'item': {'type': 'chaussure'}}], 'qrcode': 'a qr code'
});

export class FakeContainerService extends ContainerService {
  private containers: Container[] = [];

  addContainer(container: NewContainer): Observable<Container> {
    const containerCreated = new Container({
      'id': Math.random().toString(36).substring(2, 15),
      'name': container.name,
      'items': [{'item': container.item}],
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
