import {Component, Input, OnInit} from '@angular/core';
import {Image} from '../domain/image';
import {ResizedImage} from '../domain/resized-image';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  @Input() images: Image[];

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  getCarouselImages(): ResizedImage[] {
    return this.images.map(value => {
      return value.resizedImages
        .filter(resizedImage => resizedImage.width === 400)[0];
    });
  }
}
