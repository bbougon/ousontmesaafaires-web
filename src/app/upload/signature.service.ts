import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Signature} from './signature';
import {HandleError, HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class SignatureService {
  private handleError: HandleError;

  constructor(private httpClient: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ContainerService');
  }

  sign(dataToSign: { eager: string, folder: string, public_id: string, timestamp: number }): Observable<Signature> {
    return this.httpClient.post(`${environment.apiUrl}/sign`, dataToSign)
      .pipe(tap(_ => console.log(`Post Signature=${environment.apiUrl}/sign`)),
        catchError(this.handleError(`sign`, dataToSign)))
      .map((body) => {
        return new Signature(body);
      });
  }

}
