import { TestBed } from '@angular/core/testing';

import { IdToScrollService } from './id-to-scroll.service';

describe('IdToScrollService', () => {
  let service: IdToScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdToScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
