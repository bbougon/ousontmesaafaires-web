import {FileItem, FileUploader, FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload';
import {UploadComponent} from '../upload.component';

export class FakeFileUploader extends FileUploader {
  constructor(param: {}, private component: UploadComponent) {
    super(param);
  }

  uploadItem(value: FileItem): void {
  }

  setOptions(options: FileUploaderOptions): void {
  }

  onCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    this.component.onCompleteUpload(response, () => this.component.closeModal());
    return {item: item, response: response, status: status, headers: headers};
  }

  onBuildItemForm(fileItem: FileItem, form: any): any {
    return {fileItem, form};
  }
}
