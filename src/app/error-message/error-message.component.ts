import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ClockworkService} from '../infrastructure/clockwork.service';

@Component({
  selector: 'ng-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit {

  @Input() message: String;

  constructor(public activeModal: NgbActiveModal, private clockworkService: ClockworkService) {
    this.clockworkService.delay(3000, function () {
      activeModal.close();
    });
  }

  ngOnInit(): void {
  }

}
