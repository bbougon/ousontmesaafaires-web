import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../domain/item';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input() item: Item;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
