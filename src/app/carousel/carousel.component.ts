import {Component, Input, OnInit} from '@angular/core';
import {ResizedImage} from '../domain/resized-image';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageStore} from '../domain/image-store';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  @Input() imageStore: ImageStore;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  getCarouselImages(): ResizedImage[] {
    return this.imageStore.images.map(value => {
      return value.resizedImages
        .filter(resizedImage => resizedImage.width === 400)[0];
    });
  }
}
