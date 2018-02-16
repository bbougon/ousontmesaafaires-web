import {Component, OnInit} from '@angular/core';
import {LocationService} from './location.service';
import {Item} from '../domain/item';
import {NewLocation} from '../domain/new-location';
import {Observable} from 'rxjs/Observable';
import {PairPipe} from '../infrastructure/pair-pipe';
import {LocationCreated} from '../domain/location-created';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  providers: [PairPipe],
})
export class LocationComponent implements OnInit {

  locations: LocationCreated[] = [];
  item = {};
  itemToCreate: Item;
  addLocationForm: FormGroup;
  locationNameFormControl: FormControl;
  featureTypeFormControl: FormControl;
  featureValueFormControl: FormControl;

  constructor(private locationService: LocationService, private pair: PairPipe) {
    this.locationService.getLocations().subscribe(locations => {
        this.locations = locations;
      }
    );
  }

  ngOnInit() {
    this.locationNameFormControl = new FormControl('', Validators.required);
    this.featureTypeFormControl = new FormControl('', Validators.required);
    this.featureValueFormControl = new FormControl('', Validators.required);
    this.addLocationForm = new FormBuilder().group({
      locationNameFormControl: this.locationNameFormControl,
      featureTypeFormControl: this.featureTypeFormControl,
      featureValueFormControl: this.featureValueFormControl,
    });
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

  add(featureType: string, feature: string): void {
    this.markAsDirty(featureType, this.featureTypeFormControl);
    this.markAsDirty(feature, this.featureValueFormControl);

    if (this.featureTypeFormControl.invalid || this.featureValueFormControl.invalid) {
      this.resetFormControl(this.featureTypeFormControl);
      this.resetFormControl(this.featureValueFormControl);
      return;
    }

    this.resetFormControl(this.featureTypeFormControl);
    this.resetFormControl(this.featureValueFormControl);
    this.item[featureType] = feature;
    Observable.create(this.itemToCreate = new Item(this.item));
  }

  addLocation(locationName: string): void {
    if (locationName.trim() === '' || Object.keys(this.item).length === 0) {
      this.markAsDirty(locationName, this.locationNameFormControl);
      this.markAsDirty('', this.featureTypeFormControl);
      this.markAsDirty('', this.featureValueFormControl);
      return;
    }

    this.locationService.addLocation(new NewLocation(locationName, this.itemToCreate.item))
      .subscribe(location => {
        this.locations.push(location);
        this.item = {};
        this.itemToCreate = null;
      });
  }

  getItemToCreate() {
    return this.itemToCreate ? this.pair.transform(this.itemToCreate.item) : '';
  }
}
