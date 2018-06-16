import {Component, OnInit} from '@angular/core';
import {Item} from '../domain/item';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ContainerService} from '../container/container.service';
import {Destination} from '../domain/destination';
import {Router} from '@angular/router';

@Component({
  selector: 'app-move-item-to-container',
  templateUrl: './move-item-to-container.component.html',
  styleUrls: ['./move-item-to-container.component.css']
})
export class MoveItemToContainerComponent implements OnInit {
  containerId: string;
  item: Item;

  constructor(public activeModal: NgbActiveModal,
              private route: Router,
              private containerService: ContainerService) {
  }

  ngOnInit() {
  }

  moveToNewContainer() {
    this.containerService.moveItemToContainer(this.item, this.containerId, new Destination('NEW'))
      .subscribe((container) => {
        this.activeModal.close();
        this.route.navigateByUrl(`/containers/${container.id}`);
      });
  }
}
