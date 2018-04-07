import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrintComponent} from './print.component';
import {NgxQRCodeComponent} from 'ngx-qrcode2';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CONTAINER} from '../container/testing/fake-container.service';
import {By} from '@angular/platform-browser';

describe('PrintComponent', () => {
  let component: PrintComponent;
  let fixture: ComponentFixture<PrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintComponent, NgxQRCodeComponent],
      providers: [NgbActiveModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintComponent);
    component = fixture.componentInstance;
    fixture.componentInstance.container = CONTAINER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have qrc-version set to 14', () => {
    expect(fixture.debugElement.query(By.css('ngx-qrcode')).attributes['qrc-version']).toEqual('14');
  });

  it('should have qrc-value set with expected url', () => {
    expect(component.getContainerUrl()).toEqual('http://localhost:9876/#/containers/' + CONTAINER.id);
  });

});
