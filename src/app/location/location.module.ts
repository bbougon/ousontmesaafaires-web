import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PairPipe} from '../infrastructure/pair-pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PairPipe
  ],
  exports: [
    PairPipe
  ]
})
export class LocationModule { }
