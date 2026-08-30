import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '@models/game.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { SignalRService } from './signalr.service';
import { DraftStatus } from '@models/draft.model';
import { ToastService } from './toast.service';
import { Selection } from '@models/selection.model';
import { SeasonService } from './season.service';

interface SelectionMadeEvent {
  selections: Selection[];
  game: Game | null;
}

@Injectable({ providedIn: 'root' })
export class GamesService {
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  games$ = this.gamesSubject.asObservable();
  apiUrl = `${environment.apiUrl}/games`;

  constructor(
    private http: HttpClient,
    private signalR: SignalRService,
    private toastService: ToastService,
    private seasonService: SeasonService
  ) {
    this.loadSeasonGames(this.seasonService.currentSeasonId);
    this.signalR.connect(this.seasonService.currentSeasonId);

    // --- SignalR events ---
    this.signalR.on<SelectionMadeEvent>('SelectionMade', payload => {
      const updated = payload.game;
      if (updated) {
        this.updateGame(updated);

        if (updated.remainingTickets === 0) {
          this.toastService.warning(`🚨 ${updated.opponent.name} on ${new Date(updated.gameDateTime).toLocaleDateString()} is now SOLD OUT!`);
        }
      }
    });
    this.signalR.on<DraftStatus>('DraftStarted', status => {
      this.loadSeasonGames(status.seasonId);
    });
  }

  loadSeasonGames(seasonId: number): void {
    this.http
      .get<Game[]>(`${this.apiUrl}/season/${seasonId}`)
      .pipe(tap(games => this.gamesSubject.next(games)))
      .subscribe({ error: () => this.toastService.error('Unable to load games') });
  }

  updateGame(updated: Game) {
    const current = this.gamesSubject.getValue();
    const idx = current.findIndex(g => g.gameId == updated.gameId);
    if (idx > -1) {
      current[idx] = { ...updated };
      this.gamesSubject.next([...current]);
    }
  }
}
