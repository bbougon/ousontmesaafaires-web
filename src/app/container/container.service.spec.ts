///<reference path="../../../node_modules/@angular/core/testing/src/test_bed.d.ts"/>
import {async, inject, TestBed} from '@angular/core/testing';
import {ContainerService} from './container.service';
import {HttpClient, HttpClientModule, HttpHeaders, HttpRequest} from '@angular/common/http';
import {NewContainer} from '../domain/new-container';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../environments/environment';
import {Container} from '../domain/container';
import {Item} from '../domain/item';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalStack} from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import {FakeHttpErrorHandler} from '../../testing/fake-http-error-handler';
import {Patch} from '../infrastructure/patch/patch';

describe('ContainerService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        {provide: HttpErrorHandler, useClass: FakeHttpErrorHandler},
        ContainerService, NgbModal, NgbModalStack
      ]
    })
      .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([ContainerService], (service: ContainerService) => {
      expect(service instanceof ContainerService).toBe(true);
    }));

  it('can instantiate service with "new"',
    inject([HttpClient, HttpErrorHandler], (httpClient: HttpClient, errorHandler: HttpErrorHandler) => {
      expect(httpClient).not.toBeNull('http should be provided');
      const service = new ContainerService(httpClient, errorHandler);
      expect(service instanceof ContainerService).toBe(true, 'new service should be ok');
    }));

  describe('when getting containers', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('should get all containers', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.getContainers().subscribe(containers => {
          expect(containers.length).toBe(2);
        });

        mockBackend.expectOne(`${environment.apiUrl}/containers`).flush([{
          'id': 'an id 1', 'items': [{'item': {'type': 'chaussure'}}],
          'name': 'Container 1', 'qrcode': 'qrcode'
        }, {
          'id': 'an id 2', 'items': [{'item': {'type': 'pantalon'}}],
          'name': 'Container 2', 'qrcode': 'qrcode'
        }], {status: 200, statusText: 'OK'});
      })));
  });


  describe('when adding container', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    function expectPost(mockBackend: HttpTestingController, containerURL: string) {
      mockBackend.expectOne(`${environment.apiUrl}/containers`)
        .flush(null, {
          status: 201,
          statusText: 'CREATED',
          headers: new HttpHeaders().set('Location', containerURL)
        });
    }

    it('should have post a container with expected request', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.addContainer(new NewContainer('A container', {type: 'thing'}))
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/containers'
            && req.responseType === 'text'
            && req.headers.get('Content-Type') === 'application/json';
        }, 'POST to container with response type and headers');
      })));

    it('should have expected container', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        const expectedContainer = new Container({
          'id': 'an id', 'items': [{'item': {'type': 'thing'}}],
          'name': 'A container', 'qrcode': 'qrcode'
        });
        containerService.addContainer(new NewContainer('A container', {type: 'thing'}))
          .subscribe(container => {
            expect(container).not.toBeNull();
            expect(container.id).toBe('an id');
          });

        expectPost(mockBackend, 'container-created-url');
        mockBackend.expectOne('container-created-url').flush(expectedContainer, {
          status: 200,
          statusText: 'OK'
        });

      })));
  });

  describe('when adding item to container', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('should have post an item to a container with expected request', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.addItemToContainer('an-id', new Item({'couleur': 'rouge'}))
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/containers/an-id/item'
            && req.responseType === 'text'
            && req.headers.get('Content-Type') === 'application/json';
        }, 'POST to container with response type and headers');
      })));

    it('should have post expected item', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.addItemToContainer('an-id', new Item({'couleur': 'rouge'}))
          .subscribe(() => {
            expect(this).not.toBeNull();
          });

        mockBackend.expectOne(`${environment.apiUrl}/containers/an-id/item`).flush(null, {
          status: 204,
          statusText: 'NO_CONTENT'
        });

      })));
  });

  describe('when getting a container', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('should get the expected container with expected request', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.getContainer('an-id')
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/containers/an-id';
        }, 'GET container');
      })));

    it('should get container with expected content', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.getContainer('an-id')
          .subscribe((container) => {
            expect(container).not.toBeNull();
            expect(container.id).toBe('an-id');
          });

        mockBackend.expectOne(`${environment.apiUrl}/containers/an-id`).flush({
          'id': 'an-id', 'items': [{'item': {'type': 'chaussure'}}],
          'name': 'Container 1', 'qrcode': 'qrcode'
        }, {
          status: 200,
          statusText: 'OK'
        });

      })));
  });

  describe('when interacting with a container', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('can add a description to container', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.patchContainer('an-id', new Patch('description').unwrap('A description'))
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          console.log(req.body);
          return req.url === environment.apiUrl + '/containers/an-id'
            && req.method === 'PATCH'
            && JSON.stringify(req.body) === '{"target":"description","id":"","data":"A description"}';
        }, 'PATCH container');
      })));
  });

});
