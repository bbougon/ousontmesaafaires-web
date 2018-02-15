///<reference path="../../../node_modules/@angular/core/testing/src/test_bed.d.ts"/>
import {async, inject, TestBed} from '@angular/core/testing';
import {LocationService} from './location.service';
import {HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders, HttpRequest} from '@angular/common/http';
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

  describe('when adding location', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    function expectPost(mockBackend: HttpTestingController, locationCreatedUrl: string) {
      mockBackend.expectOne(environment.locationResource)
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
          return req.url === environment.locationResource
            && req.responseType === 'text'
            && req.headers.get('Content-Type') === 'application/json';
        }, 'POST to location with response type and headers');
      })));

    it('should have expected location', async(
      inject([LocationService, HttpTestingController], (locationService: LocationService, mockBackend: HttpTestingController) => {
        const expectedLocationCreated = new LocationCreated('an id', [new Item({'type': 'thing'})], 'A location');
        locationService.addLocation(new NewLocation('A location', {type: 'thing'}))
          .subscribe(location => {
            expect(location).not.toBeNull();
            expect(location).toBe(expectedLocationCreated);

          });

        expectPost(mockBackend, 'location-created-url');
        mockBackend.expectOne('location-created-url').flush(expectedLocationCreated, {
          status: 200,
          statusText: 'OK'
        });

      })));
  });

});
