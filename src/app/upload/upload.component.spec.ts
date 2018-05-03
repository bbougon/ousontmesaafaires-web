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
  let fakeFileUploader: FakeFileUploader;
  let fakeDateTimeProvider: FakeDateTimeProvider;
  const response = '{ "public_id": "eneivicys42bq5f2jpn2", "version": 1473596672, "signature": "abcdefghijklmnopqrstuvwxyz12345",'
    + '"width": 1000, "height": 672, "access_control": [{ "access_type": "token" },{ "access_type": "anonymous", '
    + '"start": "2017-12-15T12:00Z", "end": "2018-01-20T12:00Z" }],'
    + '"format": "jpg","resource_type": "image","created_at": "2017-08-11T12:24:32Z","tags": [],"bytes": 350749,"type": "upload",'
    + '"etag": "5297bd123ad4ddad723483c176e35f6e","url": '
    + '"http://res.cloudinary.com/demo/image/upload/v1473596672/eneivicys42bq5f2jpn2.jpg",'
    + '"secure_url": "https://res.cloudinary.com/demo/image/upload/v1473596672/eneivicys42bq5f2jpn2.jpg","original_filename": "sample",'
    + '"eager": [{ "transformation": "c_pad,h_300,w_400","width": 400,"height": 300,'
    + '"url": "https://res.cloudinary.com/demo/image/upload/c_pad,h_300,w_400/v1473596672/eneivicys42bq5f2jpn2.jpg",'
    + '"secure_url": "https://res.cloudinary.com/demo/image/upload/c_pad,h_300,w_400/v1473596672/eneivicys42bq5f2jpn2.jpg" },'
    + '{ "transformation": "c_crop,g_north,h_200,w_260","width": 260,"height": 200,'
    + '"url": "https://res.cloudinary.com/demo/image/upload/c_crop,g_north,h_200,w_260/v1473596672/eneivicys42bq5f2jpn2.jpg",'
    + '"secure_url": "https://res.cloudinary.com/demo/image/upload/c_crop,g_north,h_200,w_260/v1473596672/eneivicys42bq5f2jpn2.jpg" }]}';

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
    spiedContainerService = spyOn(containerService, 'patchContainer');
    component.item = new Item({'hash': '123456', 'couleur': 'rouge'});
    fakeDateTimeProvider = new FakeDateTimeProvider(createDateAtUTC(2011, 8, 3, 16, 35, 10, 20));
    component.dateTimeProvider = fakeDateTimeProvider;
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

  it('can upload to third part service as many time there is a file to upload', () => {
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
