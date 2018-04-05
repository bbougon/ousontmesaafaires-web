import {Component, OnInit} from '@angular/core';
import {LocationService} from '../location/location.service';
import {ActivatedRoute} from '@angular/router';
import {LocationCreated} from '../domain/location-created';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PrintComponent} from '../print/print.component';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css'],
  providers: [PairPipe]
})
export class LocationDetailComponent implements OnInit {
  location: LocationCreated;

  constructor(private locationService: LocationService,
              private route: ActivatedRoute, private ngbModal: NgbModal) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(pmap => this.locationService.getLocation(pmap.get('id'))
      .subscribe((location: LocationCreated) => {
        this.location = location;
      }));
  }

  generateSticker() {
    const modalRef = this.ngbModal.open(PrintComponent);
    modalRef.componentInstance.location = this.location;
  }

}
