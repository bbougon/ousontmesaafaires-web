import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractedItemsComponent } from './extracted-items.component';

describe('ExtractedItemsComponent', () => {
  let component: ExtractedItemsComponent;
  let fixture: ComponentFixture<ExtractedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
