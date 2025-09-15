import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Draft, DraftStatus } from '@models/draft.model';

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private baseUrl = `${environment.apiUrl}/Draft`;

  constructor(private http: HttpClient) {}

  getDraftStatus(seasonId: number): Observable<DraftStatus> {
    return this.http.get<DraftStatus>(`${this.baseUrl}/${seasonId}/status`);
  }

  startDraft(seasonId: number): Observable<Draft> {
    return this.http.post<Draft>(`${this.baseUrl}/start/${seasonId}`, {});
  }

  resetDraft(seasonId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset/${seasonId}`, {});
  }
}