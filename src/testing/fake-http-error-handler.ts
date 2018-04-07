import {of} from 'rxjs/observable/of';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

export class FakeHttpErrorHandler {

  createHandleError = (serviceName = '') => <T>
  (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result)

  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(error);
      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;
      return of(result);
    };

  }

}
