import {async, inject, TestBed} from '@angular/core/testing';

import {SignatureService} from './signature.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClientModule, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FakeHttpErrorHandler} from '../../testing/fake-http-error-handler';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';

describe('SignatureService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        {provide: HttpErrorHandler, useClass: FakeHttpErrorHandler},
        SignatureService]
    })
      .compileComponents();
  }));

  it('should be created', inject([SignatureService], (service: SignatureService) => {
    expect(service).toBeTruthy();
  }));

  describe('signs the data', () => {
    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('should get the expected container with expected request', async(
      inject([SignatureService, HttpTestingController], (signatureService: SignatureService, mockBackend: HttpTestingController) => {
        signatureService.sign({eager: 'eager', folder: '123456', public_id: 'public_id', timestamp: 1234567890})
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/sign'
            && req.method === 'POST'
            && JSON.stringify(req.body) === '{"eager":"eager","folder":"123456","public_id":"public_id","timestamp":1234567890}';
        }, 'POST sign');
      }))
    );

    it('should get all containers', async(
      inject([SignatureService, HttpTestingController], (signatureService: SignatureService, mockBackend: HttpTestingController) => {
        signatureService.sign({eager: 'eager', folder: '12457', public_id: 'public_id', timestamp: 1234567890})
          .subscribe(signature => {
            expect(signature.apiKey).toBe('abcedfgh');
            expect(signature.signature).toBe('jksdhdfurfkdfkj');
          });

        mockBackend.expectOne(`${environment.apiUrl}/sign`).flush({
          'apiKey': 'abcedfgh', 'signature': 'jksdhdfurfkdfkj'
        }, {status: 200, statusText: 'OK'});
      }))
    );
  });
});
