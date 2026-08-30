import { TestBed } from '@angular/core/testing';

import { HistoryService } from './history.service';
import { TEST_PROVIDERS } from '../testing/test-providers';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(HistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
