import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Draft, DraftStatus } from '@models/draft.model';
import { SignalRService } from './signalr.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private apiUrl = `${environment.apiUrl}/Draft`;
  private draftStatusSubject = new BehaviorSubject<DraftStatus | null>(null);
  private season: number = 1;
  draftStatus$ = this.draftStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private signalR: SignalRService,
    private toastService: ToastService
  ) {
    this.loadStatus(this.season);
    this.signalR.connect(this.season);

    // --- SignalR events ---
    this.signalR.on<DraftStatus>('DraftStarted', status => {
      this.draftStatusSubject.next(status);
      this.toastService.info('✅ Draft has started!');
    });

    this.signalR.on<DraftStatus>('DraftReset', status => {
      this.draftStatusSubject.next(status);
      this.toastService.info('♻️ Draft has been reset'); 
    });

    this.signalR.on<DraftStatus>('StatusChanged', status => {
      this.draftStatusSubject.next(status);
    });

    this.signalR.on<any>('SelectionMade', payload => {
      const selection = payload.selection;
      const game = payload.game;
      const user = selection.displayName || selection.firebaseUserId;
      const opponent = game?.opponent.name || 'Unknown Opponent';
      const qty = selection.quantity || 1;
      this.toastService.info(`🎟️ ${user} picked ${qty} tickets for ${opponent}`)
       
    });
  }

  loadStatus(seasonId: number) {
    return this.http
      .get<DraftStatus>(`${this.apiUrl}/${seasonId}/status`)
      .pipe(tap(status => this.draftStatusSubject.next(status)))
      .subscribe(() => {
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