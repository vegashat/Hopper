import { TestBed } from '@angular/core/testing';

import { GamesService } from './games.service';
import { TEST_PROVIDERS } from '../testing/test-providers';

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(GamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
