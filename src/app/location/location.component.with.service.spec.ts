import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule, By} from '@angular/platform-browser';
import {FakeLocationService, LOCATION_CREATED} from './testing/fake-location.service';

describe('LocationComponent Call Service', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async(async () => {
    TestBed.configureTestingModule({
      declarations: [LocationComponent],
      providers: [{
        provide: LocationService, useClass: FakeLocationService
      }, HttpClient, HttpHandler],
      imports: [FormsModule, ReactiveFormsModule, BrowserModule]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('displays the location once added', () => {
    const locationService = fixture.debugElement.injector.get(LocationService);
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(LOCATION_CREATED.location, '#locationName');
    setValueOnFeaturesAndDispatchEvent(compiled, Object.keys(LOCATION_CREATED.items[0].item)[0],
      Object.values(Object.keys(LOCATION_CREATED.items[0].item)[0])[0]).click();
    const button = compiled.querySelector('#addLocation');

    button.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#locations').outerHTML).toContain('Location');
    expect(compiled.querySelector('#featureType').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureValue').className).not.toContain('is-valid');
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
