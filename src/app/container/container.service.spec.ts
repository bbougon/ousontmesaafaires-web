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
import {ImageStore} from '../domain/image-store';
import {Destination} from '../domain/destination';

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
          'id': 'an id 1', 'items': [{'item': 'chaussure'}],
          'name': 'Container 1', 'qrcode': 'qrcode'
        }, {
          'id': 'an id 2', 'items': [{'item': 'pantalon'}],
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
        containerService.addContainer(new NewContainer('A container', new Item('thing')))
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
        containerService.addContainer(new NewContainer('A container', new Item('thing')))
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
        containerService.addItemToContainer('an-id',
          new Item('couleur rouge', new ImageStore('folder'), 'abcdef'))
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/containers/an-id/item'
            && req.responseType === 'text'
            && req.headers.get('Content-Type') === 'application/json';
        }, 'POST to container with response type and headers');
      })));

    it('should have post expected item', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.addItemToContainer('an-id',
          new Item('couleur rouge', new ImageStore('folder'), 'zetrydhsk'))
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
      }))
    );

    it('should get container with expected content', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.getContainer('an-id')
          .subscribe((container) => {
            expect(container).not.toBeNull();
            expect(container.id).toBe('an-id');
          });

        mockBackend.expectOne(`${environment.apiUrl}/containers/an-id`).flush({
          'id': 'an-id', 'items': [{'item': 'chaussure'}],
          'name': 'Container 1', 'qrcode': 'qrcode'
        }, {
          status: 200,
          statusText: 'OK'
        });

      }))
    );
  });

  describe('when patching a container', () => {

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('can add a description to container', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.patchContainer('an-id', new Patch('description').unwrap('A description'))
          .subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === environment.apiUrl + '/containers/an-id'
            && req.method === 'PATCH'
            && JSON.stringify(req.body) === '{"target":"description","id":"","version":1,"data":"A description"}';
        }, 'PATCH container');
      }))
    );

    it('return expected container', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.patchContainer('an-id', new Patch('description').unwrap('A description'))
          .subscribe((container) => {
            expect(container).not.toBeNull();
            expect(container.id).toBe('an-id');
          });

        mockBackend.expectOne(`${environment.apiUrl}/containers/an-id`).flush({
          'id': 'an-id', 'items': [{'item': 'chaussure', 'imageStore': {'folder': 'folder'}}],
          'name': 'Container 1', 'qrcode': 'qrcode'
        }, {
          status: 200,
          statusText: 'OK'
        });

      })));
  });

  describe('when moving an item to a container', () => {

    const item = {
      'item': 'chaussure',
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
      'itemHash': 'hash'
    };

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }));

    it('moves item to a container', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        containerService.moveItemToContainer(new Item(item.item, item.imageStore, item.itemHash), 'an-id',
          new Destination('another-container-id')).subscribe();

        mockBackend.expectOne((req: HttpRequest<any>) => {
          return req.url === `${environment.apiUrl}/containers/an-id/items/hash`
            && req.method === 'POST'
            && JSON.stringify(req.body) === '{"destination":"another-container-id"}';
        }, 'POST moving item to new container container');
      }))
    );

    it('return expected container', async(
      inject([ContainerService, HttpTestingController], (containerService: ContainerService, mockBackend: HttpTestingController) => {
        const expectedContainer = new Container({
          'id': 'an-id', 'items': [item],
          'name': 'A container', 'qrcode': 'qrcode'
        });
        containerService.moveItemToContainer(new Item(item.item, item.imageStore, item.itemHash),
          'an-id', new Destination('another-container-id'))
          .subscribe((container) => {
            expect(container).not.toBeNull();
            expect(container.id).toBe('an-id');
          });


        mockBackend.expectOne(`${environment.apiUrl}/containers/an-id/items/hash`).flush(null, {
          status: 201,
          statusText: 'CREATED',
          headers: new HttpHeaders().set('Location', 'new-container-url')
        });
        mockBackend.expectOne('new-container-url').flush(expectedContainer, {
          status: 200,
          statusText: 'OK'
        });

      }))
    );
  });

});
