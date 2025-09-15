import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Draft, DraftStatus } from '@models/draft.model';

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private apiUrl = `${environment.apiUrl}/Draft`;
  private draftStatusSubject = new BehaviorSubject<DraftStatus | null>(null);
  private season: number = 1;
  draftStatus$ = this.draftStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStatus(this.season);
  }

  loadStatus(seasonId: number) {
    return this.http.get<DraftStatus>(`${this.apiUrl}/${seasonId}/status`).pipe(
      tap(status => this.draftStatusSubject.next(status))
    ).subscribe(() => {
      console.log('draft status loaded');
    });
  }

  startDraft(seasonId: number): Observable<Draft> {
    return this.http.post<Draft>(`${this.apiUrl}/start/${seasonId}`, {});
  }

  resetDraft(seasonId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset/${seasonId}`, {});
  }
}