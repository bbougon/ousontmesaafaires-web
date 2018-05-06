import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../domain/item';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {SignatureService} from './signature.service';
import {environment} from '../../environments/environment';
import {DateTimeProvider} from '../infrastructure/date-time-provider';
import {ContainerService} from '../container/container.service';
import {Patch} from '../infrastructure/patch/patch';
import {UuidService} from '../infrastructure/uuid.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @Input() item: Item;
  @Input() containerId: string;

  timestamp: number;
  public uploader: FileUploader = new FileUploader({});
  public dateTimeProvider: DateTimeProvider = new DateTimeProvider(new Date());

  constructor(public activeModal: NgbActiveModal,
              private signatureService: SignatureService,
              private containerService: ContainerService,
              private uuidService: UuidService) {
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

  upload(fileItem: FileItem, index: number, files: any[]) {
    const publicId = this.uuidService.base64Encoded();
    this.timestamp = this.dateTimeProvider.now().unixTimestamp();
    this.signatureService
      .sign({
        eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800',
        folder: this.item.item.hash,
        public_id: publicId,
        timestamp: this.timestamp
      })
      .subscribe(signature => {
        this.uploader.onBuildItemForm = (item, form) => {
          this.onBuildItemForm(item, form, publicId, this.timestamp, signature);
        };
        this.uploader.uploadItem(fileItem);
        this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
          this.onCompleteUpload(response, files.length === index + 1 ? () => this.closeModal() : null);
        };
      });
  }

  onCompleteUpload(response: string, callBack?: () => void) {
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
      }), callBack);
  }

  persistUpload(patch: Patch, callBack?: () => void) {
    this.containerService.patchContainer(this.containerId, patch)
      .subscribe(() => {
        if (callBack) {
          callBack();
        }
      });
  }

  cancel(item) {

  }

  remove(item) {

  }

  onBuildItemForm(fileItem, form, publicId, timestamp, signature) {
    fileItem.withCredentials = false;
    form.append('folder', this.item.item.hash);
    form.append('file', fileItem);
    form.append('timestamp', timestamp);
    form.append('public_id', publicId);
    form.append('api_key', signature.apiKey);
    form.append('eager', 'c_scale,w_80|c_scale,w_400|c_scale,w_800');
    form.append('signature', signature.signature);
  }

  uploadAll() {
    this.uploader.getNotUploadedItems().forEach((fileItem, index, array) => {
      this.upload(fileItem, index, array);
    });
  }

  cancelAll() {

  }

  clearQueue() {

  }

  closeModal() {
    this.activeModal.close();
  }
}
