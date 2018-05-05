import {TestBed, inject, async} from '@angular/core/testing';

import { UuidService } from './uuid.service';

describe('UuidService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UuidService]
    });
  });

  it('should be created', inject([UuidService], (service: UuidService) => {
    expect(service).toBeTruthy();
  }));

  it('generates an UUID encoded in base 64', async(
    inject([UuidService], (uuidService: UuidService) => {
      const base64Encoded: string = uuidService.base64Encoded();

      const regex = /[a-zA-Z0-9]{48}/gm;
      expect(regex.test(base64Encoded)).toBeTruthy();
    })));

});
