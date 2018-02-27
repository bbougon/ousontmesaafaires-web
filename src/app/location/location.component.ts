import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationService} from './location.service';
import {NewLocation} from '../domain/new-location';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {LocationCreated} from '../domain/location-created';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemComponent} from '../item/item.component';
import {FormService} from '../infrastructure/form.service';
import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ng-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  providers: [PairPipe],
})
export class LocationComponent implements OnInit {

  @ViewChild(ItemComponent) itemComponent: ItemComponent;
  @ViewChild('locationCollapse') locationCollapse: NgbCollapse;

  locations: LocationCreated[] = [];
  addLocationForm: FormGroup;
  locationNameFormControl: FormControl;
  isCollapsed: Boolean[] = [];

  constructor(private locationService: LocationService, private formService: FormService) {
  }

  ngOnInit() {
    this.locationNameFormControl = new FormControl('', Validators.required);
    this.addLocationForm = new FormBuilder().group({
      locationNameFormControl: this.locationNameFormControl,
    });
    this.locationService.getLocations().subscribe((locations: LocationCreated[]) => {
        this.locations = locations;
        this.locations.forEach(() => this.isCollapsed.push(true));
      }
    );
  }

  addLocation(locationName: string): void {
    if (locationName.trim() === '' || Object.keys(this.itemComponent.getItem()).length === 0) {
      this.formService.markAsDirty(locationName, this.locationNameFormControl);
      this.itemComponent.markAllAsDirty();
      if (!this.itemComponent.itemsAreEmpty()) {
        this.itemComponent.hint();
      }
      return;
    }

    if (!this.itemComponent.itemsAreEmpty()) {
      this.itemComponent.hint();
      return;
    }

    this.locationService.addLocation(new NewLocation(locationName, this.itemComponent.getCreatedItem().item))
      .subscribe(location => {
        this.formService.resetFormControl(this.locationNameFormControl);
        this.locations.push(location);
        this.itemComponent.clearItem();
      });
  }

  collapse(elementId: number) {
    this.isCollapsed[elementId] = !this.isCollapsed[elementId];
  }

  addItemToLocation(id: String, itemComponent: ItemComponent) {
    // console.log('id : ' + id + ' - item : ' + JSON.stringify(itemComponent.getCreatedItem().item));
    this.locationService.addItemToLocation(id, itemComponent.getCreatedItem())
      .subscribe(() => {
          this.locations.map((location: LocationCreated) => {
            if (location.id === id) {
              location.add(itemComponent.getCreatedItem());
            }
          });
      });
  }
}
