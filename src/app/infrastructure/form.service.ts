import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';

@Injectable()
export class FormService {

  constructor() {
  }

  markAsDirty(value: string, formControl: FormControl) {
    if (value.trim() === '') {
      formControl.markAsDirty();
    }
  }

  resetFormControl(formControl: FormControl) {
    if (formControl.valid) {
      formControl.reset();
    }
  }


}
