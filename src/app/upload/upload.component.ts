import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../domain/item';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileUploader} from 'ng2-file-upload';
import {SignatureService} from './signature.service';
import {environment} from '../../environments/environment';

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
  }

  ngOnInit() {
    this.uploader.setOptions({
      url: `${environment.thirdPartImageProcessorUrl}`,
      autoUpload: false,
      allowedMimeType: ['image/gif', 'image/jpeg', 'image/png'],
      isHTML5: true,
      removeAfterUpload: true,
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    });
  }

  upload() {
    const onBuildItemForm = function (value, publicId, signature) {
      this.uploader.onBuildItemForm(value, {
        folder: this.item.item.hash,
        file: value,
        timestamp: this.timestamp,
        public_id: publicId,
        api_key: signature.apiKey,
        eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800',
        signature: signature.signature
      });
    };

    this.uploader.getNotUploadedItems().forEach((value, index) => {
      const publicId = this.item.item.hash.concat('_').concat(index + 1);
      this.signatureService
        .sign({
          timestamp: this.timestamp,
          public_id: publicId,
          eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'
        })
        .subscribe(signature => {
          value.withCredentials = false;
          onBuildItemForm.call(this, value, publicId, signature);
          this.uploader.uploadItem(value);
        });
    });
  }

  cancelAll() {

  }

  clearQueue() {

  }
}
