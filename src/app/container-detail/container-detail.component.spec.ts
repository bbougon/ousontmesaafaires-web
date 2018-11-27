import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerDetailComponent} from './container-detail.component';
import {ContainerService} from '../container/container.service';
import {CONTAINER, FakeContainerService} from '../container/testing/fake-container.service';
import {AppModule} from '../app.module';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {of} from 'rxjs/observable/of';
import {By} from '@angular/platform-browser';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UploadComponent} from '../upload/upload.component';
import {FakeNgbActiveModal, FakeNgbModal} from '../../testing/ng-modal/fake-ngb-modal';
import {Patch} from '../infrastructure/patch/patch';
import {CarouselComponent} from '../carousel/carousel.component';
import {MoveItemToContainerComponent} from '../move-item-to-container/move-item-to-container.component';
import {ExtractItemFromContainerComponent} from '../extract-item-from-container/extract-item-from-container.component';
import {Container} from '../domain/container';
import Spy = jasmine.Spy;

let activatedRoute: ActivatedRouteStub;

describe('ContainerDetailComponent', () => {

  const container = {
    'id': 'an-id',
    'name': 'Container',
    'items': [{
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
    }, {
      'item': {'type': 'pantalon', 'couleur': 'marron'},
      'imageStore': {
        'folder': 'folder_name_2',
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
      'itemHash': 'hash_2'
    }],
    'qrcode': 'a qr code',
    'description': 'Description'
  };

  let component: ContainerDetailComponent;
  let fixture: ComponentFixture<ContainerDetailComponent>;
  let containerService: ContainerService;
  let spiedContainerService: Spy;
  let spiedModalService: Spy;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setParamMap({id: CONTAINER.id});
    TestBed.configureTestingModule({
      providers: [
        {provide: ContainerService, useClass: FakeContainerService},
        {provide: NgbModal, useClass: FakeNgbModal},
        {provide: NgbActiveModal, useClass: FakeNgbActiveModal},
        {provide: ActivatedRoute, useValue: activatedRoute}
      ],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDetailComponent);
    component = fixture.componentInstance;
    containerService = fixture.debugElement.injector.get(ContainerService);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('is displayed on init', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(ContainerDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('with container details', () => {
      containerService = fixture.debugElement.injector.get(ContainerService);
      const spiedService = spyOn(containerService, 'getContainer').and.returnValue(of(container));

      component.ngOnInit();

      expect(spiedService).toHaveBeenCalled();
      expect(component.container).not.toBeNull();
      expect(component.container).toBeTruthy();
    });

    it('and thumbnail image', () => {
      component.container = CONTAINER;

      const url: string = component.getThumbnail(component.container.items[0].imageStore.images[0]);

      expect(url).toBe('assets/testing/secureUrl2.png');
    });

    it('with emtpy images', () => {
      component.container = new Container({
        'id': 'an-id',
        'name': 'Container',
        'items': [{
          'item': 'chaussure',
          'imageStore': {
            'folder': 'folder_name',
            'images': []
          },
          'itemHash': 'hash'
        }]
      });
      console.log('CONTAINER' + JSON.stringify(component.container));

      expect(component.containsImages(component.container.items[0].imageStore.images)).toBeFalsy();
    });
  });

  describe('opens modal to upload image', () => {

    let ngbModal: NgbModal;

    beforeEach(() => {
      fixture = TestBed.createComponent(ContainerDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      ngbModal = null;
      component = null;
      fixture = null;
    });

    it('for image upload', () => {
      ngbModal = fixture.debugElement.injector.get(NgbModal);
      spiedModalService = spyOn(ngbModal, 'open').and.returnValue({
        componentInstance: {
          item: CONTAINER.items[0],
          container: CONTAINER
        }
      });
      component.container = CONTAINER;
      const compiled = fixture.debugElement.nativeElement;
      fixture.detectChanges();

      const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item"] div > div > span');
      querySelectorAll[0].click();

      expect(spiedModalService).toHaveBeenCalledWith(UploadComponent, {size: 'lg'});
    });

    it('to display carousel for an item', () => {
      component.container = CONTAINER;
      ngbModal = fixture.debugElement.injector.get(NgbModal);
      spiedModalService = spyOn(ngbModal, 'open').and.returnValue({componentInstance: {images: CONTAINER.items[0].imageStore}});
      const compiled = fixture.debugElement.nativeElement;
      fixture.detectChanges();

      const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item"] div > div > div > img');
      querySelectorAll[0].click();

      expect(spiedModalService).toHaveBeenCalledWith(CarouselComponent, {
        size: 'sm',
        centered: true,
        windowClass: 'carousel-modal'
      });
    });
  });

  describe('interacts with container service when', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(ContainerDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('generating a sticker', () => {
      const ngbModal = fixture.debugElement.injector.get(NgbModal);
      spiedModalService = spyOn(ngbModal, 'open').and.returnValue({componentInstance: CONTAINER.items[0].imageStore});
      component.container = CONTAINER;
      component.generateSticker();
      fixture.detectChanges();

      expect(document.querySelectorAll('ngb-modal-window')).not.toBeNull();
    });

    it('adding an item to the container', () => {
      component.container = CONTAINER;
      const itemComponents = component.itemComponents.toArray();
      const spiedClearItemComponent = spyOn(itemComponents[0], 'clearItem');
      const compiled = fixture.debugElement.nativeElement;
      setValueOnFeaturesAndDispatchEvent(
        'marron', '#itemForContainer div div div #featureValue');
      fixture.detectChanges();
      const addItemButton = compiled.querySelector('#addItemToContainer');

      addItemButton.click();
      fixture.detectChanges();

      const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item"] div.row div.col-md-10.col-10');
      const querySelector = querySelectorAll[1];
      expect(querySelector.textContent).toContain('pantalon marron');
      expect(spiedClearItemComponent).toHaveBeenCalled();
    });

    describe('adding a description to the container', () => {

      beforeEach(() => {
        fixture = TestBed.createComponent(ContainerDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('on key press enter', async(() => {
        const {compiled, containerDescription} = setUp();

        containerDescription.triggerEventHandler('keyup.enter', {});
        fixture.detectChanges();

        expectDescriptionCreation(compiled);
      }));

      it('on blur', async(() => {
        const {compiled, containerDescription} = setUp();

        containerDescription.triggerEventHandler('blur', {});
        fixture.detectChanges();

        expectDescriptionCreation(compiled);
      }));

      const expectDescriptionCreation = function (compiled: any) {
        expect(spiedContainerService).toHaveBeenCalledWith('an-id', new Patch('item.description').unwrap('A content'));
        expect(compiled.querySelector('#containerDescription').attributes['hidden']).toBeTruthy();
        expect(compiled.querySelector('#displayDescription').attributes['hidden']).toBeFalsy();
        expect(compiled.querySelector('#displayDescription').textContent).toContain('A content');
      };

      const setUp = function () {
        spiedContainerService = spyOn(containerService, 'patchContainer').and.returnValue(of(''));
        component.container = CONTAINER;
        const compiled = fixture.debugElement.nativeElement;
        const pencil = compiled.querySelector('#pencil');
        pencil.click();
        fixture.detectChanges();
        const containerDescription = fixture.debugElement.query(By.css('#containerDescription'));
        containerDescription.nativeElement.textContent = 'A content';
        containerDescription.nativeElement.value = 'A content';
        return {compiled, containerDescription};
      };
    });

    describe('extracting an item from a container', () => {
      let ngbModal: NgbModal;

      beforeEach(() => {
        fixture = TestBed.createComponent(ContainerDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      afterEach(() => {
        ngbModal = null;
        component = null;
        fixture = null;
      });

      it('to a new container', () => {
        ngbModal = fixture.debugElement.injector.get(NgbModal);
        spiedModalService = spyOn(ngbModal, 'open').and
          .returnValue({componentInstance: {item: CONTAINER.items[0], containerId: 'an-id', target: 'NEW'}});
        component.container = CONTAINER;
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();

        const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item"] div > div > span');
        querySelectorAll[1].click();

        expect(spiedModalService).toHaveBeenCalledWith(ExtractItemFromContainerComponent, {size: 'lg'});
      });
    });

    describe('moving an item to', () => {

      let ngbModal: NgbModal;

      beforeEach(() => {
        fixture = TestBed.createComponent(ContainerDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      afterEach(() => {
        ngbModal = null;
        component = null;
        fixture = null;
      });

      it('an existing container', () => {
        ngbModal = fixture.debugElement.injector.get(NgbModal);
        spiedModalService = spyOn(ngbModal, 'open').and
          .returnValue({componentInstance: {item: CONTAINER.items[0], containerId: 'an-id'}});
        component.container = CONTAINER;
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();

        const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item"] div > div > span');
        querySelectorAll[2].click();

        expect(spiedModalService).toHaveBeenCalledWith(MoveItemToContainerComponent, {size: 'lg'});
      });
    });
  });

  describe('toggles with description input', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(ContainerDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('toggles to input when click on pencil', () => {
      component.container = CONTAINER;
      const compiled = fixture.debugElement.nativeElement;
      const pencil = compiled.querySelector('#pencil');

      pencil.click();
      fixture.detectChanges();

      expect(compiled.querySelector('#containerDescription').attributes['hidden']).toBeFalsy();
      expect(compiled.querySelector('#containerDescription').value).toContain(component.container.description);
      expect(compiled.querySelector('#displayDescription').attributes['hidden']).toBeTruthy();
    });

    it('toggles to display div when click on pencil a second time', () => {
      component.container = CONTAINER;
      const compiled = fixture.debugElement.nativeElement;
      const pencil = compiled.querySelector('#pencil');

      pencil.click();
      pencil.click();
      fixture.detectChanges();

      expect(compiled.querySelector('#containerDescription').attributes['hidden']).toBeTruthy();
      expect(compiled.querySelector('#displayDescription').attributes['hidden']).toBeFalsy();
    });

  });

  function setValueToInputAndDispatchEvent(value: string, selector: string, eventType: string) {
    eventType = eventType || 'input';
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event(eventType));
  }

  function setValueOnFeaturesAndDispatchEvent(featureValue: string, featureValueSelector: string) {
    featureValueSelector = featureValueSelector || '#featureValue';
    featureValue = featureValue || '';
    setValueToInputAndDispatchEvent(featureValue, featureValueSelector, 'blur');
  }
});
