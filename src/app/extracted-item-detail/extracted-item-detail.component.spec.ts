import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractedItemDetailComponent } from './extracted-item-detail.component';

describe('ExtractedItemDetailComponent', () => {
  let component: ExtractedItemDetailComponent;
  let fixture: ComponentFixture<ExtractedItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractedItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractedItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
