import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

export class Encryptor {

  constructor(public encrypt: (message) => string) {
  }

}

@Injectable()
export class CryptoService {

  constructor() {
  }

  sha1(): Encryptor {
    return new Encryptor((message) => CryptoJS.SHA1(message).toString());
  }
}
