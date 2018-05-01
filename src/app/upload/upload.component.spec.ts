import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadComponent} from './upload.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppModule} from '../app.module';
import {SignatureService} from './signature.service';
import {of} from 'rxjs/observable/of';
import {Item} from '../domain/item';
import Spy = jasmine.Spy;
import {Timestamp} from "rxjs/Rx";

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let signatureService: SignatureService;
  let spiedSignatureService: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal, SignatureService],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    signatureService = fixture.debugElement.injector.get(SignatureService);
    fixture.detectChanges();
    spiedSignatureService = spyOn(signatureService, 'sign').and.returnValue(of('abcd'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls signature service then upload to third part service', () => {
    component.item = new Item({'hash': '123456', 'couleur': 'rouge'});
    component.timestamp = 1315060510;
    const files: File[] = [new File(['a file content'], 'my_file'), new File(['another file content'], 'my_other_file')];
    component.uploader.addToQueue(files);

    component.upload();

    expect(spiedSignatureService).toHaveBeenCalledWith({timestamp: 1315060510,
      public_id: '123456_1',
      eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'});
    expect(spiedSignatureService).toHaveBeenCalledWith({timestamp: 1315060510,
      public_id: '123456_2',
      eager: 'c_scale,w_80|c_scale,w_400|c_scale,w_800'});
  });
});
