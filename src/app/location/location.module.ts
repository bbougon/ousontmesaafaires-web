import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [
    PairPipe
  ],
  exports: [
    PairPipe
  ]
})
export class LocationModule {
}
