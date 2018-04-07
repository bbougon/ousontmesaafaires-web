import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class ClockworkService {

  constructor() {
  }

  delay(delay: number, callback: () => void) {
    const observable = Observable.of(null).delay(delay);
    observable.subscribe(() => {
      callback();
    });
  }
}
