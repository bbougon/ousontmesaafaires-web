import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
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
  @ViewChildren(ItemComponent) itemComponents: QueryList<ItemComponent>;

  locations: LocationCreated[] = [];
  addLocationForm: FormGroup;
  locationNameFormControl: FormControl;
  isCollapsed: Boolean[] = [];
  pdf: any;

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
    this.itemComponent.hint();
    if (locationName.trim() === '' || Object.keys(this.itemComponent.getItem()).length === 0) {
      this.formService.markAsDirty(locationName, this.locationNameFormControl);
      this.itemComponent.markAllAsDirty();
      return;
    }

    if (!this.itemComponent.itemsAreEmpty()) {
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
    itemComponent.hint();
    if (Object.keys(itemComponent.getItem()).length === 0) {
      itemComponent.markAllAsDirty();
      return;
    }

    if (!itemComponent.itemsAreEmpty()) {
      return;
    }

    this.locationService.addItemToLocation(id, itemComponent.getCreatedItem())
      .subscribe(() => {
          this.locations.map((location: LocationCreated) => {
            if (location.id === id) {
              location.add(itemComponent.getCreatedItem());
              itemComponent.clearItem();
            }
          });
      });
  }

  generateSticker(locationId: String) {
    this.locationService.generateSticker(locationId)
      .subscribe((pdf) => {
        this.pdf = pdf;
      });
  }
}
