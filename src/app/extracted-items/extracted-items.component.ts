import {Component, OnInit} from '@angular/core';
import {ExtractedItem} from '../domain/extracted-item';
import {ExtractedItemService} from '../extracted-item/extracted-item.service';

@Component({
  selector: 'app-extracted-items',
  templateUrl: './extracted-items.component.html',
  styleUrls: ['./extracted-items.component.css']
})
export class ExtractedItemsComponent implements OnInit {
  extractedItems: ExtractedItem[] = [];

  constructor(private extractedItemService: ExtractedItemService) {
  }

  ngOnInit() {
    this.extractedItemService.getAllExtractedItems()
      .subscribe((extractedItems: ExtractedItem[]) =>
        extractedItems.forEach(extractedItem => {
          this.extractedItems.push(extractedItem);
        }));
  }

}
