import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ContainerService} from '../container/container.service';
import {ActivatedRoute} from '@angular/router';
import {Container} from '../domain/container';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PrintComponent} from '../print/print.component';
import {ItemComponent} from '../item/item.component';
import {isUndefined} from "ngx-bootstrap/chronos/utils/type-checks";

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
    this.route.paramMap.subscribe(pmap => this.containerService.getContainer(pmap.get('id'))
      .subscribe((container: Container) => {
        this.container = container;
      }));
  }

  generateSticker() {
    const modalRef = this.ngbModal.open(PrintComponent, {size: 'lg'});
    modalRef.componentInstance.container = this.container;
  }

  addItemToContainer(itemComponent: ItemComponent) {
    this.route.paramMap.subscribe(pmap => this.containerService.addItemToContainer(pmap.get('id'), itemComponent.getCreatedItem())
      .subscribe(() => {
        this.container.add(itemComponent.getCreatedItem());
        itemComponent.clearItem();
      }));
  }

  toggleContainerDescriptionInput() {
    if (!isUndefined(this.containerDescription.nativeElement.attributes['hidden'])) {
      this.containerDescription.nativeElement.removeAttribute('hidden');
      this.displayDescription.nativeElement.setAttribute('hidden', true);
    } else {
      this.displayDescription.nativeElement.removeAttribute('hidden');
      this.containerDescription.nativeElement.setAttribute('hidden', true);
    }
  }

  addDescription(description: string) {
    this.containerService.addDescription(description).subscribe(() => {
      this.toggleContainerDescriptionInput();
    });
  }
}
