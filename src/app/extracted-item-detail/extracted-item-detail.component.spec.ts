import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExtractedItemDetailComponent} from './extracted-item-detail.component';
import {ExtractedItemService} from '../extracted-item/extracted-item.service';
import {Item} from '../domain/item';
import {CONTAINER} from '../container/testing/fake-container.service';
import {ExtractedItem} from '../domain/extracted-item';
import {of} from 'rxjs/observable/of';
import {AppModule} from '../app.module';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';

let activatedRoute: ActivatedRouteStub;

describe('ExtractedItemDetailComponent', () => {
  let component: ExtractedItemDetailComponent;
  let fixture: ComponentFixture<ExtractedItemDetailComponent>;
  let extractedItemService: ExtractedItemService;

  const item = {
    'item': 'chaussure couleur marron matière cuir',
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

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setParamMap({id: 'azbvcbd'});
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [ExtractedItemService,
        {provide: ActivatedRoute, useValue: activatedRoute}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractedItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads extracted item on init', () => {
    extractedItemService = fixture.debugElement.injector.get(ExtractedItemService);
    const spiedService = spyOn(extractedItemService, 'getExtractedItem')
      .and.returnValue(of(Array.of(new ExtractedItem('azbvcbd', new Item(item.item), CONTAINER))));

    component.ngOnInit();

    expect(spiedService).toHaveBeenCalled();
    expect(component.extractedItem).not.toBeNull();
    expect(component.extractedItem).toBeTruthy();
  });
});
