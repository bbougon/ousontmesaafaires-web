import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {LocationComponent} from './location/location.component';
import {LocationService} from './location/location.service';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConnectionBackend, Http, HttpModule} from '@angular/http';
import {HttpErrorHandler} from './infrastructure/http-error-handler.service';
import {MessageService} from './infrastructure/message.service';
import {FakeLocationService} from './location/testing/fake-location.service';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, LocationComponent
      ],
      providers: [{provide: LocationService, useClass:  FakeLocationService},
        ConnectionBackend, HttpClient, HttpHandler, HttpErrorHandler, MessageService],
      imports: [FormsModule, ReactiveFormsModule, HttpModule, HttpClientModule]
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
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Add location');
  }));
});
