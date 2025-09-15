// src/app/services/history.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryPick } from '@models/draft.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = 'http://localhost:5154/api/Draft';

  constructor(private http: HttpClient) {}

  getHistory(seasonId: number): Observable<HistoryPick[]> {
    return this.http.get<HistoryPick[]>(`${this.apiUrl}/${seasonId}/history`);
  }
}