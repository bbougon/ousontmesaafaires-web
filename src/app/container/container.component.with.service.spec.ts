import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ContainerComponent} from './container.component';
import {ContainerService} from './container.service';
import {By} from '@angular/platform-browser';
import {CONTAINER, FakeContainerService} from './testing/fake-container.service';
import {HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {AppModule} from '../app.module';
import {of} from 'rxjs/observable/of';
import {FakeHttpErrorHandler} from '../../testing/fake-http-error-handler';

describe('ContainerComponent ', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;

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

  afterEach(() => {
    component.itemComponent.item = null;
    component.containers = [];
  });

  it('displays the container once added', () => {
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(CONTAINER.name, '#containerName');
    setValueOnFeaturesAndDispatchEvent('chaussure', '#featureValue');
    const button = compiled.querySelector('#addContainer');

    button.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#containers').outerHTML).toContain('Container');
    expect(compiled.querySelector('#containerName').className).not.toContain('is-valid');
    expect(compiled.querySelector('#featureValue').className).not.toContain('is-valid');
    expect(fixture.debugElement.query(By.css('#items'))).toBeNull(compiled.querySelector('span').outerHTML + 'Should be null');
  });

  it('can add an item to a container', () => {
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(CONTAINER.name, '#containerName');
    setValueOnFeaturesAndDispatchEvent('chaussure', '#featureValue');
    const button = compiled.querySelector('#addContainer');
    button.click();
    fixture.detectChanges();
    const itemComponents = component.itemComponents.toArray();
    const spiedClearItemComponent = spyOn(itemComponents[1], 'clearItem');
    setValueOnFeaturesAndDispatchEvent('marron', '#item0 div div div #featureValue');
    const addItemButton = compiled.querySelector('#addItemToContainer0');

    addItemButton.click();
    fixture.detectChanges();

    const querySelectorAll = compiled.querySelectorAll('li[class="list-group-item item d-flex justify-content-between col-md-12"] div');
    console.log('selector' + querySelectorAll);
    const querySelector = querySelectorAll[1];
    expect(querySelector.textContent).toContain('marron');
    expect(spiedClearItemComponent).toHaveBeenCalled();
  });

  it('item form shows error if addContainer has been clicked and no item has been added', () => {
    const containerService = fixture.debugElement.injector.get(ContainerService);
    const spiedService = spyOn(containerService, 'addItemToContainer');
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(CONTAINER.name, '#containerName');
    setValueOnFeaturesAndDispatchEvent('chaussure', '#featureValue');
    const button = compiled.querySelector('#addContainer');
    button.click();
    fixture.detectChanges();
    const itemComponents = component.itemComponents.toArray();
    const spiedComponent = spyOn(itemComponents[1], 'markAllAsDirty');
    const addItemButton = compiled.querySelector('#addItemToContainer0');

    addItemButton.click();
    fixture.detectChanges();

    expect(spiedComponent).toHaveBeenCalled();
    expect(spiedService).not.toHaveBeenCalled();
  });

  it('calls containers service when generating a sticker', () => {
    const containerService = fixture.debugElement.injector.get(ContainerService);
    const spiedService = spyOn(containerService, 'getContainer').and.returnValue(of(CONTAINER));
    const compiled = fixture.debugElement.nativeElement;
    setValueToInputAndDispatchEvent(CONTAINER.name, '#containerName', 'input');
    setValueOnFeaturesAndDispatchEvent('chaussure', '#featureValue');
    compiled.querySelector('#addContainer').click();
    fixture.detectChanges();
    const button = compiled.querySelector('#generateSticker0');

    button.click();
    fixture.detectChanges();

    expect(spiedService).toHaveBeenCalled();
  });

  function setValueToInputAndDispatchEvent(value: string, selector: string, eventType?: string) {
    eventType = eventType || 'input';
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event(eventType));
  }

  function setValueOnFeaturesAndDispatchEvent(featureValue: string, featureValueSelector: string) {
    featureValueSelector = featureValueSelector || '#featureValue';
    featureValue = featureValue || '';
    setValueToInputAndDispatchEvent(featureValue, featureValueSelector, 'blur');
  }
});
