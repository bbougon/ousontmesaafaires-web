import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ContainerModule} from './container/container.module';
import {ContainerComponent} from './container/container.component';
import {ContainerService} from './container/container.service';
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
import {ItemPipe} from './infrastructure/pipe/item-pipe';
import {PrintComponent} from './print/print.component';
import {PrintDirective} from './print/print.directive';
import {RouterModule, Routes} from '@angular/router';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import {ContainerDetailComponent} from './container-detail/container-detail.component';

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
    ErrorMessageComponent,
    TruncatePipe,
    ItemPipe,
    OcticonDirective,
    PrintComponent,
    PrintDirective,
    ContainerDetailComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true}),
    HttpClientModule,
    BrowserModule,
    ContainerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxQRCodeModule
  ],
  providers: [ContainerService, HttpErrorHandler, MessageService, FormService],
  bootstrap: [AppComponent],
  exports: [
    TruncatePipe
  ],
  entryComponents: [
    PrintComponent
  ]
})
export class AppModule {
}
