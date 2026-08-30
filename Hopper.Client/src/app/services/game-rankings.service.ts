import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameRanking, SaveGameRanking } from '@models/game-ranking.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class GameRankingsService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  get(seasonId: number): Observable<GameRanking[]> {
    return this.http.get<GameRanking[]>(
      `${environment.apiUrl}/seasons/${seasonId}/game-rankings`,
      { params: { firebaseUserId: this.currentUserId } }
    );
  }

  replace(seasonId: number, rankings: SaveGameRanking[]): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/seasons/${seasonId}/game-rankings`,
      rankings,
      { params: { firebaseUserId: this.currentUserId } }
    );
  }

  private get currentUserId(): string {
    const userId = this.auth.currentUser?.firebaseUserId;
    if (!userId) throw new Error('A logged-in participant is required for rankings.');
    return userId;
  }
}
