import {OcticonDirective} from './octicon.directive';
import {Component, DebugElement, ElementRef, Renderer2} from '@angular/core';
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

@Component({
  template: `<span octicon="arrow-down"></span>`
})
class TestOcticonComponent {
}

class FakeElementRef extends ElementRef {

  constructor() {
    super('span');
  }
}

describe('OcticonDirective', () => {

  let component: TestOcticonComponent;
  let fixture: ComponentFixture<TestOcticonComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestOcticonComponent, OcticonDirective],
      providers: [{provide: ElementRef, useClass: FakeElementRef}, Renderer2]
    });
    fixture = TestBed.createComponent(TestOcticonComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should create an instance', inject([ElementRef, Renderer2], (elementRef: ElementRef, renderer: Renderer2) => {
    const directive = new OcticonDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  }));
});
