import {async, inject, TestBed} from '@angular/core/testing';

import {ExtractedItemService} from './extracted-item.service';
import {FakeHttpErrorHandler} from '../../testing/fake-http-error-handler';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Item} from '../domain/item';
import {HttpClientModule, HttpHeaders, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ExtractedItem} from '../domain/extracted-item';
import {CONTAINER} from '../container/testing/fake-container.service';

describe('ExtractedItemService', () => {

  const item = {
    'item': {'type': 'chaussure'},
    'imageStore': {
      'folder': 'folder_name',
      'images': [{
        'signature': 'signature',
        'url': 'assets/testing/url.png',
        'secureUrl': 'assets/testing/secureUrl.png',
        'resizedImages': [{
          'url': 'assets/testing/url2.png',
          'secureUrl': 'assets/testing/secureUrl2.png',
          'height': 110.0,
          'width': 80.0
        }, {
          'url': 'assets/testing/url3.png',
          'secureUrl': 'assets/testing/secureUrl3.png',
          'height': 552.0,
          'width': 400.0
        }, {
          'url': 'assets/testing/url4.png',
          'secureUrl': 'assets/testing/secureUrl4.png',
          'height': 1103.0,
          'width': 800.0
        }]
      }]
    },
    'hash': 'hash'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        {provide: HttpErrorHandler, useClass: FakeHttpErrorHandler},
        ExtractedItemService
      ]
    });

  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', inject([ExtractedItemService], (service: ExtractedItemService) => {
    expect(service).toBeTruthy();
  }));

  it('creates an extracted-item', async(
    inject([ExtractedItemService, HttpTestingController],
      (extractedItemsService: ExtractedItemService, mockBackend: HttpTestingController) => {
        extractedItemsService.extractItem(new Item(item), 'an-id').subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          console.log(req.body);
          return req.url === `${environment.apiUrl}/extracted-items`
            && req.method === 'POST'
            && req.responseType === 'text'
            && req.headers.get('Content-Type') === 'application/json'
            && JSON.stringify(req.body) === `{"containerId":"an-id","itemHash":"hash"}`;
        }, 'POST extract item');
      }))
  );

  it('return expected extracted item', async(
    inject([ExtractedItemService, HttpTestingController],
      (extractedItemsService: ExtractedItemService, mockBackend: HttpTestingController) => {
        const expectedExtractedItem = new ExtractedItem('an-id', item, CONTAINER);

        extractedItemsService.extractItem(new Item(item), 'an-id')
          .subscribe((extractedItem) => {
            expect(extractedItem).not.toBeNull();
          });


        mockBackend.expectOne(`${environment.apiUrl}/extracted-items`).flush(null, {
          status: 201,
          statusText: 'CREATED',
          headers: new HttpHeaders().set('Location', 'new-extracted-item-url')
        });
        mockBackend.expectOne('new-extracted-item-url').flush(expectedExtractedItem, {
          status: 200,
          statusText: 'OK'
        });

      }))
  );
});
