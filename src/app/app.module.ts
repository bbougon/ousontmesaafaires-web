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
import {CarouselComponent} from './carousel/carousel.component';
import {CryptoService} from './infrastructure/crypto.service';
import {MoveItemToContainerComponent} from './move-item-to-container/move-item-to-container.component';
import {ExtractItemFromContainerComponent} from './extract-item-from-container/extract-item-from-container.component';
import {ExtractedItemComponent} from './extracted-item/extracted-item.component';
import {ExtractedItemService} from './extracted-item/extracted-item.service';
import {ExtractedItemsComponent} from './extracted-items/extracted-items.component';
import {ExtractedItemDetailComponent} from './extracted-item-detail/extracted-item-detail.component';

const routes: Routes = [
  {path: '', redirectTo: 'containers', pathMatch: 'full'},
  {path: 'containers/:id', component: ContainerDetailComponent},
  {path: 'containers', component: ContainerComponent},
  {path: 'extracted-items', component: ExtractedItemsComponent},
  {path: 'extracted-items/:id', component: ExtractedItemDetailComponent}
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
    UploadComponent,
    CarouselComponent,
    MoveItemToContainerComponent,
    ExtractItemFromContainerComponent,
    ExtractedItemComponent,
    ExtractedItemsComponent,
    ExtractedItemDetailComponent
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
  providers: [
    ContainerService,
    HttpErrorHandler,
    FormService,
    ClockworkService,
    SignatureService,
    UuidService,
    CryptoService,
    ExtractedItemService
  ],
  bootstrap: [AppComponent],
  exports: [
    TruncatePipe
  ],
  entryComponents: [
    ErrorMessageComponent,
    PrintComponent,
    UploadComponent,
    CarouselComponent,
    MoveItemToContainerComponent,
    ExtractItemFromContainerComponent
  ]
})
export class AppModule {
}
