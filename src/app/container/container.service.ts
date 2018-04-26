import {Injectable} from '@angular/core';
import {NewContainer} from '../domain/new-container';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {Item} from '../domain/item';
import {Container} from '../domain/container';
import {of} from 'rxjs/observable/of';

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
      .flatMap(response => {
        const containerURL = response.headers.get('Location');
        return this.getContainerFromUrl(containerURL);
      })
      .pipe(tap(_ => console.log(`Post container=${container}`)),
        catchError(this.handleError(`Add container`, container)));
  }

  private getContainerFromUrl(containerURL: any) {
    return this.httpClient.get<Container>(containerURL)
      .pipe(tap(_ => console.log(`Get container=${containerURL}`)),
        catchError(this.handleError(`getContainer`, containerURL)))
      .map((body) => {
        return new Container(body);
      });
  }

  getContainer(containerId: String): Observable<Container> {
    return this.getContainerFromUrl(`${environment.apiUrl}/containers/${containerId}`);
  }

  getContainers(): Observable<Container[]> {
    return this.httpClient.get<Container[]>(`${environment.apiUrl}/containers`)
      .pipe(tap(_ => console.log(`Get all containers`)),
        catchError(this.handleError(`getContainers`)))
      .map((response) => {
        return new ContainerMapper(response).map;
      });
  }

  addItemToContainer(containerId: String, item: Item): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/containers/${containerId}/item`, item, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .pipe(tap(() => console.log(`Add item (${JSON.stringify(item)}) to container=${containerId}`)),
        catchError(this.handleError(`Add item to container`, item)));
  }

  addDescription(description: string): Observable<any> {
    return of(null);
  }
}
