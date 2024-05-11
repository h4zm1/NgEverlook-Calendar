import { TestBed } from '@angular/core/testing';

import { ServertimeService } from './servertime.service';

describe('ServertimeService', () => {
  let service: ServertimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServertimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
