import {Component, OnInit} from '@angular/core';
import {LocationService} from '../location/location.service';
import {ActivatedRoute} from '@angular/router';
import {LocationCreated} from '../domain/location-created';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})
export class LocationDetailComponent implements OnInit {

  constructor(private locationService: LocationService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(pmap => this.locationService.getLocation(pmap.get('id'))
      .subscribe((location: LocationCreated) => {
      }));
  }

}
