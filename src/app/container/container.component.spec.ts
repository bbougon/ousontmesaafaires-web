import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {Location} from '@angular/common';
import {ContainerComponent} from './container.component';
import {ContainerService} from './container.service';
import {By} from '@angular/platform-browser';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {FakeContainerService} from './testing/fake-container.service';
import {AppModule} from '../app.module';
import {Router} from '@angular/router';
import {FakeHttpErrorHandler} from '../../testing/fake-http-error-handler';

describe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;
  let containerService: ContainerService;
  let location: Location;
  let router: Router;

  beforeEach(async(async () => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ContainerService, useClass: FakeContainerService},
        {provide: HttpErrorHandler, useClass: FakeHttpErrorHandler}
      ],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render container empty', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(fixture.debugElement.query(By.css('.title')).nativeElement.textContent).toContain('Add a new container');
    expect(compiled.querySelector('label[for="containerName"]').textContent).toContain('Container:');
    expect(compiled.querySelector('label[for="featureType"]').textContent).toContain('Feature type:');
    expect(compiled.querySelector('div span')).toBeNull('Should be null');
  });

  it('should warn if container name is empty', () => {
    const compiled = fixture.debugElement.nativeElement;
    const containerName = fixture.debugElement.query(By.css('#containerName')).nativeElement;
    containerName.value = '';

    containerName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelector('#containerName').className).toContain('is-invalid');
    expect(compiled.querySelector('#containerNameFeedback').textContent).toContain('Please choose a name for your new container');
  });

  it('should warn if \'Add\' button is clicked and container name is empty', () => {
    containerService = fixture.debugElement.injector.get(ContainerService);
    const spiedService = spyOn(containerService, 'addContainer');
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent('#containerName', '');

    const button = compiled.querySelector('#addContainer');
    button.click();
    fixture.detectChanges();

    expect(spiedService).not.toHaveBeenCalled();
    expect(compiled.querySelector('#containerName').className).toContain('is-invalid');
    expect(compiled.querySelector('#containerNameFeedback').textContent).toContain('Please choose a name for your new container');
  });


  it('should warn if \'Add\' button is clicked and all fields are empty', () => {
    containerService = fixture.debugElement.injector.get(ContainerService);
    const spiedService = spyOn(containerService, 'addContainer');
    const compiled = fixture.debugElement.nativeElement;
    const spiedOpenComponent = spyOn(component.itemComponent.featureHint, 'open');
    setValueToInputAndDispatchEvent('#containerName', '');
    const button = compiled.querySelector('#addContainer');

    button.click();
    fixture.detectChanges();

    expect(spiedService).not.toHaveBeenCalled();
    expect(spiedOpenComponent).not.toHaveBeenCalled();
    expect(compiled.querySelector('#containerName').className).toContain('is-invalid');
    expect(compiled.querySelector('#containerNameFeedback').textContent).toContain('Please choose a name for your new container');
    expect(compiled.querySelector('#featureType').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureValue').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureTypeFeedback').textContent).toContain('Please fill a feature type');
    expect(compiled.querySelector('#featureValueFeedback').textContent).toContain('Please fill a feature value');
    expect(compiled.querySelector('span')).toBeNull();
  });

  it('should warn if \'Add\' button is clicked and no feature is available', () => {
    containerService = fixture.debugElement.injector.get(ContainerService);
    const spiedService = spyOn(containerService, 'addContainer');
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent('#containerName', 'Container');
    const button = compiled.querySelector('#addContainer');

    button.click();
    fixture.detectChanges();

    expect(spiedService).not.toHaveBeenCalled();
    expect(compiled.querySelector('#containerName').className).not.toContain('is-invalid');
    expect(compiled.querySelector('#featureType').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureValue').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureTypeFeedback').textContent).toContain('Please fill a feature type');
    expect(compiled.querySelector('#featureValueFeedback').textContent).toContain('Please fill a feature value');
    expect(compiled.querySelector('span')).toBeNull();
  });

  it('should release hint if \'Add\' button is clicked, item has already a feature but a new is filled without being added', () => {
    containerService = fixture.debugElement.injector.get(ContainerService);
    const spiedService = spyOn(containerService, 'addContainer');
    const compiled = fixture.debugElement.nativeElement;
    const spiedComponent = spyOn(component.itemComponent.featureHint, 'open');
    setValueToInputAndDispatchEvent('#containerName', 'Container');
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', 'chaussure').click();
    setValueToInput('#featureType', 'noir');
    setValueToInput('#featureValue', 'couleur');
    const button = compiled.querySelector('#addContainer');

    button.click();
    fixture.detectChanges();

    expect(spiedComponent).toHaveBeenCalled();
    expect(spiedService).not.toHaveBeenCalled();
    expect(compiled.querySelector('#containerName').className).not.toContain('is-invalid');
  });

  it('should navigate to container detail', fakeAsync(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    component.getDetails('an-id');

    tick(50);
    expect(location.path()).toBe('/containers/an-id');
  }));

  function setValueToInput(selector: string, value: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.textContent = value;
    input.value = value;
    return input;
  }

  function setValueToInputAndDispatchEvent(selector: string, value: string) {
    const input = setValueToInput(selector, value);
    input.dispatchEvent(new Event('input'));
  }

  function setValueOnFeaturesAndDispatchEvent(compiled: any, featureType: string, featureValue: string, selector?: string) {
    featureValue = featureValue || '';
    featureType = featureType || '';
    selector = selector ? selector.length > 0 ? selector + ' ' : '' : '';
    setValueToInputAndDispatchEvent(selector + '#featureType', featureType);
    setValueToInputAndDispatchEvent(selector.length > 0 ? selector + ' ' : '' + '#featureValue', featureValue);
    return compiled.querySelector('#itemForContainer button');
  }
});
