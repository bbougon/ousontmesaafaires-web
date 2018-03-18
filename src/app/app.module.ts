import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LocationModule} from './location/location.module';
import {LocationComponent} from './location/location.component';
import {LocationService} from './location/location.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpErrorHandler} from './infrastructure/http-error-handler.service';
import {MessageService} from './infrastructure/message.service';
import {ErrorMessageComponent} from './error-message/error-message.component';
import {ItemComponent} from './item/item.component';
import {FormService} from './infrastructure/form.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TruncatePipe} from './infrastructure/pipe/truncate-pipe';
import {OcticonDirective} from './infrastructure/directive/octicon.directive';
import {LocationItemPipe} from './infrastructure/pipe/location-item-pipe';
import {PdfComponent} from './pdf/pdf.component';
import {PrintDirective} from './pdf/print.directive';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {RouterModule, Routes} from '@angular/router';
import {NgxQRCodeModule} from 'ngx-qrcode2';

const routes: Routes = [
  {path: '', component: AppComponent, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    LocationComponent,
    ErrorMessageComponent,
    TruncatePipe,
    LocationItemPipe,
    OcticonDirective,
    PdfComponent,
    PrintDirective
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true}),
    HttpClientModule,
    BrowserModule,
    LocationModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgxQRCodeModule
  ],
  providers: [LocationService, HttpErrorHandler, MessageService, FormService],
  bootstrap: [AppComponent],
  exports: [
    TruncatePipe
  ],
  entryComponents: [
    PdfComponent
  ]
})
export class AppModule {
}
