import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerDetailComponent} from './container-detail.component';
import {ContainerService} from '../container/container.service';
import {FakeContainerService, CONTAINER} from '../container/testing/fake-container.service';
import {AppModule} from '../app.module';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {of} from 'rxjs/observable/of';

let activatedRoute: ActivatedRouteStub;

describe('ContainerDetailComponent', () => {
  let component: ContainerDetailComponent;
  let fixture: ComponentFixture<ContainerDetailComponent>;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.setParamMap({id: CONTAINER.id});
    TestBed.configureTestingModule({
      providers: [
        {provide: ContainerService, useClass: FakeContainerService},
        {provide: ActivatedRoute, useValue: activatedRoute}
      ],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get container details on init', () => {
    const containerService = fixture.debugElement.injector.get(ContainerService);
    const spiedService = spyOn(containerService, 'getContainer').and.returnValue(of(CONTAINER));

    component.ngOnInit();

    expect(spiedService).toHaveBeenCalled();
    expect(component.container).not.toBeNull();
    expect(component.container).toBeTruthy();
  });

  it('calls containers service when generating a sticker', () => {
    component.generateSticker();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(document.querySelectorAll('ngb-modal-window').length).toBe(1);
  });
});
