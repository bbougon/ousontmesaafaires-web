import {FileItem, FileUploader, FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload';
import {isUndefined} from 'util';

export class FakeFileUploader extends FileUploader {

  uploadItem(value: FileItem): void {
  }


  setOptions(options: FileUploaderOptions): void {
  }


  onCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    return {item: item, response: response, status: status, headers: headers};
  }

  onBuildItemForm(fileItem: FileItem, form: any): any {
    return {};
  }

  onBuildItemFormHaveBeenCalledWith(objectToCompare: { [key: string]: any }, ...expectedParams: { [key: string]: any }[]): boolean {
    if (expectedParams.length === 0) {
      return false;
    }
    let result = true;
    expectedParams.forEach(param => {
      Object.keys(param).forEach((value) => {
        if (isUndefined(objectToCompare[value])) {
          result = false;
        }
        const key = Object.keys(objectToCompare)
          .filter(value2 => value2 === value)[0];
        if (isUndefined(objectToCompare[key]) || objectToCompare[key] !== param[value]) {
          result = false;
        }
      });
    });
    return result;
  }
}
