import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {ExtractItemFromContainerComponent} from './extract-item-from-container.component';
import {FakeHttpErrorHandler} from '../../testing/fake-http-error-handler';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {ContainerService} from '../container/container.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppModule} from '../app.module';
import {CONTAINER} from '../container/testing/fake-container.service';
import {Item} from '../domain/item';
import {Router} from '@angular/router';
import {ExtractedItem} from '../domain/extracted-item';
import {of} from 'rxjs/observable/of';
import {ExtractedItemService} from '../extracted-item/extracted-item.service';
import Spy = jasmine.Spy;

describe('ExtractItemFromContainerComponent', () => {

  let component: ExtractItemFromContainerComponent;
  let fixture: ComponentFixture<ExtractItemFromContainerComponent>;
  let spiedExtractedItemsService: Spy;
  let extractedItemsService: ExtractedItemService;
  let spiedCloseModal: Spy;
  let spiedRouter: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, AppModule],
      providers: [
        NgbActiveModal,
        ExtractedItemService,
        {provide: HttpErrorHandler, useClass: FakeHttpErrorHandler}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractItemFromContainerComponent);
    component = fixture.componentInstance;
    extractedItemsService = fixture.debugElement.injector.get(ExtractedItemService);
    spiedExtractedItemsService = spyOn(extractedItemsService, 'extractItem')
      .and.returnValue(of(new ExtractedItem('new-id', CONTAINER.items[0], CONTAINER)));
    component.containerId = CONTAINER.id;
    component.item = new Item(CONTAINER.items[0]);
    spiedCloseModal = spyOn(component.activeModal, 'close');
    spiedRouter = spyOn(fixture.debugElement.injector.get(Router), 'navigateByUrl');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Extract item', () => {
    it('', inject([HttpClient, HttpErrorHandler], (httpClient: HttpClient, errorHandler: HttpErrorHandler) => {
      const compiled = fixture.debugElement.nativeElement;

      const button = compiled.querySelectorAll('button');
      button[1].click();

      expect(spiedExtractedItemsService).toHaveBeenCalledWith(component.item, component.containerId);
      expect(spiedCloseModal).toHaveBeenCalledTimes(1);
      expect(spiedRouter).toHaveBeenCalledWith('/extracted-items/new-id');
    }));
  });
});
