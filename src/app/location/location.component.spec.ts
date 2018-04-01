import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {By} from '@angular/platform-browser';
import {MessageService} from '../infrastructure/message.service';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {FakeLocationService} from './testing/fake-location.service';
import {AppModule} from '../app.module';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;
  let locationService: LocationService;

  beforeEach(async(async () => {
    TestBed.configureTestingModule({
      providers: [{provide: LocationService, useClass: FakeLocationService},
        HttpErrorHandler, MessageService],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render location empty', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(fixture.debugElement.query(By.css('.title')).nativeElement.textContent).toContain('Add location');
    expect(compiled.querySelector('label[for="locationName"]').textContent).toContain('Location name:');
    expect(compiled.querySelector('label[for="featureType"]').textContent).toContain('Feature type:');
    expect(compiled.querySelector('div span')).toBeNull('Should be null');
  });

  it('should warn if location name is empty', () => {
    const compiled = fixture.debugElement.nativeElement;
    const locationName = fixture.debugElement.query(By.css('#locationName')).nativeElement;
    locationName.value = '';

    locationName.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelector('#locationName').className).toContain('is-invalid');
    expect(compiled.querySelector('#locationNameFeedback').textContent).toContain('Please choose a location name');
  });

  it('should warn if \'Add\' button is clicked and location name is empty', () => {
    locationService = fixture.debugElement.injector.get(LocationService);
    const spiedLocationService = spyOn(locationService, 'addLocation');
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent('#locationName', '');

    const button = compiled.querySelector('#addLocation');
    button.click();
    fixture.detectChanges();

    expect(spiedLocationService).not.toHaveBeenCalled();
    expect(compiled.querySelector('#locationName').className).toContain('is-invalid');
    expect(compiled.querySelector('#locationNameFeedback').textContent).toContain('Please choose a location name');
  });


  it('should warn if \'Add\' button is clicked and all fields are empty', () => {
    locationService = fixture.debugElement.injector.get(LocationService);
    const spiedLocationService = spyOn(locationService, 'addLocation');
    const compiled = fixture.debugElement.nativeElement;
    const spiedOpenComponent = spyOn(component.itemComponent.featureHint, 'open');
    setValueToInputAndDispatchEvent('#locationName', '');
    const button = compiled.querySelector('#addLocation');

    button.click();
    fixture.detectChanges();

    expect(spiedLocationService).not.toHaveBeenCalled();
    expect(spiedOpenComponent).not.toHaveBeenCalled();
    expect(compiled.querySelector('#locationName').className).toContain('is-invalid');
    expect(compiled.querySelector('#locationNameFeedback').textContent).toContain('Please choose a location name');
    expect(compiled.querySelector('#featureType').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureValue').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureTypeFeedback').textContent).toContain('Please fill a feature type');
    expect(compiled.querySelector('#featureValueFeedback').textContent).toContain('Please fill a feature value');
    expect(compiled.querySelector('span')).toBeNull();
  });

  it('should warn if \'Add\' button is clicked and no feature is available', () => {
    locationService = fixture.debugElement.injector.get(LocationService);
    const spiedLocationService = spyOn(locationService, 'addLocation');
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent('#locationName', 'Location');
    const button = compiled.querySelector('#addLocation');

    button.click();
    fixture.detectChanges();

    expect(spiedLocationService).not.toHaveBeenCalled();
    expect(compiled.querySelector('#locationName').className).not.toContain('is-invalid');
    expect(compiled.querySelector('#featureType').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureValue').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureTypeFeedback').textContent).toContain('Please fill a feature type');
    expect(compiled.querySelector('#featureValueFeedback').textContent).toContain('Please fill a feature value');
    expect(compiled.querySelector('span')).toBeNull();
  });

  it('should release hint if \'Add\' button is clicked, item has already a feature but a new is filled without being added', () => {
    locationService = fixture.debugElement.injector.get(LocationService);
    const spiedLocationService = spyOn(locationService, 'addLocation');
    const compiled = fixture.debugElement.nativeElement;
    const spiedComponent = spyOn(component.itemComponent.featureHint, 'open');
    setValueToInputAndDispatchEvent('#locationName', 'Location');
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', 'chaussure').click();
    setValueToInput('#featureType', 'noir');
    setValueToInput('#featureValue', 'couleur');
    const button = compiled.querySelector('#addLocation');

    button.click();
    fixture.detectChanges();

    expect(spiedComponent).toHaveBeenCalled();
    expect(spiedLocationService).not.toHaveBeenCalled();
    expect(compiled.querySelector('#locationName').className).not.toContain('is-invalid');
  });

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
    return compiled.querySelector('#itemForLocation button');
  }
});
