import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractedItemComponent } from './extracted-item.component';

describe('ExtractedItemComponent', () => {
  let component: ExtractedItemComponent;
  let fixture: ComponentFixture<ExtractedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
