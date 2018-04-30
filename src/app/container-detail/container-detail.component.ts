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

  addDescription(description: string, event ?: any) {
    this.route.paramMap
      .subscribe(pmap =>
        this.containerService.addDescription(pmap.get('id'), description)
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

  private hide(elementRef: ElementRef) {
    elementRef.nativeElement.setAttribute('hidden', true);
  }

  private show(elementRef: ElementRef) {
    elementRef.nativeElement.removeAttribute('hidden');
  }

  private hideAndShow(elementToHide: ElementRef, elementToShow: ElementRef) {
    this.hide(elementToHide);
    this.show(elementToShow);
  }

  openUploadModal(item: Item) {
    const ngbModalRef = this.ngbModal.open(UploadComponent, {size: 'lg'});
    ngbModalRef.componentInstance.item = item;
  }
}
