import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ContainerService} from '../container/container.service';
import {ActivatedRoute} from '@angular/router';
import {Container} from '../domain/container';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PrintComponent} from '../print/print.component';
import {ItemComponent} from '../item/item.component';
import {isUndefined} from 'ngx-bootstrap/chronos/utils/type-checks';
import {UploadComponent} from '../upload/upload.component';
import {Item} from '../domain/item';
import {Patch} from '../infrastructure/patch/patch';
import {Image} from '../domain/image';
import {CarouselComponent} from '../carousel/carousel.component';
import {ImageStore} from '../domain/image-store';
import {MoveItemToContainerComponent} from '../move-item-to-container/move-item-to-container.component';

@Component({
  selector: 'ng-container-detail',
  templateUrl: './container-detail.component.html',
  styleUrls: ['./container-detail.component.css'],
  providers: [PairPipe]
})
export class ContainerDetailComponent implements OnInit {

  @ViewChildren(ItemComponent) itemComponents: QueryList<ItemComponent>;
  @ViewChild('containerDescription') containerDescription: ElementRef;
  @ViewChild('displayDescription') displayDescription: ElementRef;

  container: Container;

  constructor(private containerService: ContainerService,
              private route: ActivatedRoute, private ngbModal: NgbModal) {
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(pmap =>
        this.containerService.getContainer(pmap.get('id'))
          .subscribe((container: Container) => {
            this.container = container;
          }));
  }

  generateSticker() {
    const modalRef = this.ngbModal.open(PrintComponent, {size: 'lg'});
    modalRef.componentInstance.container = this.container;
  }

  addItemToContainer(itemComponent: ItemComponent) {
    this.route.paramMap
      .subscribe(pmap =>
        this.containerService.addItemToContainer(pmap.get('id'), itemComponent.getCreatedItem())
          .subscribe(() => {
            this.container.add(itemComponent.getCreatedItem());
            itemComponent.clearItem();
          }));
  }

  addDescription(description: string) {
    this.route.paramMap
      .subscribe(pmap =>
        this.containerService.patchContainer(pmap.get('id'), new Patch('description').unwrap(description))
          .subscribe(() => {
            this.hideAndShow(this.containerDescription, this.displayDescription);
            this.container.description = description.trim();
          }));
  }

  toggleContainerDescriptionInput() {
    if (!isUndefined(this.containerDescription.nativeElement.attributes['hidden'])) {
      this.hideAndShow(this.displayDescription, this.containerDescription);
    } else {
      this.hideAndShow(this.containerDescription, this.displayDescription);
    }
  }

  private hideAndShow(elementToHide: ElementRef, elementToShow: ElementRef) {
    elementToHide.nativeElement.setAttribute('hidden', true);
    elementToShow.nativeElement.removeAttribute('hidden');
  }

  openUploadModal(item: Item) {
    const ngbModalRef = this.ngbModal.open(UploadComponent, {size: 'lg'});
    ngbModalRef.componentInstance.item = item;
    ngbModalRef.componentInstance.container = this.container;
    this.route.paramMap.subscribe(pmap => ngbModalRef.componentInstance.containerId = pmap.get('id'));
  }

  getThumbnail(image: Image): string {
    const minimumWdth = Math.min.apply(Math, image.resizedImages.map(function (resizedImage) {
      return resizedImage.width;
    }));
    return image.resizedImages
      .filter(value => value.width === minimumWdth)[0].secureUrl;
  }

  openCarousel(imageStore: ImageStore) {
    const ngbModalRef = this.ngbModal.open(CarouselComponent, {size: 'sm', centered: true, windowClass: 'carousel-modal'});
    ngbModalRef.componentInstance.imageStore = imageStore;
  }

  openTransferToNewContainer(item: Item) {
    this.openTransferToComponent(item, 'NEW');
  }

  openTransferToExistingContainer(item: Item) {
    this.openTransferToComponent(item, 'EXISTING');
  }

  private openTransferToComponent(item: Item, target: string) {
    const ngbModalRef = this.ngbModal.open(MoveItemToContainerComponent, {size: 'sm'});
    ngbModalRef.componentInstance.item = item;
    ngbModalRef.componentInstance.target = target;
    this.route.paramMap.subscribe(pmap => ngbModalRef.componentInstance.containerId = pmap.get('id'));
  }
}
