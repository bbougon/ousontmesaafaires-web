import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {LocationService} from './location/location.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpErrorHandler} from './infrastructure/http-error-handler.service';
import {MessageService} from './infrastructure/message.service';
import {FakeLocationService} from './location/testing/fake-location.service';
import {AppModule} from './app.module';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: LocationService, useClass:  FakeLocationService},
        HttpErrorHandler, MessageService],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, AppModule]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app.title).toEqual('app');
  }));
  it('should have location component loaded', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-location')).toBeTruthy();
  }));
  it('should have error message component loaded', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-error-message')).toBeTruthy();
  }));
});
