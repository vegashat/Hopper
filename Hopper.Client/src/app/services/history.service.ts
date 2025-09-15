// src/app/services/history.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DraftPick,  } from '@models/draft.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = `${environment.apiUrl}/draft`;

  constructor(private http: HttpClient) {}

  getHistory(seasonId: number): Observable<DraftPick[]> {
    return this.http.get<DraftPick[]>(`${this.apiUrl}/${seasonId}/history`);
  }
}