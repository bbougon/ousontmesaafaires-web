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
import Spy = jasmine.Spy;

let activatedRoute: ActivatedRouteStub;

describe('ContainerDetailComponent', () => {
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
        {provide: NgbModal, useClass: FakeNgbModal},
        {provide: NgbActiveModal, useClass: FakeNgbActiveModal},
        {provide: ContainerService, useClass: FakeContainerService},
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
      const spiedService = spyOn(containerService, 'getContainer').and.returnValue(of(CONTAINER));

      component.ngOnInit();

      expect(spiedService).toHaveBeenCalled();
      expect(component.container).not.toBeNull();
      expect(component.container).toBeTruthy();
    });

    it('and thumbnail image', () => {
      component.container = CONTAINER;

      const url: string = component.getThumbnail(component.container.items[0].item.imageStore.images[0]);

      expect(url).toBe('assets/testing/secureUrl2.png');
    });

  });

  describe('opens modal', () => {

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
      spiedModalService = spyOn(ngbModal, 'open').and.returnValue({componentInstance: {item: CONTAINER.items[0], container: CONTAINER}});
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
      spiedModalService = spyOn(ngbModal, 'open').and.returnValue({componentInstance: {images: CONTAINER.items[0].item.imageStore}});
      const compiled = fixture.debugElement.nativeElement;
      fixture.detectChanges();

      const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item"] div > div > div > img');
      querySelectorAll[0].click();

      expect(spiedModalService).toHaveBeenCalledWith(CarouselComponent, {size: 'lg', centered: true});
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
      spiedModalService = spyOn(ngbModal, 'open').and.returnValue({componentInstance: CONTAINER.items[0]});
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
      setValueOnFeaturesAndDispatchEvent(compiled, 'couleur', '#itemForContainer div div div #featureType',
        'marron', '#itemForContainer div div div #featureValue', '#itemForContainer div div div button').click();
      fixture.detectChanges();
      const addItemButton = compiled.querySelector('#addItemToContainer');

      addItemButton.click();
      fixture.detectChanges();

      const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item"] div.row div.col-md-10.col-10');
      const querySelector = querySelectorAll[1];
      expect(querySelector.textContent).toContain('Couleur: marron');
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
        expect(spiedContainerService).toHaveBeenCalledWith('an-id', new Patch('description').unwrap('A content'));
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

  function setValueToInputAndDispatchEvent(value: string, selector: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function setValueOnFeaturesAndDispatchEvent(compiled: any, featureType: string, featureTypeSelector: string,
                                              featureValue: string, featureValueSelector: string, buttonSelector: string) {
    buttonSelector = buttonSelector || 'button';
    featureValueSelector = featureValueSelector || '#featureValue';
    featureTypeSelector = featureTypeSelector || '#featureType';
    featureValue = featureValue || '';
    featureType = featureType || '';
    setValueToInputAndDispatchEvent(featureType, featureTypeSelector);
    setValueToInputAndDispatchEvent(featureValue, featureValueSelector);
    return compiled.querySelector(buttonSelector);
  }
});
