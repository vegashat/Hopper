import { TestBed } from '@angular/core/testing';
import { GameRankingsService } from './game-rankings.service';
import { TEST_PROVIDERS } from '../testing/test-providers';

describe('GameRankingsService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    expect(TestBed.inject(GameRankingsService)).toBeTruthy();
  });
});
