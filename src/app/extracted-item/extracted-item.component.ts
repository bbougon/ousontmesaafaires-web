import {Component, Input, OnInit} from '@angular/core';
import {ExtractedItem} from '../domain/extracted-item';

@Component({
  selector: 'app-extracted-item',
  templateUrl: './extracted-item.component.html',
  styleUrls: ['./extracted-item.component.css']
})
export class ExtractedItemComponent implements OnInit {

  @Input() extractedItem: ExtractedItem;

  constructor() { }

  ngOnInit() {
  }

}
