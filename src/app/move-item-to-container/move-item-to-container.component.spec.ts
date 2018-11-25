import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {MoveItemToContainerComponent} from './move-item-to-container.component';
import {ContainerService} from '../container/container.service';
import {Item} from '../domain/item';
import {Container} from '../domain/container';
import {of} from 'rxjs/observable/of';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {FakeHttpErrorHandler} from '../../testing/fake-http-error-handler';
import {Router} from '@angular/router';
import {AppModule} from '../app.module';
import Spy = jasmine.Spy;

describe('MoveItemToContainerComponent', () => {

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
    'hash': 'hash'
  };

  const newContainer = {
    'id': 'new-id',
    'name': 'Container',
    'items': [item],
    'qrcode': 'a qr code',
    'description': 'Description'
  };

  let component: MoveItemToContainerComponent;
  let fixture: ComponentFixture<MoveItemToContainerComponent>;
  let spiedContainerService: Spy;
  let containerService: ContainerService;
  let spiedCloseModal: Spy;
  let spiedRouter: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, AppModule],
      providers: [
        NgbActiveModal,
        ContainerService,
        {provide: HttpErrorHandler, useClass: FakeHttpErrorHandler}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveItemToContainerComponent);
    component = fixture.componentInstance;
    containerService = fixture.debugElement.injector.get(ContainerService);
    spiedContainerService = spyOn(containerService, 'moveItemToContainer')
      .and.returnValue(of(new Container(newContainer)));
    component.containerId = '12345';
    component.item = new Item(item.item);
    spiedCloseModal = spyOn(component.activeModal, 'close');
    spiedRouter = spyOn(fixture.debugElement.injector.get(Router), 'navigateByUrl');
    fixture.detectChanges();
  });

  it('should create',
    inject([HttpClient, HttpErrorHandler], (httpClient: HttpClient, errorHandler: HttpErrorHandler) => {
      expect(component).toBeTruthy();
    }));

});
