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
import {CONTAINER, FakeContainerService} from '../container/testing/fake-container.service';
import {FileItem} from 'ng2-file-upload';
import {response} from './cloudinary-response';
import {Patch} from '../infrastructure/patch/patch';
import {UuidService} from '../infrastructure/uuid.service';
import {FakeUuidService} from '../../testing/fake-uuid.service';
import {ImageStore} from '../domain/image-store';
import {Image} from '../domain/image';
import {Container} from '../domain/container';
import {CryptoService} from '../infrastructure/crypto.service';
import {FakeCryptoService} from '../../testing/fake-crypto-service';
import Spy = jasmine.Spy;

describe('UploadComponent', () => {

  const retrievedContainer = {
      'id': 'an-id',
      'name': 'Bureau',
      'items': [{
        'item': {'type': 'chaussure'},
        'imageStore': {
          'folder': 'folder_name',
          'images': [{
            'signature': 'signature',
            'url': 'url',
            'secureUrl': 'secureUrl',
            'resizedImages': [{
              'url': 'assets/testing/url2.png',
              'secureUrl': 'assets/testing/secureUrl2.png',
              'height': 110.0,
              'width': 80.0
            }, {
              'url': 'assets/testing/url3.png',
              'secureUrl': 'assets/testing/secureUrl3.png',
              'height': 552.0,
              'width': 400.0
            }, {
              'url': 'assets/testing/url4.png',
              'secureUrl': 'assets/testing/secureUrl4.png',
              'height': 1103.0,
              'width': 800.0
            }]
          }, {
            'signature': 'signature2',
            'url': 'url5',
            'secureUrl': 'secureUrl5',
            'resizedImages': [{
              'url': 'assets/testing/url6.png',
              'secureUrl': 'assets/testing/secureUrl6.png',
              'height': 110.0,
              'width': 80.0
            }, {
              'url': 'assets/testing/url7.png',
              'secureUrl': 'assets/testing/secureUrl7.png',
              'height': 552.0,
              'width': 400.0
            }, {
              'url': 'assets/testing/url8.png',
              'secureUrl': 'assets/testing/secureUrl8.png',
              'height': 1103.0,
              'width': 800.0
            }]
          }]
        },
        'hash': '5acba3dc1c6bb5d7df07230d2538f4f938a002da'
      }, {
        'item': {'type': 'pantalon', 'couleur': 'marron'},
        'imageStore': {
          'folder': 'folder_name_2',
          'images': [{
            'signature': 'signature_2',
            'url': 'assets/testing/url5.png',
            'secureUrl': 'assets/testing/secureUrl5.png',
            'resizedImages': [{
              'url': 'assets/testing/url6.png',
              'secureUrl': 'assets/testing/secureUrl6.png',
              'height': 110.0,
              'width': 80.0
            }, {
              'url': 'assets/testing/url7.png',
              'secureUrl': 'assets/testing/secureUrl7.png',
              'height': 552.0,
              'width': 400.0
            }, {
              'url': 'assets/testing/url8.png',
              'secureUrl': 'assets/testing/secureUrl8.png',
              'height': 1103.0,
              'width': 800.0
            }]
          }]
        },
        'hash': '1de26eb55d4baa7a24ac94715b075103630bf2c9'
      }]
    }
  ;

  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let signatureService: SignatureService;
  let containerService: ContainerService;
  let spiedSignatureService: Spy;
  let spiedUploaderUploadItem: Spy;
  let spiedUploaderSetOptions: Spy;
  let spiedUploaderCancelAll: Spy;
  let spiedContainerService: Spy;
  let spiedCloseModal: Spy;
  let fakeFileUploader: FakeFileUploader;
  let fakeDateTimeProvider: FakeDateTimeProvider;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        NgbActiveModal,
        SignatureService,
        {provide: ContainerService, useClass: FakeContainerService},
        {provide: UuidService, useClass: FakeUuidService},
        CryptoService
      ],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fakeFileUploader = new FakeFileUploader({}, component);
    signatureService = fixture.debugElement.injector.get(SignatureService);
    containerService = fixture.debugElement.injector.get(ContainerService);
    component.uploader = fakeFileUploader;
    spiedUploaderUploadItem = spyOn(component.uploader, 'uploadItem');
    spiedUploaderSetOptions = spyOn(component.uploader, 'setOptions');
    spiedUploaderCancelAll = spyOn(component.uploader, 'cancelAll');
    fixture.detectChanges();
    spiedSignatureService = spyOn(signatureService, 'sign').and.returnValue(of(new Signature({
      apiKey: '1234',
      signature: 'abcd'
    })));
    spiedContainerService = spyOn(containerService, 'patchContainer')
      .and.returnValue(of(new Container(retrievedContainer)));
    component.item = new Item({
      item: {
        'type': 'chaussure'
      },
      imageStore: new ImageStore('folder_name', [new Image(
        'signature', 'url', 'secureUrl', [{
          'url': 'assets/testing/url2.png',
          'secureUrl': 'assets/testing/secureUrl2.png',
          'height': 110.0,
          'width': 80.0
        }, {
          'url': 'assets/testing/url3.png',
          'secureUrl': 'assets/testing/secureUrl3.png',
          'height': 552.0,
          'width': 400.0
        }, {
          'url': 'assets/testing/url4.png',
          'secureUrl': 'assets/testing/secureUrl4.png',
          'height': 1103.0,
          'width': 800.0
        }]
      )]),
      hash: '123456'
    });
    component.containerId = '12345';
    fakeDateTimeProvider = new FakeDateTimeProvider(createDateAtUTC(2011, 8, 3, 16, 35, 10, 20));
    component.dateTimeProvider = fakeDateTimeProvider;
    spiedCloseModal = spyOn(component.activeModal, 'close');
    const fakeUuidService: FakeUuidService = <FakeUuidService>fixture.debugElement.injector.get(UuidService);
    fakeUuidService.uuids = ['123456_1', '123456_2'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('execute upload actions', () => {
    it('calls signature service', () => {
      component.uploader.addToQueue([new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')]);

      component.uploadAll();

      expectUploaderOptions();
      expectSignatureServiceCall(component.item.item.imageStore.folder, '123456_1',
        'c_scale,w_45|c_scale,w_80|c_scale,w_400|c_scale,w_800');
      expectSignatureServiceCall(component.item.item.imageStore.folder, '123456_2',
        'c_scale,w_45|c_scale,w_80|c_scale,w_400|c_scale,w_800');
    });

    it('then upload to third part service', () => {
      const formData = new FormData();
      const fileItem = new FileItem(component.uploader, new File(['an uploaded file content'], 'an_uploaded_file'), {});
      spiedUploaderUploadItem.and.callFake(() => {
        component.uploader.onBuildItemForm(fileItem,
          formData
        );
      });
      component.uploader.addToQueue([new File(['a file content'], 'my_file')]);

      component.uploadAll();

      expectFormDataAndFileItem(formData, 'folder_name', '1315067710', '123456_1', '1234',
        'c_scale,w_45|c_scale,w_80|c_scale,w_400|c_scale,w_800', 'abcd', fileItem);
      expect(spiedUploaderUploadItem).toHaveBeenCalledTimes(1);
    });

    it('as many time there is a file to upload', () => {
      let alreadyCalled = false;
      const formData = new FormData();
      const formData2 = new FormData();
      const fileItem = new FileItem(component.uploader, new File(['a file content'], 'my_file'), {});
      const fileItem2 = new FileItem(component.uploader, new File(['another file content'], 'my_other_file'), {});
      spiedUploaderUploadItem.and.callFake(() => {
        if (alreadyCalled) {
          component.uploader.onBuildItemForm(fileItem2, formData2);
        } else {
          component.uploader.onBuildItemForm(fileItem, formData);
        }
        alreadyCalled = true;
      });
      fakeDateTimeProvider.addDate(createDateAtUTC(2011, 8, 3, 16, 35, 25, 20));
      const files: File[] = [new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')];
      component.uploader.addToQueue(files);

      component.uploadAll();

      expectFormDataAndFileItem(formData, 'folder_name', '1315067710', '123456_1', '1234',
        'c_scale,w_45|c_scale,w_80|c_scale,w_400|c_scale,w_800', 'abcd', fileItem);
      expectFormDataAndFileItem(formData2, 'folder_name', '1315067725', '123456_2', '1234',
        'c_scale,w_45|c_scale,w_80|c_scale,w_400|c_scale,w_800', 'abcd', fileItem2);
      expect(spiedUploaderUploadItem).toHaveBeenCalledTimes(2);
    });

    it('once upload done send result to api', () => {
      spiedUploaderUploadItem.and.callFake(() => {
        component.uploader.onCompleteItem(
          new FileItem(component.uploader, new File(['an uploaded file content'], 'an_uploaded_file'), {}), response, 200, {});
      });
      const spiedOnCompleteUpload = spyOn(component, 'onCompleteUpload').and.callThrough();
      fakeDateTimeProvider.addDate(createDateAtUTC(2011, 8, 3, 16, 35, 25, 20));
      const files: File[] = [new File(['a file content'], 'my_file')];
      component.uploader.addToQueue(files);

      component.uploadAll();

      expect(spiedOnCompleteUpload).toHaveBeenCalledTimes(1);
      expect(spiedCloseModal).toHaveBeenCalledTimes(1);
    });

    it('and api service is called', () => {
      const patch = new Patch('item', component.item.item.hash).unwrap({
        signature: 'signature2',
        url: 'url5',
        secure_url: 'secureUrl5',
        resizedImages: [{
          url: 'assets/testing/url6.png',
          secure_url: 'assets/testing/secureUrl6.png',
          height: 110.0,
          width: 80.0
        },
          {url: 'assets/testing/url7.png', secure_url: 'assets/testing/secureUrl7.png', height: 552.0, width: 400.0},
          {url: 'assets/testing/url8.png', secure_url: 'assets/testing/secureUrl8.png', height: 1103.0, width: 800.0}]
      });

      component.persistUpload(patch, function () {
        component.closeModal();
      });

      expect(spiedContainerService).toHaveBeenCalledWith(component.containerId, patch);
      expect(spiedCloseModal).toHaveBeenCalled();
      expect(component.item.item.hash).toBe('5acba3dc1c6bb5d7df07230d2538f4f938a002da');
      expect(component.item.item.imageStore.images.length).toBe(2);
    });

    it('modal is closed once all uploads ended', () => {
      spiedContainerService.and.returnValue(of(new Container({
          'id': 'an-id',
          'name': 'Bureau',
          'items': [{
            'item': {'type': 'chaussure'},
            'imageStore': {
              'folder': 'folder_name',
              'images': [{
                'signature': 'signature',
                'url': 'url',
                'secureUrl': 'secureUrl',
                'resizedImages': [{
                  'url': 'assets/testing/url2.png',
                  'secureUrl': 'assets/testing/secureUrl2.png',
                  'height': 110.0,
                  'width': 80.0
                }, {
                  'url': 'assets/testing/url3.png',
                  'secureUrl': 'assets/testing/secureUrl3.png',
                  'height': 552.0,
                  'width': 400.0
                }, {
                  'url': 'assets/testing/url4.png',
                  'secureUrl': 'assets/testing/secureUrl4.png',
                  'height': 1103.0,
                  'width': 800.0
                }]
              }, {
                'signature': 'signature2',
                'url': 'url5',
                'secureUrl': 'secureUrl5',
                'resizedImages': [{
                  'url': 'assets/testing/url6.png',
                  'secureUrl': 'assets/testing/secureUrl6.png',
                  'height': 110.0,
                  'width': 80.0
                }, {
                  'url': 'assets/testing/url7.png',
                  'secureUrl': 'assets/testing/secureUrl7.png',
                  'height': 552.0,
                  'width': 400.0
                }, {
                  'url': 'assets/testing/url8.png',
                  'secureUrl': 'assets/testing/secureUrl8.png',
                  'height': 1103.0,
                  'width': 800.0
                }]
              }]
            },
            'hash': 'sha-1'
          }]
        })));
      const cryptoService: CryptoService = fixture.debugElement.injector.get(CryptoService);
      spyOn(cryptoService, 'sha1').and.returnValue(new FakeCryptoService((message) => 'sha-1'));
      const patch = new Patch('item', component.item.item.hash).unwrap({
        signature: 'signature2',
        url: 'url5',
        secure_url: 'secureUrl5',
        resizedImages: [{
          url: 'assets/testing/url6.png',
          secure_url: 'assets/testing/secureUrl6.png',
          height: 110.0,
          width: 80.0
        },
          {url: 'assets/testing/url7.png', secure_url: 'assets/testing/secureUrl7.png', height: 552.0, width: 400.0},
          {url: 'assets/testing/url8.png', secure_url: 'assets/testing/secureUrl8.png', height: 1103.0, width: 800.0}]
      });

      component.persistUpload(patch);
      component.persistUpload(patch, () => {
        component.closeModal();
      });

      expect(spiedContainerService).toHaveBeenCalledWith(component.containerId, patch);
      expect(spiedCloseModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute other actions', () => {

    it('removes image from queue list', () => {
      component.item = CONTAINER.items[0];
      component.uploader.addToQueue([new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')]);

      component.remove(component.uploader.queue[0]);

      expect(component.uploader.queue.length).toBe(1);
      expect(component.uploader.queue[0].file.name).toBe('my_other_file');
    });

    it('removes all images from queue list', () => {
      component.item = CONTAINER.items[0];
      component.uploader.addToQueue([new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')]);

      component.removeAll();

      expect(component.uploader.queue.length).toBe(0);
    });

    it('aborts all images upload', () => {
      component.item = CONTAINER.items[0];
      component.uploader.addToQueue([new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')]);

      component.cancelAll();

      expect(spiedUploaderCancelAll).toHaveBeenCalledTimes(1);
    });

  });

  const expectFormDataAndFileItem = function (formData: FormData, expectedFolder: string, expectedTimestamp: string,
                                              expectedPublicId: string, expectedApiKey: string, expectedEager: string,
                                              expectedSignature: string, fileItem: FileItem) {
    expect(formData.get('folder')).toBe(expectedFolder);
    expect(formData.get('timestamp')).toBe(expectedTimestamp);
    expect(formData.get('public_id')).toBe(expectedPublicId);
    expect(formData.get('api_key')).toBe(expectedApiKey);
    expect(formData.get('eager')).toBe(expectedEager);
    expect(formData.get('signature')).toBe(expectedSignature);
    expect(fileItem.withCredentials).toBeFalsy();
  };

  const createDateAtUTC = function (year: number, month: number, date2: number, hours: number, min: number, sec: number, ms: number) {
    const date = new Date();
    date.setUTCFullYear(year, month, date2);
    date.setUTCHours(hours, min, sec, ms);
    return date;
  };

  const expectSignatureServiceCall = function (folder: string, publicId: string, eager: string) {
    expect(spiedSignatureService).toHaveBeenCalledWith({
      timestamp: 1315067710,
      folder: folder,
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
