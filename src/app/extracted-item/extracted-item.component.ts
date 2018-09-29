import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ExtractedItem} from '../domain/extracted-item';
import {NgbCollapse, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Image} from '../domain/image';
import {Router} from '@angular/router';
import {ResizedImages} from '../domain/resized-images';
import {CarouselComponent} from '../carousel/carousel.component';
import {ImageStore} from '../domain/image-store';

@Component({
  selector: 'app-extracted-item',
  templateUrl: './extracted-item.component.html',
  styleUrls: ['./extracted-item.component.css']
})
export class ExtractedItemComponent implements OnInit {

  @ViewChild('itemCollapse') itemCollapse: NgbCollapse;
  @Input() extractedItem: ExtractedItem;

  isCollapsed: Boolean = true;

  constructor(private router: Router, private ngbModal: NgbModal) {
  }

  ngOnInit() {
  }

  collapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  getThumbnail(image: Image): string {
    return ResizedImages.getThumbnail(image.resizedImages).secureUrl;
  }

  getDetails(): void {
    this.router.navigate(['extracted-items', this.extractedItem.id]);
  }

  openCarousel(imageStore: ImageStore) {
    const ngbModalRef = this.ngbModal.open(CarouselComponent, {
      size: 'sm',
      centered: true,
      windowClass: 'carousel-modal'
    });
    ngbModalRef.componentInstance.imageStore = imageStore;
  }

}
