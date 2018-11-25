import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CarouselComponent} from './carousel.component';
import {CONTAINER} from '../container/testing/fake-container.service';
import {ResizedImage} from '../domain/resized-image';
import {AppModule} from '../app.module';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get carousel at expected size', () => {
    component.imageStore = CONTAINER.items[0].imageStore;

    const resizedImages: ResizedImage[] = component.getCarouselImages();

    expect(resizedImages.length).toBe(1);
    expect(resizedImages[0].width).toBe(400.0);
  });
});
