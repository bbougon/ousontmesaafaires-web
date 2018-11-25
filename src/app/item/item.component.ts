import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Item} from '../domain/item';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {FormService} from '../infrastructure/form.service';

@Component({
  selector: 'ng-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers: [PairPipe]
})
export class ItemComponent implements OnInit {

  @ViewChild('feature') public feature: ElementRef;

  addItemForm: FormGroup;
  featureValueFormControl: FormControl;
  item: Item;
  constructor(private formService: FormService) {
  }

  ngOnInit() {
    this.featureValueFormControl = new FormControl('', Validators.required);
    this.addItemForm = new FormBuilder().group({
      featureValueFormControl: this.featureValueFormControl,
    });
  }

  clearItem() {
    this.item = null;
  }

  getItem(): Item {
    return this.item;
  }

  markAllAsDirty() {
    this.formService.markAsDirty('', this.featureValueFormControl);
  }

  itemIsEmpty() {
    const feature = this.feature.nativeElement.value;
    this.formService.markAsDirty(feature, this.featureValueFormControl);
    if (this.featureValueFormControl.invalid) {
      this.formService.resetFormControl(this.featureValueFormControl);
      return;

    }
    this.formService.resetFormControl(this.featureValueFormControl);
    return feature.trim() === '';
  }

  setItemValue(value: String) {
    this.item = new Item(value.trim());
  }
}
