import {Injectable} from '@angular/core';
import {NewContainer} from '../domain/new-container';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {Item} from '../domain/item';
import {Container} from '../domain/container';
import {Patch} from '../infrastructure/patch/patch';
import {Destination} from '../domain/destination';

class ContainerMapper {
  map: any;

  constructor(response: any) {
    this.map = response.map((container) => new Container(container));
  }

}

@Injectable()
export class ContainerService {

  private handleError: HandleError;

  constructor(private httpClient: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ContainerService');
  }

  addContainer(container: NewContainer): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/containers`, container, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .pipe(
        map(response => response.headers.get('Location')),
        tap(_ => console.log(`Post container=${container}`)),
        catchError(this.handleError(`Add container`, container)))
      .mergeMap(location => {
        return this.getContainerFromUrl(location);
      });
  }

  private getContainerFromUrl(containerURL: any) {
    return this.httpClient.get<Container>(containerURL)
      .pipe(
        tap(_ => console.log(`Get container=${containerURL}`)),
        catchError(this.handleError(`getContainer`, containerURL)),
        map((container: Container) => {
          return container;
        }));
  }

  getContainer(containerId: String): Observable<Container> {
    return this.getContainerFromUrl(`${environment.apiUrl}/containers/${containerId}`);
  }

  getContainers(): Observable<Container[]> {
    return this.httpClient.get<Container[]>(`${environment.apiUrl}/containers`)
      .pipe(
        tap(_ => console.log(`Get all containers`)),
        catchError(this.handleError(`getContainers`)),
        map((response) => {
          return new ContainerMapper(response).map;
        }));
  }

  addItemToContainer(containerId: String, item: Item): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/containers/${containerId}/item`, item, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .pipe(
        tap(() => console.log(`Add item (${JSON.stringify(item)}) to container=${containerId}`)),
        catchError(this.handleError(`Add item to container`, item)));
  }

  patchContainer(containerId: string, patch: Patch): Observable<Container> {
    return this.httpClient.patch<Container>(`${environment.apiUrl}/containers/${containerId}`,
      patch,
      {
        observe: 'response',
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'json'
      })
      .pipe(
        tap(() => console.log(`Patching container ${containerId} (${JSON.stringify(patch)})`)),
        catchError(this.handleError(`Patching container`, patch)),
        map((response: HttpResponse<Container>) => {
          return new Container(response.body);
        }));
  }

  moveItemToContainer(item: Item, containerId: string, destination: Destination): Observable<Container> {
    return this.httpClient.post(`${environment.apiUrl}/containers/${containerId}/items/${item.item.hash}`, destination, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .pipe(
        map(response => response.headers.get('Location')),
        tap(() => console.log(`Post item '${item}' to container '${containerId}'`)),
        catchError(this.handleError(`Posting item to container`, `${item}, ${containerId}`)))
      .mergeMap(location => {
        return this.getContainerFromUrl(location);
      });
  }
}
