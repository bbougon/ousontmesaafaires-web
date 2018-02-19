import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageComponent } from './error-message.component';
import {MessageService} from '../infrastructure/message.service';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorMessageComponent ],
      providers: [MessageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the messages contained in the message service', () => {
    const compiled = fixture.debugElement.nativeElement;

    component.messageService.add('A message');
    component.messageService.add('A second message');
    fixture.detectChanges();

    const messages = compiled.querySelectorAll('li');
    expect(messages[0].textContent).toContain('A message');
    expect(messages[1].textContent).toContain('A second message');
    expect(compiled.querySelector('h2').textContent).toContain('Error messages:');
  });

  it('should not display the messages if message service is empty', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('h2')).toBeNull();
  });
});
