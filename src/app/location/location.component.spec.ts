import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule, By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
      imports: [FormsModule, ReactiveFormsModule, BrowserModule, HttpClientModule, AppModule]
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

    expect(compiled.querySelector('h2').textContent).toContain('Add location');
    expect(compiled.querySelector('label[for="locationName"]').textContent).toContain('Location name:');
    expect(compiled.querySelector('label[for="featureType"]').textContent).toContain('Feature:');
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
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', 'value').click();
    setValueToInputAndDispatchEvent('', '#locationName');

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
    setValueToInputAndDispatchEvent('', '#locationName');
    const button = compiled.querySelector('#addLocation');

    button.click();
    fixture.detectChanges();

    expect(spiedLocationService).not.toHaveBeenCalled();
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
    setValueToInputAndDispatchEvent('Location', '#locationName');
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

  function setValueToInputAndDispatchEvent(value: string, selector: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function setValueOnFeaturesAndDispatchEvent(compiled: any, featureType: string, featureValue: string) {
    featureValue = featureValue || '';
    featureType = featureType || '';
    setValueToInputAndDispatchEvent(featureType, '#featureType');
    setValueToInputAndDispatchEvent(featureValue, '#featureValue');
    return compiled.querySelector('button');
  }
});
