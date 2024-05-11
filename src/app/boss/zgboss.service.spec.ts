import { TestBed } from '@angular/core/testing';

import { ZgbossService } from './zgboss.service';

describe('ZgbossService', () => {
  let service: ZgbossService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZgbossService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
