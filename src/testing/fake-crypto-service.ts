import {Encryptor} from '../app/infrastructure/crypto.service';

export class FakeCryptoService extends Encryptor {

  constructor(encrypt: (message) => string) {
    super(encrypt);
  }
}
