import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerDetailComponent} from './container-detail.component';
import {ContainerService} from '../container/container.service';
import {CONTAINER} from '../container/testing/fake-container.service';
import {AppModule} from '../app.module';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {of} from 'rxjs/observable/of';
import {By} from '@angular/platform-browser';
import Spy = jasmine.Spy;

let activatedRoute: ActivatedRouteStub;

describe('ContainerDetailComponent', () => {
  let component: ContainerDetailComponent;
  let fixture: ComponentFixture<ContainerDetailComponent>;
  let containerService: ContainerService;
  let spiedContainerService: Spy;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setParamMap({id: CONTAINER.id});
    TestBed.configureTestingModule({
      providers: [
        ContainerService,
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

  it('adds the container\'s description', async(() => {
    spiedContainerService = spyOn(containerService, 'addDescription').and.returnValue(of(''));
    component.container = CONTAINER;
    const compiled = fixture.debugElement.nativeElement;
    const pencil = compiled.querySelector('#pencil');
    pencil.click();
    fixture.detectChanges();
    const containerDescription = fixture.debugElement.query(By.css('#containerDescription'));
    containerDescription.nativeElement.textContent = 'A content';
    containerDescription.nativeElement.value = 'A content';

    containerDescription.triggerEventHandler('keypress.enter', {});

    expect(spiedContainerService).toHaveBeenCalled();
    expect(compiled.querySelector('#containerDescription').attributes['hidden']).toBeTruthy();
    expect(compiled.querySelector('#displayDescription').attributes['hidden']).toBeFalsy();
  }));

  // it('toggles to display div when click on pencil a second time', () => {
  //   component.container = CONTAINER;
  //   const compiled = fixture.debugElement.nativeElement;
  //   const pencil = compiled.querySelector('#pencil');
  //
  //   pencil.click();
  //   pencil.click();
  //   fixture.detectChanges();
  //
  //   expect(compiled.querySelector('#containerDescription').attributes['hidden']).toBeTruthy();
  //   expect(compiled.querySelector('#displayDescription').attributes['hidden']).toBeFalsy();
  // });


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
