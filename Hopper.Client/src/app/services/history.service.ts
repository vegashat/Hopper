// src/app/services/history.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DraftPick, } from '@models/draft.model';
import { environment } from 'environments/environment';
import { SignalRService } from './signalr.service';
import { SeasonService } from './season.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = `${environment.apiUrl}/draft`;
  private historySubject = new BehaviorSubject<DraftPick[]>([]);
  history$ = this.historySubject.asObservable();

  constructor(private http: HttpClient,
    private signalR: SignalRService,
    private seasonService: SeasonService
  ) {
    this.getHistory(this.seasonService.currentSeasonId);
    this.signalR.on<unknown>('SelectionMade', () => {
      this.getHistory(this.seasonService.currentSeasonId);
    });
  }

  getHistory(seasonId: number): void {
    this.http.get<DraftPick[]>(`${this.apiUrl}/${seasonId}/history`)
      .pipe(tap(history => {
        history = history.sort((a, b) => new Date(b.claimedUtc).getTime() - new Date(a.claimedUtc).getTime());
        return this.historySubject.next(history);
      }))
      .subscribe();
  }
}
