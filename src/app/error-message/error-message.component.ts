import {AfterViewInit, Component, Renderer, ViewChild} from '@angular/core';
import {MessageService} from '../infrastructure/message.service';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'ng-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements AfterViewInit {

  @ViewChild('errorDialog') errorDialog: ModalDirective;

  constructor(public messageService: MessageService, private renderer: Renderer) {
    // of(this.errorDialog).delay(3000).subscribe(this.errorDialog.hide);
  }

  ngAfterViewInit() {
    // delay(3000).subscribe(() => {
    //   this.errorDialog.hide();
    // });
  }

}
