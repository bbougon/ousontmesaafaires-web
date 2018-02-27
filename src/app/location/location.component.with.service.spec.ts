import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {By} from '@angular/platform-browser';
import {FakeLocationService, LOCATION_CREATED} from './testing/fake-location.service';
import {MessageService} from '../infrastructure/message.service';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {AppModule} from '../app.module';

describe('LocationComponent Call Service', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async(async () => {
    TestBed.configureTestingModule({
      providers: [{
        provide: LocationService, useClass: FakeLocationService
      }, HttpErrorHandler, MessageService],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('displays the location once added', () => {
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(LOCATION_CREATED.location, '#locationName');
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', 'chaussure').click();
    const button = compiled.querySelector('#addLocation');

    button.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#locations').outerHTML).toContain('Location');
    expect(compiled.querySelector('#locationName').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureType').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureValue').className).not.toContain('is-valid');
    expect(fixture.debugElement.query(By.css('#items'))).toBeNull(compiled.querySelector('span').outerHTML + 'Should be null');
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
