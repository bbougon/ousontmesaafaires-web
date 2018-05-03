import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../domain/item';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {SignatureService} from './signature.service';
import {environment} from '../../environments/environment';
import {DateTimeProvider} from '../infrastructure/date-time-provider';
import {ContainerService} from '../container/container.service';

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
        this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
          // this.containerService.patchContainer('', '');
        };
      });
  }

// {
//   "public_id": "eneivicys42bq5f2jpn2",
//   "version": 1473596672,
//   "signature": "abcdefghijklmnopqrstuvwxyz12345",
//   "width": 1000,
//   "height": 672,
//   "access_control": [
//     { access_type: "token" },
//     { access_type: "anonymous", start: "2017-12-15T12:00Z", end: "2018-01-20T12:00Z" }],
//   "format": "jpg",
//   "resource_type": "image",
//   "created_at": "2017-08-11T12:24:32Z",
//   "tags": [],
//   "bytes": 350749,
//   "type": "upload",
//   "etag": "5297bd123ad4ddad723483c176e35f6e",
//   "url": "http://res.cloudinary.com/demo/image/upload/v1473596672/eneivicys42bq5f2jpn2.jpg",
//   "secure_url": "https://res.cloudinary.com/demo/image/upload/v1473596672/eneivicys42bq5f2jpn2.jpg",
//   "original_filename": "sample",
//   "eager": [
//     { "transformation": "c_pad,h_300,w_400",
//       "width": 400,
//       "height": 300,
//       "url": "https://res.cloudinary.com/demo/image/upload/c_pad,h_300,w_400/v1473596672/eneivicys42bq5f2jpn2.jpg",
//       "secure_url": "https://res.cloudinary.com/demo/image/upload/c_pad,h_300,w_400/v1473596672/eneivicys42bq5f2jpn2.jpg" },
//     { "transformation": "c_crop,g_north,h_200,w_260",
//       "width": 260,
//       "height": 200,
//       "url": "https://res.cloudinary.com/demo/image/upload/c_crop,g_north,h_200,w_260/v1473596672/eneivicys42bq5f2jpn2.jpg",
//       "secure_url": "https://res.cloudinary.com/demo/image/upload/c_crop,g_north,h_200,w_260/v1473596672/eneivicys42bq5f2jpn2.jpg" }]
// }


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
