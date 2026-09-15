import { HttpTestingController } from '@angular/common/http/testing';
import { SeasonService } from './season.service';
import { Game } from '@models/game.model';
import { TestBed } from '@angular/core/testing';

import { GamesService } from './games.service';
import { TEST_PROVIDERS } from '../testing/test-providers';

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(GamesService);
  });

  it('adds a saved game to the shared season list', () => {
    const http = TestBed.inject(HttpTestingController);
    const seasonId = TestBed.inject(SeasonService).currentSeasonId;
    http.expectOne(`${service.apiUrl}/season/${seasonId}`).flush([]);
    let games: Game[] = [];
    const subscription = service.games$.subscribe(value => games = value);
    const request = { seasonId, opponent: { teamId: 1, name: 'Opponent' },
      gameDateTime: '2026-10-01T00:00:00.000Z', arena: 'Paycom', remainingTickets: 4 };
    service.createGame(request).subscribe();
    const post = http.expectOne(service.apiUrl);
    expect(post.request.method).toBe('POST');
    expect(games.length).toBe(0);
    post.flush({ ...request, gameId: 42, selections: [] });
    expect(games.length).toBe(1);
    expect(games[0].gameId).toBe(42);
    subscription.unsubscribe();
    http.verify();
  });

  it('should be created' , () => {
    expect(service).toBeTruthy();
  });
});
