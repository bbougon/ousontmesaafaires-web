import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LocationModule} from './location/location.module';
import {LocationComponent} from './location/location.component';
import {LocationService} from './location/location.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {HttpErrorHandler} from "./infrastructure/http-error-handler.service";
import {MessageService} from "./infrastructure/message.service";

@NgModule({
  declarations: [
    AppComponent,
    LocationComponent
  ],
  imports: [
    HttpClientModule,
    HttpModule,
    BrowserModule,
    LocationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [LocationService, HttpErrorHandler, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
