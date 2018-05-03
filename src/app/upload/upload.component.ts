import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../domain/item';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {SignatureService} from './signature.service';
import {environment} from '../../environments/environment';
import {DateTimeProvider} from '../infrastructure/date-time-provider';
import {ContainerService} from '../container/container.service';
import {Patch} from '../infrastructure/patch/patch';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @Input() item: Item;

  timestamp: number;
  public uploader: FileUploader = new FileUploader({});
  public dateTimeProvider: DateTimeProvider = new DateTimeProvider(new Date());

  constructor(public activeModal: NgbActiveModal, private signatureService: SignatureService, private containerService: ContainerService) {
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

  upload(value, index) {
    const publicId = this.item.item.hash.concat('_').concat(index + 1);
    this.timestamp = this.dateTimeProvider.now().unixTimestamp();
    this.signatureService
      .sign({
        timestamp: this.timestamp,
        public_id: publicId,
        eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'
      })
      .subscribe(signature => {
        value.withCredentials = false;
        this.onBuildItemForm(value, publicId, signature);
        this.uploader.uploadItem(value);
        this.onCompleteUpload();
      });
  }

  onCompleteUpload() {
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
      const uploadedImage = JSON.parse(response);
      const resizedImages = [];
      uploadedImage.eager.forEach(function (eager) {
        resizedImages.push({url: eager.url, secure_url: eager.secure_url, width: eager.width, height: eager.height});
      });
      this.persistUpload(new Patch('item', this.item.item.hash)
        .unwrap({
          signature: uploadedImage.signature,
          url: uploadedImage.url,
          secure_url: uploadedImage.secure_url,
          resizedImages: resizedImages
        }));
    };
  }


  persistUpload(patch: Patch) {

  }

  cancel(item) {

  }

  remove(item) {

  }

  onBuildItemForm(value, publicId, signature) {
    this.uploader.onBuildItemForm(value, {
      folder: this.item.item.hash,
      file: value,
      timestamp: this.timestamp,
      public_id: publicId,
      api_key: signature.apiKey,
      eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800',
      signature: signature.signature
    });
  }

  uploadAll() {
    this.uploader.getNotUploadedItems().forEach((value, index) => {
      this.upload(value, index);
    });
  }

  cancelAll() {

  }

  clearQueue() {

  }
}
