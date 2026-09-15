import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Draft, DraftStatus } from '@models/draft.model';
import { Selection } from '@models/selection.model';
import { Game } from '@models/game.model';
import { SeasonService } from './season.service';

interface SelectionMadeEvent {
  selections: Selection[];
  game: Game | null;
}
import { SignalRService } from './signalr.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private apiUrl = `${environment.apiUrl}/Draft`;
  private draftStatusSubject = new BehaviorSubject<DraftStatus | null>(null);
  draftStatus$ = this.draftStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private signalR: SignalRService,
    private toastService: ToastService,
    private seasonService: SeasonService
  ) {
    this.loadStatus(this.seasonService.currentSeasonId);
    this.signalR.connect(this.seasonService.currentSeasonId);

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

    this.signalR.on<SelectionMadeEvent>('SelectionMade', payload => {
      const selection = payload.selections[0];
      const game = payload.game;
      if (!selection) return;
      const user = selection.displayName || selection.firebaseUserId;
      const opponent = game?.opponent.name ?? 'Unknown Opponent';
      const qty = payload.selections.reduce((total, item) => total + item.quantity, 0);
      this.toastService.info(`🎟️ ${user} picked ${qty} tickets for ${opponent}`)
       
    });
  }

  loadStatus(seasonId: number) {
    return this.http
      .get<DraftStatus>(`${this.apiUrl}/${seasonId}/status`)
      .pipe(tap(status => this.draftStatusSubject.next(status)))
      .subscribe({ error: () => this.toastService.error('Unable to load draft status') });
  }

  updateAllotment(seasonId: number, userId: string, allotment: number): Observable<DraftStatus> {
    return this.http.put<DraftStatus>(`${this.apiUrl}/${seasonId}/allotments/${encodeURIComponent(userId)}`, { allotment })
      .pipe(tap(status => this.draftStatusSubject.next(status)));
  }

  startDraft(seasonId: number): Observable<Draft> {
    return this.http.post<Draft>(`${this.apiUrl}/start/${seasonId}`, {});
  }

  resetDraft(seasonId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset/${seasonId}`, {});
  }
}
