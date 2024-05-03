import { TestBed } from '@angular/core/testing';

import { AllowedChannelsService } from './allowed-channels.service';

describe('AllowedChannelsService', () => {
  let service: AllowedChannelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllowedChannelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
