import {UuidService} from '../app/infrastructure/uuid.service';

export class FakeUuidService extends UuidService {
  uuids: string[] = [];

  base64Encoded() {
    return this.uuids.shift();
  }
}
