import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LocationModule} from './location/location.module';
import {LocationComponent} from './location/location.component';
import {LocationService} from './location/location.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LocationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LocationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [LocationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
