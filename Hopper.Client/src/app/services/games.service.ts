import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '@models/game.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { SignalRService } from './signalr.service';
import { DraftStatus } from '@models/draft.model';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private seasonId: number = 1;
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  games$ = this.gamesSubject.asObservable();
  apiUrl = `${environment.apiUrl}/games`;

  constructor(
    private http: HttpClient,
    private signalR: SignalRService,
    private toastService: ToastService
  ) {
    this.loadSeasonGames(this.seasonId);
    this.signalR.connect(this.seasonId);

    // --- SignalR events ---
    this.signalR.on<any>('SelectionMade', payload => {
      const updated: Game = payload.game;
      if (updated) {
        this.updateGame(updated);

        if (updated.remainingTickets === 0) {
          this.toastService.warning(`🚨 ${updated.opponent.name} on ${updated.gameDateTime} is now SOLD OUT!`);
        }
      }
    });
    this.signalR.on<DraftStatus>('DraftStarted', status => {
      this.loadSeasonGames(status.seasonId);
      this.toastService.info('✅ Draft has started!');
    });
  }

  loadSeasonGames(seasonId: number): void {
    this.http
      .get<Game[]>(`${this.apiUrl}/season/${seasonId}`)
      .pipe(tap(games => this.gamesSubject.next(games)))
      .subscribe(() => {
        console.log('Games Loaded');
      });
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