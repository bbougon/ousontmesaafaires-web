import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Item} from '../domain/item';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {FormService} from '../infrastructure/form.service';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {isUndefined} from 'util';

@Component({
  selector: 'ng-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers: [PairPipe]
})
export class ItemComponent implements OnInit {

  @ViewChild('featureHint') public featureHint: NgbPopover;
  @ViewChild('featureType') public featureType: ElementRef;
  @ViewChild('feature') public feature: ElementRef;

  addItemForm: FormGroup;
  featureTypeFormControl: FormControl;
  featureValueFormControl: FormControl;
  item = {};
  itemToCreate: Item;

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
    this.featureHint.close();
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

  getCreatedItem(): Item {
    return this.itemToCreate;
  }

  hint() {
    if (!isUndefined(this.featureHint)) {
      this.featureHint.close();
      if (this.itemsAreEmpty()) {
        return;
      }
      if (!this.featureHint.isOpen()) {
        this.featureHint.open();
      }
    }
  }

  itemsAreEmpty() {
    return this.featureType.nativeElement.value.trim() === '' || this.feature.nativeElement.value.trim() === '';
  }
}
