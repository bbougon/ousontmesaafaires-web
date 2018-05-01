import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadComponent} from './upload.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppModule} from '../app.module';
import {SignatureService} from './signature.service';
import {of} from 'rxjs/observable/of';
import {Item} from '../domain/item';
import {FakeFileUploader} from './testing/fake-file-uploader';
import {Signature} from './signature';
import Spy = jasmine.Spy;

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let signatureService: SignatureService;
  let spiedSignatureService: Spy;
  let spiedUploaderUploadItem: Spy;
  let spiedUploaderSetOptions: Spy;
  let spiedUploaderOnBuildItemForm: Spy;
  let fakeFileUploader: FakeFileUploader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal, SignatureService],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fakeFileUploader = new FakeFileUploader({});
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    signatureService = fixture.debugElement.injector.get(SignatureService);
    component.uploader = fakeFileUploader;
    spiedUploaderUploadItem = spyOn(component.uploader, 'uploadItem');
    spiedUploaderSetOptions = spyOn(component.uploader, 'setOptions');
    spiedUploaderOnBuildItemForm = spyOn(component.uploader, 'onBuildItemForm');
    fixture.detectChanges();
    spiedSignatureService = spyOn(signatureService, 'sign').and.returnValue(of(new Signature('1234', 'abcd')));
    component.item = new Item({'hash': '123456', 'couleur': 'rouge'});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls signature service', () => {
    component.timestamp = 1315060510;
    const firstFile = new File(['a file content'], 'my_file');
    const anotherFile = new File(['another file content'], 'my_other_file');
    const files: File[] = [firstFile, anotherFile];
    component.uploader.addToQueue(files);

    component.uploadAll();

    expectUploaderOptions();
    expectSignatureServiceCall('123456_1', 'c_scale,w_80|c_scale,w_400|c_scale,w_800');
    expectSignatureServiceCall('123456_2', 'c_scale,w_80|c_scale,w_400|c_scale,w_800');
  });

  it('then upload to third part service', () => {
    component.timestamp = 1315060510;
    const files: File[] = [new File(['a file content'], 'my_file')];
    component.uploader.addToQueue(files);

    component.uploadAll();

    const call = spiedUploaderOnBuildItemForm.calls.mostRecent().args;
    expect(call[0].withCredentials).toBeFalsy();
    expect(fakeFileUploader.onBuildItemFormHaveBeenCalledWith(call[1],
      {folder: '123456'},
      {timestamp: 1315060510},
      {public_id: '123456_1'},
      {api_key: '1234'},
      {eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'},
      {signature: 'abcd'}))
      .toBeTruthy();
    expect(spiedUploaderOnBuildItemForm).toHaveBeenCalled();
    expect(spiedUploaderUploadItem).toHaveBeenCalledTimes(1);
  });

  it('can upload to third part service as many time there is a file to upload', () => {
    component.timestamp = 1315060510;
    const files: File[] = [new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')];
    component.uploader.addToQueue(files);

    component.uploadAll();

    const firstCall = spiedUploaderOnBuildItemForm.calls.first().args;
    expect(firstCall[0].withCredentials).toBeFalsy();
    expect(fakeFileUploader.onBuildItemFormHaveBeenCalledWith(firstCall[1],
      {folder: '123456'},
      {timestamp: 1315060510},
      {public_id: '123456_1'},
      {api_key: '1234'},
      {eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'},
      {signature: 'abcd'}))
      .toBeTruthy();
    expect(spiedUploaderOnBuildItemForm).toHaveBeenCalled();
    expect(spiedUploaderUploadItem).toHaveBeenCalledTimes(2);
    expect(spiedUploaderOnBuildItemForm).toHaveBeenCalled();
    const mostRecentCall = spiedUploaderOnBuildItemForm.calls.mostRecent().args;
    expect(mostRecentCall[0].withCredentials).toBeFalsy();
    expect(fakeFileUploader.onBuildItemFormHaveBeenCalledWith(mostRecentCall[1],
      {folder: '123456'},
      {timestamp: 1315060510},
      {public_id: '123456_2'},
      {api_key: '1234'},
      {eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'},
      {signature: 'abcd'}))
      .toBeTruthy();
  });

  const expectSignatureServiceCall = function (publicId: string, eager: string) {
    expect(spiedSignatureService).toHaveBeenCalledWith({
      timestamp: 1315060510,
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
