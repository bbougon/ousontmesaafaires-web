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
        provide: LocationService, useValue: new FakeLocationService()
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

  afterEach(() => {
    component.itemComponent.item = {};
    component.itemComponent.itemToCreate = null;
    component.locations = [];
  });

  it('displays the location once added', () => {
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(LOCATION_CREATED.location, '#locationName');
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', '#featureType', 'chaussure', '#featureValue', 'button').click();
    const button = compiled.querySelector('#addLocation');

    button.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#locations').outerHTML).toContain('Location');
    expect(compiled.querySelector('#locationName').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureType').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureValue').className).not.toContain('is-valid');
    expect(fixture.debugElement.query(By.css('#items'))).toBeNull(compiled.querySelector('span').outerHTML + 'Should be null');
  });

  it('can add an item to a location', () => {
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(LOCATION_CREATED.location, '#locationName');
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', '#featureType', 'chaussure', '#featureValue', 'button').click();
    const button = compiled.querySelector('#addLocation');
    button.click();
    fixture.detectChanges();
    const itemComponents = component.itemComponents.toArray();
    const spiedClearItemComponent = spyOn(itemComponents[1], 'clearItem');
    setValueOnFeaturesAndDispatchEvent(compiled, 'couleur', '#itemToCreate0 div div div #featureType',
      'marron', '#itemToCreate0 div div div #featureValue', '#itemToCreate0 div div div button').click();
    const addItemButton = compiled.querySelector('#addItemToLocation0');

    addItemButton.click();
    fixture.detectChanges();

    const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item item d-flex justify-content-between col-md-12"] div');
    const querySelector = querySelectorAll[1];
    expect(querySelector.textContent).toContain('Couleur: marron');
    expect(spiedClearItemComponent).toHaveBeenCalled();
  });

  it('hint is raised if `+` button is not clicked', () => {
    const locationService = fixture.debugElement.injector.get(LocationService);
    const spiedLocationService = spyOn(locationService, 'addItemToLocation');
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(LOCATION_CREATED.location, '#locationName');
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', '#featureType', 'chaussure', '#featureValue', 'button').click();
    const button = compiled.querySelector('#addLocation');
    button.click();
    fixture.detectChanges();
    const itemComponents = component.itemComponents.toArray();
    const spiedOpenComponent = spyOn(itemComponents[1].featureHint, 'open');
    setValueOnFeaturesAndDispatchEvent(compiled, 'couleur', '#itemToCreate0 div div div #featureType',
      'marron', '#itemToCreate0 div div div #featureValue', '#itemToCreate0 div div div button');
    const addItemButton = compiled.querySelector('#addItemToLocation0');

    addItemButton.click();
    fixture.detectChanges();

    expect(spiedOpenComponent).toHaveBeenCalled();
    expect(spiedLocationService).not.toHaveBeenCalled();
  });

  it('item form shows error if addLocation has been clicked and no item has been added', () => {
    const locationService = fixture.debugElement.injector.get(LocationService);
    const spiedLocationService = spyOn(locationService, 'addItemToLocation');
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(LOCATION_CREATED.location, '#locationName');
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', '#featureType', 'chaussure', '#featureValue', 'button').click();
    const button = compiled.querySelector('#addLocation');
    button.click();
    fixture.detectChanges();
    const itemComponents = component.itemComponents.toArray();
    const spiedComponent = spyOn(itemComponents[1], 'markAllAsDirty');
    const addItemButton = compiled.querySelector('#addItemToLocation0');

    addItemButton.click();
    fixture.detectChanges();

    expect(spiedComponent).toHaveBeenCalled();
    expect(spiedLocationService).not.toHaveBeenCalled();
  });

  it('calls sticker generation service', () => {
    const locationService = fixture.debugElement.injector.get(LocationService);
    const spiedLocationService = spyOn(locationService, 'generateSticker');
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(LOCATION_CREATED.location, '#locationName');
    setValueOnFeaturesAndDispatchEvent(compiled, 'type', '#featureType', 'chaussure', '#featureValue', 'button').click();
    compiled.querySelector('#addLocation').click();
    fixture.detectChanges();
    const button = compiled.querySelector('#generateSticker0');

    button.click();
    fixture.detectChanges();

    expect(spiedLocationService).toHaveBeenCalled();
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
