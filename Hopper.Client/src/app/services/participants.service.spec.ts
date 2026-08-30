import { TestBed } from '@angular/core/testing';

import { ParticipantsService } from './participants.service';
import { TEST_PROVIDERS } from '../testing/test-providers';

describe('ParticipantsService', () => {
  let service: ParticipantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(ParticipantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
