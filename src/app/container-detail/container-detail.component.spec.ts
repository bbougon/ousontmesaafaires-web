import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerDetailComponent} from './container-detail.component';
import {ContainerService} from '../container/container.service';
import {FakeContainerService, CONTAINER} from '../container/testing/fake-container.service';
import {AppModule} from '../app.module';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {of} from 'rxjs/observable/of';
import {By} from '@angular/platform-browser';

let activatedRoute: ActivatedRouteStub;

describe('ContainerDetailComponent', () => {
  let component: ContainerDetailComponent;
  let fixture: ComponentFixture<ContainerDetailComponent>;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setParamMap({id: CONTAINER.id});
    TestBed.configureTestingModule({
      providers: [
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get container details on init', () => {
    const containerService = fixture.debugElement.injector.get(ContainerService);
    const spiedService = spyOn(containerService, 'getContainer').and.returnValue(of(CONTAINER));

    component.ngOnInit();

    expect(spiedService).toHaveBeenCalled();
    expect(component.container).not.toBeNull();
    expect(component.container).toBeTruthy();
  });

  it('calls containers service when generating a sticker', () => {
    component.container = CONTAINER;
    component.generateSticker();
    fixture.detectChanges();

    expect(document.querySelectorAll('ngb-modal-window').length).toBe(1);
  });

  it('calls container service when adding an item to the container', () => {
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

    const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item"] div.row');
    const querySelector = querySelectorAll[1];
    expect(querySelector.textContent).toContain('Couleur: marron');
    expect(spiedClearItemComponent).toHaveBeenCalled();
  });

  describe('ContainerDetailComponent toggle description input', () => {

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
