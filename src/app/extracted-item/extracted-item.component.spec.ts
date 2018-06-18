import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExtractedItemComponent} from './extracted-item.component';
import {ExtractedItem} from '../domain/extracted-item';
import {CONTAINER} from '../container/testing/fake-container.service';
import {AppModule} from '../app.module';
import {Item} from '../domain/item';

describe('ExtractedItemComponent', () => {

  const item = {
    'item': {'type': 'chaussure', 'couleur': 'marron', 'matière': 'cuir'},
    'imageStore': {
      'folder': 'folder_name',
      'images': [{
        'signature': 'signature',
        'url': 'assets/testing/url.png',
        'secureUrl': 'assets/testing/secureUrl.png',
        'resizedImages': [{
          'url': 'assets/testing/url2.png',
          'secureUrl': 'assets/testing/secureUrl2.png',
          'height': 110.0,
          'width': 80.0
        }, {
          'url': 'assets/testing/url3.png',
          'secureUrl': 'assets/testing/secureUrl3.png',
          'height': 552.0,
          'width': 400.0
        }, {
          'url': 'assets/testing/url4.png',
          'secureUrl': 'assets/testing/secureUrl4.png',
          'height': 1103.0,
          'width': 800.0
        }]
      }]
    },
    'hash': 'hash'
  };

  let component: ExtractedItemComponent;
  let fixture: ComponentFixture<ExtractedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the item', () => {
    component.extractedItem = new ExtractedItem('12345', new Item(item), CONTAINER);
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(compiled.querySelector('div div')).not.toBeNull('Should not be null');
  });
});
