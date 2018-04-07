import {Component, OnInit} from '@angular/core';
import {ContainerService} from '../container/container.service';
import {ActivatedRoute} from '@angular/router';
import {Container} from '../domain/container';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PrintComponent} from '../print/print.component';
import {ItemComponent} from '../item/item.component';

@Component({
  selector: 'ng-container-detail',
  templateUrl: './container-detail.component.html',
  styleUrls: ['./container-detail.component.css'],
  providers: [PairPipe]
})
export class ContainerDetailComponent implements OnInit {
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
    const modalRef = this.ngbModal.open(PrintComponent);
    modalRef.componentInstance.container = this.container;
  }

  addItemToContainer(itemComponent: ItemComponent) {

  }

}
