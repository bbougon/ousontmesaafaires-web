import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../domain/item';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileUploader} from 'ng2-file-upload';
import {SignatureService} from './signature.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @Input() item: Item;
  timestamp: number;

  public uploader: FileUploader = new FileUploader({});

  constructor(public activeModal: NgbActiveModal, private signatureService: SignatureService) {
    // this.uploader.setOptions()
  }

  ngOnInit() {
  }

  upload() {
    this.uploader.getNotUploadedItems().forEach((value, index) => {
      this.signatureService.sign({
        timestamp: this.timestamp,
        public_id: this.item.item.hash.concat('_').concat(index + 1),
        eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'
      });
    });
  }

  cancelAll() {

  }

  clearQueue() {

  }
}
