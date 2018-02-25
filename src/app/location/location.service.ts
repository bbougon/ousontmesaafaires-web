import {Injectable} from '@angular/core';
import {NewLocation} from '../domain/new-location';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HandleError, HttpErrorHandler} from '../infrastructure/http-error-handler.service';

@Injectable()
export class LocationService {

  private handleError: HandleError;

  constructor(private httpClient: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LocationService');
  }

  addLocation(location: NewLocation): Observable<any> {
    return this.httpClient.post(environment.locationResource, location, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .flatMap(response => {
        const locationURL = response.headers.get('Location');
        return this.httpClient.get(locationURL)
          .pipe(tap(_ => console.log(`Get location location=${locationURL}`)),
            catchError(this.handleError(`getLocation`, locationURL)));
      })
      .pipe(tap(_ => console.log(`Post location=${location}`)),
        catchError(this.handleError(`Add location`, location)));
  }

  getLocations(): Observable<any> {
    return this.httpClient.get(environment.locationResource)
      .pipe(tap(_ => console.log(`Get all locations location`)),
        catchError(this.handleError(`getLocations`)));
  }
}
