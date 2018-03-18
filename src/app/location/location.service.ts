import {Injectable} from '@angular/core';
import {NewLocation} from '../domain/new-location';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {Item} from '../domain/item';
import {LocationCreated} from '../domain/location-created';

class LocationCreatedMapper {
  map: any;

  constructor(response: any) {
    this.map = response.map((location) => new LocationCreated(location));
  }

}

@Injectable()
export class LocationService {

  private handleError: HandleError;

  constructor(private httpClient: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LocationService');
  }

  addLocation(location: NewLocation): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/locations`, location, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .flatMap(response => {
        const locationURL = response.headers.get('Location');
        return this.httpClient.get<LocationCreated>(locationURL)
          .pipe(tap(_ => console.log(`Get location location=${locationURL}`)),
            catchError(this.handleError(`getLocation`, locationURL)))
          .map((body) => {
            return new LocationCreated(body);
          });
      })
      .pipe(tap(_ => console.log(`Post location=${location}`)),
        catchError(this.handleError(`Add location`, location)));
  }

  getLocations(): Observable<LocationCreated[]> {
    return this.httpClient.get<LocationCreated[]>(`${environment.apiUrl}/locations`)
      .pipe(tap(_ => console.log(`Get all locations location`)),
        catchError(this.handleError(`getLocations`)))
      .map((response) => {
        return new LocationCreatedMapper(response).map;
      });
  }

  addItemToLocation(locationId: String, item: Item): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/locations/${locationId}/item`, item, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .pipe(tap(() => console.log(`Add item (${JSON.stringify(item)}) to location=${locationId}`)),
        catchError(this.handleError(`Add item location`, item)));
  }

  generateSticker(url, locationId: String): Observable<ArrayBuffer> {
    return this.httpClient.put(`${environment.apiUrl}/locations/sticker/${locationId}`, {url: url},
      {
        headers: new HttpHeaders().set('Content-Type', 'application/octet-stream'),
        responseType: 'arraybuffer'
      })
      .pipe(tap(_ => console.log(`Put sticker=${locationId}`)),
        catchError(this.handleError(`Generate sticker`, locationId)))
      .map((arrayBuffer) => {
        if (arrayBuffer instanceof ArrayBuffer) {
          return arrayBuffer;
        }
      });
  }
}
