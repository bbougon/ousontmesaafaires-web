import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Location} from '@angular/common';
import {AppComponent} from './app.component';
import {ContainerService} from './container/container.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpErrorHandler} from './infrastructure/http-error-handler.service';
import {MessageService} from './infrastructure/message.service';
import {FakeContainerService} from './container/testing/fake-container.service';
import {AppModule} from './app.module';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';


describe('AppComponent', () => {
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ContainerService, useClass: FakeContainerService},
        HttpErrorHandler, MessageService],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientModule, AppModule]
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  }));

  it('should create the app', async(() => {
    fixture.detectChanges();

    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));

  it('should have error message component loaded', async(() => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('ng-error-message')).toBeTruthy();
  }));

  it('should have container component loaded', async(() => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-container')).toBeTruthy();
  }));

  it('navigate to "/containers" by default', fakeAsync(() => {
    fixture.detectChanges();
    router.navigate(['']);

    tick(50);

    expect(location.path()).toBe('/containers');
  }));

  it('navigate to "/containers/12345" takes you to /containers/12345', fakeAsync(() => {
    fixture.detectChanges();
    router.navigate(['/containers/12345']);

    tick(50);

    expect(location.path()).toBe('/containers/12345');
  }));

});
