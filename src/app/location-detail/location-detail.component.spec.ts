import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LocationDetailComponent} from './location-detail.component';
import {LocationService} from '../location/location.service';
import {FakeLocationService, LOCATION_CREATED} from '../location/testing/fake-location.service';
import {AppModule} from '../app.module';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {of} from 'rxjs/observable/of';

let activatedRoute: ActivatedRouteStub;

describe('LocationDetailComponent', () => {
  let component: LocationDetailComponent;
  let fixture: ComponentFixture<LocationDetailComponent>;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setParamMap({id: LOCATION_CREATED.id});
    TestBed.configureTestingModule({
      providers: [
        {provide: LocationService, useClass: FakeLocationService},
        {provide: ActivatedRoute, useValue: activatedRoute}
      ],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get location details on init', () => {
    const locationService = fixture.debugElement.injector.get(LocationService);
    const spiedLocationService = spyOn(locationService, 'getLocation').and.returnValue(of(LOCATION_CREATED));

    component.ngOnInit();

    expect(spiedLocationService).toHaveBeenCalled();
  });
});
