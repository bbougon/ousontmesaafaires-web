import { TestBed, inject } from '@angular/core/testing';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoService]
    });
  });

  it('should be created', inject([CryptoService], (service: CryptoService) => {
    expect(service).toBeTruthy();
  }));

  it('encrypts in sha1', inject([CryptoService], (service: CryptoService) => {
    expect(service.sha1().encrypt('abcdefgh')).toBe('425af12a0743502b322e93a015bcf868e324d56a');
    expect(service.sha1().encrypt('type;chaussure|folder_name|' +
      'signature;url;secureUrl;assets/testing/url2.png;assets/testing/secureUrl2.png;110.0;80.0;' +
      'assets/testing/url3.png;assets/testing/secureUrl3.png;552.0;400.0;assets/testing/url4.png;' +
      'assets/testing/secureUrl4.png;1103.0;800.0|' +
      'signature2;url5;secureUrl5;assets/testing/url6.png;assets/testing/secureUrl6.png;110.0;80.0;' +
      'assets/testing/url7.png;assets/testing/secureUrl7.png;552.0;400.0;assets/testing/url8.png;' +
      'assets/testing/secureUrl8.png;1103.0;800.0'))
      .toBe('5acba3dc1c6bb5d7df07230d2538f4f938a002da');
  }));

});
