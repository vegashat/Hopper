// src/app/services/selections.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Selection } from '@models/selection.model';

@Injectable({
  providedIn: 'root',
})
export class SelectionsService {
  private baseUrl = `${environment.apiUrl}/Selections`;

  constructor(private http: HttpClient) {}

  makeSelection(seasonId: number, selections: Selection[], fulfilledRankingId?: number): Observable<Selection[]> {
    const options = fulfilledRankingId
      ? { params: { fulfilledRankingId } }
      : {};
    return this.http.post<Selection[]>(`${this.baseUrl}/${seasonId}`, selections, options);
  }

  deleteSelection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getSelectionsByUser(firebaseUserId: string): Observable<Selection[]> {
    return this.http.get<Selection[]>(`${this.baseUrl}/user/${firebaseUserId}`);
  }

  getSelectionsByGame(gameId: number): Observable<Selection[]> {
    return this.http.get<Selection[]>(`${this.baseUrl}/game/${gameId}`);
  }
}
