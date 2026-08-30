import { TestBed } from '@angular/core/testing';

import { SelectionsService } from './selections.service';
import { TEST_PROVIDERS } from '../testing/test-providers';

describe('SelectionsService', () => {
  let service: SelectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(SelectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
