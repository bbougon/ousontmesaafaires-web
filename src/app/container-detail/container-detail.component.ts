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
import {ExtractItemFromContainerComponent} from '../extract-item-from-container/extract-item-from-container.component';
import {ResizedImages} from '../domain/resized-images';

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
        this.containerService.addItemToContainer(pmap.get('id'), itemComponent.getItem())
          .subscribe(() => {
            this.container.add(itemComponent.getItem());
            itemComponent.clearItem();
          }));
  }

  addDescription(description: string) {
    this.route.paramMap
      .subscribe(pmap =>
        this.containerService.patchContainer(pmap.get('id'), new Patch('item.description').unwrap(description))
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
    return ResizedImages.getThumbnail(image.resizedImages).secureUrl;
  }

  openCarousel(imageStore: ImageStore) {
    const ngbModalRef = this.ngbModal.open(CarouselComponent, {
      size: 'sm',
      centered: true,
      windowClass: 'carousel-modal'
    });
    ngbModalRef.componentInstance.imageStore = imageStore;
  }

  openExtractItemFromContainer(item: Item) {
    const ngbModalRef = this.ngbModal.open(ExtractItemFromContainerComponent, {size: 'lg'});
    ngbModalRef.componentInstance.item = item;
    this.route.paramMap.subscribe(pmap => ngbModalRef.componentInstance.containerId = pmap.get('id'));
  }

  openTransferToExistingContainer(item: Item) {
    const ngbModalRef = this.ngbModal.open(MoveItemToContainerComponent, {size: 'lg'});
    ngbModalRef.componentInstance.item = item;
    this.route.paramMap.subscribe(pmap => ngbModalRef.componentInstance.containerId = pmap.get('id'));
  }
}
