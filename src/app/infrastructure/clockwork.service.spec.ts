import { TestBed, inject } from '@angular/core/testing';

import { ClockworkService } from './clockwork.service';

describe('ClockworkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClockworkService]
    });
  });

  it('should be created', inject([ClockworkService], (service: ClockworkService) => {
    expect(service).toBeTruthy();
  }));
});
