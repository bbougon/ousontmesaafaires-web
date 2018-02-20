import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComponent } from './item.component';
import {BrowserModule, By} from '@angular/platform-browser';
import {PairPipe} from '../infrastructure/pair-pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppModule} from '../app.module';
import {HttpClientModule} from '@angular/common/http';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [PairPipe],
      imports: [FormsModule, ReactiveFormsModule, BrowserModule, HttpClientModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render location empty', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('label[for="featureType"]').textContent).toContain('Feature:');
    expect(compiled.querySelector('div span')).toBeNull('Should be null');
  });

  it('should add the feature once \'+\' is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    const button = setValueOnFeaturesAndDispatchEvent(compiled, 'type', 'tshirt');

    button.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#featureType').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureValue').className).not.toContain('is-valid');
    expect(compiled.querySelector('span').textContent).toContain('Item: type,tshirt');
  });

  it('should invalidate feature if \'+\' is clicked and feature is empty', () => {
    const compiled = fixture.debugElement.nativeElement;
    const button = setValueOnFeaturesAndDispatchEvent(compiled, '', '');

    button.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#featureType').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureValue').className).toContain('is-invalid');
    expect(compiled.querySelector('#featureTypeFeedback').textContent).toContain('Please fill a feature type');
    expect(compiled.querySelector('#featureValueFeedback').textContent).toContain('Please fill a feature value');
    expect(compiled.querySelector('span')).toBeNull();
  });

  it('should reset feature type if \'+\' is clicked and feature type is valid and feature value is empty', () => {
    const compiled = fixture.debugElement.nativeElement;
    const button = setValueOnFeaturesAndDispatchEvent(compiled, 'type', '');

    button.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#featureType').className).not.toContain('is-invalid');
    expect(compiled.querySelector('#featureType').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureValue').className).toContain('is-invalid');
    expect(compiled.querySelector('span')).toBeNull();
  });

  it('should reset feature value if \'+\' is clicked and feature value is valid and feature type is empty', () => {
    const compiled = fixture.debugElement.nativeElement;
    const button = setValueOnFeaturesAndDispatchEvent(compiled, '', 'value');

    button.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#featureValue').className).not.toContain('is-invalid');
    expect(compiled.querySelector('#featureValue').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureType').className).toContain('is-invalid');
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
