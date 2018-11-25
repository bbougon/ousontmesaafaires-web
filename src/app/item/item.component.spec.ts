import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemComponent} from './item.component';
import {By} from '@angular/platform-browser';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {AppModule} from '../app.module';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [PairPipe],
      imports: [AppModule]
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

  it('should render container empty', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('label[for="featureValue"]').textContent).toContain('Feature value:');
  });

  describe('should set item on triggered events', () => {
    it('on keyup enter', () => {
      const compiled = fixture.debugElement.nativeElement;
      const featureInput = fixture.debugElement.query(By.css('#featureValue'));
      featureInput.nativeElement.textContent = 'A value';
      featureInput.nativeElement.value = 'A value';

      featureInput.triggerEventHandler('keyup.enter', {});
      fixture.detectChanges();

      const item = component.getItem();
      expect(item).not.toBeNull('item is not null');
      expect(item.item).toEqual('A value');
    });

    it('on blur', () => {
      const compiled = fixture.debugElement.nativeElement;
      const featureInput = fixture.debugElement.query(By.css('#featureValue'));
      featureInput.nativeElement.textContent = 'A value';
      featureInput.nativeElement.value = 'A value';

      featureInput.triggerEventHandler('blur', {});
      fixture.detectChanges();

      const item = component.getItem();
      expect(item).not.toBeNull('item is not null');
      expect(item.item).toEqual('A value');
    });

  });

  function setValueToInputAndDispatchEvent(value: string, selector: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function setValueOnFeaturesAndDispatchEvent(featureValue: string) {
    featureValue = featureValue || '';
    setValueToInputAndDispatchEvent(featureValue, '#featureValue');
  }
});
