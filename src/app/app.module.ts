import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ContainerModule} from './container/container.module';
import {ContainerComponent} from './container/container.component';
import {ContainerService} from './container/container.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpErrorHandler} from './infrastructure/http-error-handler.service';
import {ErrorMessageComponent} from './error-message/error-message.component';
import {ItemComponent} from './item/item.component';
import {FormService} from './infrastructure/form.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TruncatePipe} from './infrastructure/pipe/truncate-pipe';
import {OcticonDirective} from './infrastructure/directive/octicon.directive';
import {ItemPipe} from './infrastructure/pipe/item-pipe';
import {PrintComponent} from './print/print.component';
import {PrintDirective} from './print/print.directive';
import {RouterModule, Routes} from '@angular/router';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import {ContainerDetailComponent} from './container-detail/container-detail.component';
import {ClockworkService} from './infrastructure/clockwork.service';
import {UploadComponent} from './upload/upload.component';
import {FileUploadModule} from 'ng2-file-upload';
import {SignatureService} from './upload/signature.service';
import {UuidService} from './infrastructure/uuid.service';

const routes: Routes = [
  {path: '', redirectTo: 'containers', pathMatch: 'full'},
  {path: 'containers/:id', component: ContainerDetailComponent},
  {path: 'containers', component: ContainerComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ContainerComponent,
    TruncatePipe,
    ItemPipe,
    OcticonDirective,
    ErrorMessageComponent,
    PrintComponent,
    PrintDirective,
    ContainerDetailComponent,
    UploadComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true}),
    HttpClientModule,
    BrowserModule,
    ContainerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    FileUploadModule
  ],
  providers: [ContainerService, HttpErrorHandler, FormService, ClockworkService, SignatureService, UuidService],
  bootstrap: [AppComponent],
  exports: [
    TruncatePipe
  ],
  entryComponents: [
    ErrorMessageComponent,
    PrintComponent,
    UploadComponent
  ]
})
export class AppModule {
}
