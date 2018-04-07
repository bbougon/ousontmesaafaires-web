import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Container} from '../domain/container';

@Component({
  selector: 'app-pdf',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  @Input() container: Container;
  @Input() currentLocation = window.location.origin;
  @Input() containerURL: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  getContainerUrl() {
    return this.currentLocation + '/#/containers/' + this.container.id;
  }
}
