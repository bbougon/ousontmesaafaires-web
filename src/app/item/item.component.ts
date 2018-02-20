import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Item} from '../domain/item';
import {PairPipe} from '../infrastructure/pair-pipe';
import {FormService} from '../infrastructure/form.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {


  addItemForm: FormGroup;
  featureTypeFormControl: FormControl;
  featureValueFormControl: FormControl;
  private item = {};
  private itemToCreate: Item;

  constructor(private pair: PairPipe, private formService: FormService) {
  }

  ngOnInit() {
    this.featureTypeFormControl = new FormControl('', Validators.required);
    this.featureValueFormControl = new FormControl('', Validators.required);
    this.addItemForm = new FormBuilder().group({
      featureTypeFormControl: this.featureTypeFormControl,
      featureValueFormControl: this.featureValueFormControl,
    });
  }

  add(featureType: string, feature: string): void {
    this.formService.markAsDirty(featureType, this.featureTypeFormControl);
    this.formService.markAsDirty(feature, this.featureValueFormControl);

    if (this.featureTypeFormControl.invalid || this.featureValueFormControl.invalid) {
      this.formService.resetFormControl(this.featureTypeFormControl);
      this.formService.resetFormControl(this.featureValueFormControl);
      return;
    }

    this.formService.resetFormControl(this.featureTypeFormControl);
    this.formService.resetFormControl(this.featureValueFormControl);
    this.item[featureType] = feature;
    Observable.create(this.itemToCreate = new Item(this.item));
  }

  getItemToCreate() {
    return this.itemToCreate ? this.pair.transform(this.itemToCreate.item) : '';
  }

  clearItem() {
    this.item = {};
    this.itemToCreate = null;
  }

  getItem() {
    return this.item;
  }

  markAllAsDirty() {
    this.formService.markAsDirty('', this.featureTypeFormControl);
    this.formService.markAsDirty('', this.featureValueFormControl);
  }

  getCreatedItem() {
    return this.itemToCreate;
  }
}
