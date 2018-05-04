import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadComponent} from './upload.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppModule} from '../app.module';
import {SignatureService} from './signature.service';
import {of} from 'rxjs/observable/of';
import {Item} from '../domain/item';
import {FakeFileUploader} from './testing/fake-file-uploader';
import {Signature} from './signature';
import {FakeDateTimeProvider} from '../../testing/fake-date-time-provider';
import {ContainerService} from '../container/container.service';
import {FakeContainerService} from '../container/testing/fake-container.service';
import {FileItem} from 'ng2-file-upload';
import {response} from './cloudinary-response';
import {Patch} from '../infrastructure/patch/patch';
import Spy = jasmine.Spy;

describe('UploadComponent', () => {

  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let signatureService: SignatureService;
  let containerService: ContainerService;
  let spiedSignatureService: Spy;
  let spiedUploaderUploadItem: Spy;
  let spiedUploaderSetOptions: Spy;
  let spiedUploaderOnBuildItemForm: Spy;
  let spiedContainerService: Spy;
  let spiedCloseModal: Spy;
  let fakeFileUploader: FakeFileUploader;
  let fakeDateTimeProvider: FakeDateTimeProvider;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        NgbActiveModal,
        SignatureService,
        {provide: ContainerService, useClass: FakeContainerService}
      ],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fakeFileUploader = new FakeFileUploader({});
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    signatureService = fixture.debugElement.injector.get(SignatureService);
    containerService = fixture.debugElement.injector.get(ContainerService);
    component.uploader = fakeFileUploader;
    const uploadedFileItem = new FileItem(component.uploader, new File(['an uploaded file content'], 'an_uplobded_file'), {});
    spiedUploaderUploadItem = spyOn(component.uploader, 'uploadItem')
      .and.callFake(() => {
        component.uploader.onCompleteItem(uploadedFileItem, response, 200, {});
      });
    spiedUploaderSetOptions = spyOn(component.uploader, 'setOptions');
    spiedUploaderOnBuildItemForm = spyOn(component.uploader, 'onBuildItemForm');
    fixture.detectChanges();
    spiedSignatureService = spyOn(signatureService, 'sign').and.returnValue(of(new Signature('1234', 'abcd')));
    spiedContainerService = spyOn(containerService, 'patchContainer').and.returnValue(of({response: {status: 200}}));
    component.item = new Item({'hash': '123456', 'couleur': 'rouge'});
    component.containerId = '12345';
    fakeDateTimeProvider = new FakeDateTimeProvider(createDateAtUTC(2011, 8, 3, 16, 35, 10, 20));
    component.dateTimeProvider = fakeDateTimeProvider;
    spiedCloseModal = spyOn(component.activeModal, 'close');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls signature service', () => {
    component.uploader.addToQueue([new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')]);

    component.uploadAll();

    expectUploaderOptions();
    expectSignatureServiceCall('123456_1', 'c_scale,w_80|c_scale,w_400|c_scale,w_800');
    expectSignatureServiceCall('123456_2', 'c_scale,w_80|c_scale,w_400|c_scale,w_800');
  });

  it('then upload to third part service', () => {
    component.uploader.addToQueue([new File(['a file content'], 'my_file')]);

    component.uploadAll();

    const call = spiedUploaderOnBuildItemForm.calls.mostRecent().args;
    expect(call[0].withCredentials).toBeFalsy();
    expect(fakeFileUploader.onBuildItemFormHaveBeenCalledWith(call[1],
      {folder: '123456'},
      {timestamp: 1315067710},
      {public_id: '123456_1'},
      {api_key: '1234'},
      {eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'},
      {signature: 'abcd'}))
      .toBeTruthy();
    expect(spiedUploaderOnBuildItemForm).toHaveBeenCalled();
    expect(spiedUploaderUploadItem).toHaveBeenCalledTimes(1);
  });

  it('as many time there is a file to upload', () => {
    fakeDateTimeProvider.addDate(createDateAtUTC(2011, 8, 3, 16, 35, 25, 20));
    const files: File[] = [new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')];
    component.uploader.addToQueue(files);

    component.uploadAll();

    const firstCall = spiedUploaderOnBuildItemForm.calls.first().args;
    expect(firstCall[0].withCredentials).toBeFalsy();
    expect(fakeFileUploader.onBuildItemFormHaveBeenCalledWith(firstCall[1],
      {folder: '123456'}, {timestamp: 1315067710}, {public_id: '123456_1'},
      {api_key: '1234'}, {eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'}, {signature: 'abcd'}))
      .toBeTruthy();
    expect(spiedUploaderOnBuildItemForm).toHaveBeenCalled();
    expect(spiedUploaderUploadItem).toHaveBeenCalledTimes(2);
    expect(spiedUploaderOnBuildItemForm).toHaveBeenCalled();
    const mostRecentCall = spiedUploaderOnBuildItemForm.calls.mostRecent().args;
    expect(mostRecentCall[0].withCredentials).toBeFalsy();
    expect(fakeFileUploader.onBuildItemFormHaveBeenCalledWith(mostRecentCall[1],
      {folder: '123456'},
      {timestamp: 1315067725},
      {public_id: '123456_2'},
      {api_key: '1234'},
      {eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'},
      {signature: 'abcd'}))
      .toBeTruthy();
  });

  it('once upload done send result to api', async(() => {
    const spiedOnCompleteUpload = spyOn(component, 'onCompleteUpload');
    fakeDateTimeProvider.addDate(createDateAtUTC(2011, 8, 3, 16, 35, 25, 20));
    const files: File[] = [new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')];
    component.uploader.addToQueue(files);

    component.uploadAll();

    expect(spiedOnCompleteUpload).toHaveBeenCalledTimes(2);
  }));

  it('and api service is called', () => {
    const patch = new Patch('item', component.item.item.hash).unwrap({
      signature: 'signature',
      url: 'image url',
      secure_url: 'image secure url',
      resizedImages: [{url: 'url', secure_url: 'secure_url', width: 100, height: 200}]
    });

    component.persistUpload(patch);

    expect(spiedContainerService).toHaveBeenCalledWith(component.containerId, patch);
    expect(spiedCloseModal).toHaveBeenCalled();
  });

  const createDateAtUTC = function (year: number, month: number, date2: number, hours: number, min: number, sec: number, ms: number) {
    const date = new Date();
    date.setUTCFullYear(year, month, date2);
    date.setUTCHours(hours, min, sec, ms);
    return date;
  };

  const expectSignatureServiceCall = function (publicId: string, eager: string) {
    expect(spiedSignatureService).toHaveBeenCalledWith({
      timestamp: 1315067710,
      public_id: publicId,
      eager: eager
    });
  };

  const expectUploaderOptions = function () {
    expect(spiedUploaderSetOptions).toHaveBeenCalledWith({
      url: `https://api.cloudinary.com/v1_1/ajairu/upload`,
      autoUpload: false,
      allowedMimeType: ['image/gif', 'image/jpeg', 'image/png'],
      isHTML5: true,
      removeAfterUpload: true,
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    });
  };
})
;
