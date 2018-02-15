import {Injectable} from '@angular/core';
import {NewLocation} from '../domain/new-location';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import {catchError, tap} from 'rxjs/operators';
import {LocationCreated} from '../domain/location-created';
import {environment} from '../../environments/environment';
import { HttpErrorHandler, HandleError } from '../infrastructure/http-error-handler.service';

@Injectable()
export class LocationService {

  private handleError: HandleError;

  constructor(private httpClient: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LocationService');
  }

  addLocation(location: NewLocation): Observable<LocationCreated> {
    return this.httpClient.post(environment.locationResource, location, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .flatMap(response => {
        const locationURL = response.headers.get('Location');
        return this.httpClient.get<LocationCreated>(locationURL)
          .pipe(tap(_ => console.log(`Get location location=${locationURL}`)),
            catchError(this.handleError(`getLocation`, locationURL)));
      })
      .pipe(tap(_ => console.log(`Post location=${location}`)),
        catchError(this.handleError(`Add location`, location)));
  }

  private log(message: string) {
    console.log('LocationService: ' + message);
  }

  getLocations(): Observable<LocationCreated[]> {
    return null;
  }
}
