import {Injectable} from '@angular/core';
import {NewLocation} from '../domain/new-location';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import {catchError, tap} from 'rxjs/operators';
import {LocationCreated} from '../domain/location-created';

class Empty {
}

@Injectable()
export class LocationService {

  constructor(private http: HttpClient) {
  }

  addLocation(location: NewLocation): Observable<LocationCreated> {
    return this.http.post('http://127.0.0.1:8182/location', location, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
      .flatMap(response => {
        const locationURL = response.headers.get('Location');
        return this.http.get<LocationCreated>(locationURL)
          .pipe(tap(_ => console.log(`Get location location=${locationURL}`)), catchError(this.handleError(`Location ${locationURL}`)));
      })
      .pipe(tap(_ => console.log(`Post location=${location}`)), catchError(this.handleError(`Post location=${location}`)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('LocationService: ' + message);
  }
}
