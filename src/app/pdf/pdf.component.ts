import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {
  @Input() pdf;
  @Input() pdfName;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
  }

}
