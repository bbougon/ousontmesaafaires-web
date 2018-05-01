import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {Signature} from './signature';

@Injectable()
export class SignatureService {

  constructor() {
  }

  sign(dataToSign: {
    timestamp: number,
    public_id: string,
    eager: string
  }): Observable<Signature> {
    return of(new Signature('', ''));
  }

}
