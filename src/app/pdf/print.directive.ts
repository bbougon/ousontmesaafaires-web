import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[pdfPrint]'
})
export class PrintDirective {

  constructor() {
  }

  @HostListener('click') onClick() {
    return window.print();
  }


}
