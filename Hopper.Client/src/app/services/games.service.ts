import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Game } from '@models/game.model';


@Injectable({ providedIn: 'root' })
export class GamesService {
  private baseUrl = `${environment.apiUrl}/Games`;

  constructor(private http: HttpClient) {}

  getSeasonGames(seasonId: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.baseUrl}/season/${seasonId}`);
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.baseUrl}/${id}`);
  }
}