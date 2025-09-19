// src/app/services/history.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DraftPick, } from '@models/draft.model';
import { environment } from 'environments/environment';
import { SignalRService } from './signalr.service';
import { Game } from '@models/game.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = `${environment.apiUrl}/draft`;
  private seasonId: number = 1;
  private historySubject = new BehaviorSubject<DraftPick[]>([]);
  history$ = this.historySubject.asObservable();

  constructor(private http: HttpClient,
    private signalR: SignalRService
  ) {
    this.getHistory(this.seasonId);
    this.signalR.on<any>('SelectionMade', payload => {
      this.getHistory(this.seasonId);
    });
  }

  getHistory(seasonId: number): void {
    this.http.get<DraftPick[]>(`${this.apiUrl}/${seasonId}/history`)
      .pipe(tap(history => {
        history = history.sort((a, b) => new Date(b.claimedUtc).getTime() - new Date(a.claimedUtc).getTime());
        return this.historySubject.next(history);
      }))
      .subscribe(() => {
        console.log('History Loaded');
      });
  }
}