import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationService} from './location.service';
import {NewLocation} from '../domain/new-location';
import {PairPipe} from '../infrastructure/pair-pipe';
import {LocationCreated} from '../domain/location-created';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemComponent} from '../item/item.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  providers: [PairPipe],
})
export class LocationComponent implements OnInit {

  @ViewChild(ItemComponent) itemComponent: ItemComponent;

  locations: LocationCreated[] = [];
  addLocationForm: FormGroup;
  locationNameFormControl: FormControl;

  constructor(private locationService: LocationService, private pair: PairPipe) {
  }

  ngOnInit() {
    this.locationNameFormControl = new FormControl('', Validators.required);
    this.addLocationForm = new FormBuilder().group({
      locationNameFormControl: this.locationNameFormControl,
    });
    this.locationService.getLocations().subscribe(locations => {
        this.locations = locations;
      }
    );
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

  addLocation(locationName: string): void {
    if (locationName.trim() === '' || Object.keys(this.itemComponent.getItem()).length === 0) {
      this.markAsDirty(locationName, this.locationNameFormControl);
      this.itemComponent.markAllAsDirty();
      return;
    }

    this.locationService.addLocation(new NewLocation(locationName, this.itemComponent.getCreatedItem().item))
      .subscribe(location => {
        this.locations.push(location);
        this.itemComponent.clearItem();
      });
  }
}
