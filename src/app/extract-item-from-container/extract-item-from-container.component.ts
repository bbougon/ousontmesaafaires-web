import {Component, OnInit} from '@angular/core';
import {Item} from '../domain/item';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ExtractedItemService} from '../extracted-item/extracted-item.service';

@Component({
  selector: 'app-extract-item-from-container-component',
  templateUrl: './extract-item-from-container.component.html',
  styleUrls: ['./extract-item-from-container.component.css']
})
export class ExtractItemFromContainerComponent implements OnInit {
  containerId: string;
  item: Item;

  constructor(public activeModal: NgbActiveModal,
              private route: Router, private extractedItemService: ExtractedItemService) {
  }

  ngOnInit() {
  }

  extractItem() {
    this.extractedItemService.extractItem(this.item, this.containerId)
      .subscribe((extractedItem) => {
        this.activeModal.close();
        this.route.navigateByUrl(`/extracted-items/${extractedItem.id}`);
      });
  }
}
