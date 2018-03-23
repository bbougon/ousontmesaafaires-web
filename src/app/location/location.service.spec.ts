///<reference path="../../../node_modules/@angular/core/testing/src/test_bed.d.ts"/>
import {async, inject, TestBed} from '@angular/core/testing';
import {LocationService} from './location.service';
import {HttpClient, HttpClientModule, HttpHeaders, HttpRequest} from '@angular/common/http';
import {NewLocation} from '../domain/new-location';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../environments/environment';
import {LocationCreated} from '../domain/location-created';
import {Item} from '../domain/item';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {MessageService} from '../infrastructure/message.service';

describe('LocationService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        LocationService, HttpErrorHandler, MessageService
      ]
    })
      .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([LocationService], (service: LocationService) => {
      expect(service instanceof LocationService).toBe(true);
    }));

  it('can instantiate service with "new"',
    inject([HttpClient, HttpErrorHandler], (httpClient: HttpClient, errorHandler: HttpErrorHandler) => {
      expect(httpClient).not.toBeNull('http should be provided');
      const service = new LocationService(httpClient, errorHandler);
      expect(service instanceof LocationService).toBe(true, 'new service should be ok');
    }));

  describe('when getting locations', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('should get all locations', async(
      inject([LocationService, HttpTestingController], (locationService: LocationService, mockBackend: HttpTestingController) => {
        locationService.getLocations().subscribe(locations => {
          expect(locations.length).toBe(2);
        });

        mockBackend.expectOne(`${environment.apiUrl}/locations`).flush([{
          'id': 'an id 1', 'items': [{'item': {'type': 'chaussure'}}],
          'location': 'Location 1', 'qrcode': 'qrcode'
        }, {
          'id': 'an id 2', 'items': [{'item': {'type': 'pantalon'}}],
          'location': 'Location 2', 'qrcode': 'qrcode'
        }], {status: 200, statusText: 'OK'});
      })));
  });


  describe('when adding location', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    function expectPost(mockBackend: HttpTestingController, locationCreatedUrl: string) {
      mockBackend.expectOne(`${environment.apiUrl}/locations`)
        .flush(null, {
          status: 201,
          statusText: 'CREATED',
          headers: new HttpHeaders().set('Location', locationCreatedUrl)
        });
    }

    it('should have post a location with expected request', async(
      inject([LocationService, HttpTestingController], (locationService: LocationService, mockBackend: HttpTestingController) => {
        locationService.addLocation(new NewLocation('A location', {type: 'thing'}))
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/locations'
            && req.responseType === 'text'
            && req.headers.get('Content-Type') === 'application/json';
        }, 'POST to location with response type and headers');
      })));

    it('should have expected location', async(
      inject([LocationService, HttpTestingController], (locationService: LocationService, mockBackend: HttpTestingController) => {
        const expectedLocationCreated = new LocationCreated({
          'id': 'an id', 'items': [{'item': {'type': 'thing'}}],
          'item': 'A location', 'qrcode': 'qrcode'
        });
        locationService.addLocation(new NewLocation('A location', {type: 'thing'}))
          .subscribe(location => {
            expect(location).not.toBeNull();
            expect(location.id).toBe('an id');

          });

        expectPost(mockBackend, 'location-created-url');
        mockBackend.expectOne('location-created-url').flush(expectedLocationCreated, {
          status: 200,
          statusText: 'OK'
        });

      })));
  });

  describe('when adding item to location', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('should have post an item to a location with expected request', async(
      inject([LocationService, HttpTestingController], (locationService: LocationService, mockBackend: HttpTestingController) => {
        locationService.addItemToLocation('an-id', new Item({'couleur': 'rouge'}))
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/locations/an-id/item'
            && req.responseType === 'text'
            && req.headers.get('Content-Type') === 'application/json';
        }, 'POST to location with response type and headers');
      })));

    it('should have post expected item', async(
      inject([LocationService, HttpTestingController], (locationService: LocationService, mockBackend: HttpTestingController) => {
        locationService.addItemToLocation('an-id', new Item({'couleur': 'rouge'}))
          .subscribe(() => {
            expect(this).not.toBeNull();

          });

        mockBackend.expectOne(`${environment.apiUrl}/locations/an-id/item`).flush(null, {
          status: 204,
          statusText: 'NO_CONTENT'
        });

      })));
  });

  describe('when generating sticker', () => {
    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('should have put an URL to location', async(
      inject([LocationService, HttpTestingController], (locationService: LocationService, mockBackend: HttpTestingController) => {
        locationService.generateSticker('an-url', 'an-id').subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/locations/sticker/an-id'
            && req.responseType === 'arraybuffer'
            && req.headers.get('Content-Type') === 'application/octet-stream'
            && req.method === 'PUT';
        }, 'PUT to location with response type headers and method');
      })
    ));

    it('should handle expected response', async(
      inject([LocationService, HttpTestingController], (locationService: LocationService, mockBackend: HttpTestingController) => {
        locationService.generateSticker('an-url', 'an-id')
          .subscribe(() => {
            expect(this).not.toBeNull();
          });

        mockBackend.expectOne(`${environment.apiUrl}/locations/sticker/an-id`).flush(new ArrayBuffer(10), {
          status: 200,
          statusText: 'OK'
        });
      })
    ));
  });

});
