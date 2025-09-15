import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '@models/game.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private seasonId : number = 1;
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  games$ = this.gamesSubject.asObservable();
  apiUrl = `${environment.apiUrl}/games`

  constructor(private http: HttpClient) {
    this.loadSeasonGames(this.seasonId);
  }

  loadSeasonGames(seasonId: number) : void {
    this.http.get<Game[]>(`${this.apiUrl}/season/${seasonId}`).pipe(
      tap(games => this.gamesSubject.next(games))
    ).subscribe(() => {
      console.log('Games Loaded')
    });
  }

  updateGame(updated: Game) {
    const current = this.gamesSubject.getValue();
    const idx = current.findIndex(g => g.gameId === updated.gameId);
    if (idx > -1) {
      current[idx] = { ...updated };
      this.gamesSubject.next([...current]);
    }
  }
}