import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {Location} from '@angular/common';
import {ExtractedItemComponent} from './extracted-item.component';
import {ExtractedItem} from '../domain/extracted-item';
import {CONTAINER} from '../container/testing/fake-container.service';
import {AppModule} from '../app.module';
import {Item} from '../domain/item';
import {By} from '@angular/platform-browser';
import {ImageStore} from '../domain/image-store';
import {Image} from '../domain/image';
import {ResizedImage} from '../domain/resized-image';
import {Router} from '@angular/router';

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
      },
        {
          'signature': 'signature',
          'url': 'assets/testing/url5.png',
          'secureUrl': 'assets/testing/secureUrl5.png',
          'resizedImages': [{
            'url': 'assets/testing/url6.png',
            'secureUrl': 'assets/testing/secureUrl6.png',
            'height': 110.0,
            'width': 80.0
          }, {
            'url': 'assets/testing/url7.png',
            'secureUrl': 'assets/testing/secureUrl7.png',
            'height': 552.0,
            'width': 400.0
          }, {
            'url': 'assets/testing/url8.png',
            'secureUrl': 'assets/testing/secureUrl8.png',
            'height': 1103.0,
            'width': 800.0
          }]
        }]
    },
    'hash': 'hash'
  };

  let component: ExtractedItemComponent;
  let fixture: ComponentFixture<ExtractedItemComponent>;
  let location: Location;
  let router: Router;

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

  it('collapses when collapse button is clicked', () => {
    const images: Image[] = [];
    const image = item.imageStore.images[0];
    images.push(new Image(image.signature, image.url, image.secureUrl, createResizedImages(image)));
    const secondImage = item.imageStore.images[1];
    images.push(new Image(secondImage.signature, secondImage.url, secondImage.secureUrl, createResizedImages(secondImage)));
    component.extractedItem = new ExtractedItem('12345',
      new Item(item, new ImageStore(item.imageStore.folder, images), item.hash), CONTAINER);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    fixture.debugElement.query(By.css('.oi-arrow-circle-bottom')).nativeElement.click();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.show'))).toBeTruthy();
    expect(compiled.querySelectorAll('img').length).toBe(1);
  });

  it('should navigate to container detail', fakeAsync(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    component.extractedItem = new ExtractedItem('12345',
      new Item(item, new ImageStore(item.imageStore.folder), item.hash), CONTAINER);
    fixture.detectChanges();
    //
    fixture.debugElement.query(By.css('.oi-eye')).nativeElement.click();
    //
    tick(50);
    expect(location.path()).toBe('/extracted-items/12345');
  }));

  const createResizedImage = function (image: Image, index: number): ResizedImage {
    const resizedImage = image.resizedImages[index];
    return new ResizedImage(resizedImage.url, resizedImage.secureUrl, resizedImage.height, resizedImage.width);
  };

  const createResizedImages = function (image: any) {
    const resizedImages: ResizedImage[] = [];
    resizedImages.push(createResizedImage(image, 0), createResizedImage(image, 1), createResizedImage(image, 2));
    return resizedImages;
  };
});
