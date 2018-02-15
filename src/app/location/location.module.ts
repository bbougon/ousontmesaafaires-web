import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PairPipe} from '../infrastructure/pair-pipe';
import {HttpModule} from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [
    PairPipe
  ],
  exports: [
    PairPipe
  ]
})
export class LocationModule { }
