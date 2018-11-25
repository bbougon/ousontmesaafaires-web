import {Component, OnInit} from '@angular/core';
import {ExtractedItem} from '../domain/extracted-item';
import {ExtractedItemService} from '../extracted-item/extracted-item.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-extracted-item-detail-component',
  templateUrl: './extracted-item-detail.component.html',
  styleUrls: ['./extracted-item-detail.component.css']
})
export class ExtractedItemDetailComponent implements OnInit {
  
  extractedItem: ExtractedItem;
  isCollapsed: Boolean[] = [];

  constructor(private extractedItemService: ExtractedItemService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(pmap =>
        this.extractedItemService.getExtractedItem(pmap.get('id'))
          .subscribe((extractedItem: ExtractedItem) => this.extractedItem = extractedItem)
      );
  }

}
