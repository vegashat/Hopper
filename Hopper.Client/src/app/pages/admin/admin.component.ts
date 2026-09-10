import { StevenCounterComponent } from '../../components/steven-counter/steven-counter.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Participant } from '@models/participant.model';
import { ToastService } from '@services/toast.service';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DraftService } from '@services/draft.service';
import { DraftStatus } from '@models/draft.model';
import { GamesService } from '@services/games.service';
import { SeasonService } from '@services/season.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [StevenCounterComponent,
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private seasonService = inject(SeasonService);
  seasonId = this.seasonService.currentSeasonId;
  status: DraftStatus | undefined;
  draftService = inject(DraftService)
  gameService = inject(GamesService)
  private destroyRef = inject(DestroyRef);

  private http = inject(HttpClient);
  private toast = inject(ToastService);
  resettingUser: string | null = null;

  resetPin(participant: Participant): void {
    if (!window.confirm('Reset PIN for ' + participant.displayName + '? Their sessions will end and they must choose a new PIN at their next login.')) return;
    this.resettingUser = participant.firebaseUserId;
    this.http.post(`${environment.apiUrl}/participants/${encodeURIComponent(participant.firebaseUserId)}/reset-pin`, {})
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          participant.pinResetUsed = true;
          this.resettingUser = null;
          this.toast.success('PIN cleared. Participant can choose a new PIN at login.');
        },
        error: () => {
          this.resettingUser = null;
          this.toast.error('Unable to reset PIN.');
        }
      });
  }

  constructor() { }

  ngOnInit() : void {
    this.loadStatus();
    this.http.get<Participant[]>(`${environment.apiUrl}/participants`)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: participants => this.participants = participants,
        error: () => this.toast.error('Unable to load participants.')
      });
  }

  games = [
    { gameId: 1, opponent: 'Charlotte Hornets', gameDateTime: new Date(), arena: 'Paycom', remainingTickets: 2 },
    { gameId: 2, opponent: 'Denver Nuggets', gameDateTime: new Date(), arena: 'Paycom', remainingTickets: 4 },
  ];

  participants: Participant[] = [];

  displayedGameColumns = ['opponent', 'date', 'arena', 'tickets', 'actions'];
  displayedParticipantColumns = ['name', 'isAdmin', 'pinReset'];

  loadStatus(): void {
    this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
      this.status = status ?? undefined;
    });
  }

  startDraft(): void {
    this.draftService.startDraft(this.seasonId).subscribe({
      next: (draft) => {
        this.draftService.loadStatus(this.seasonId);
        this.gameService.loadSeasonGames(this.seasonId);
        console.log('Draft started:', draft)
      },
      error: (err) => console.error('Failed to start draft', err),
    });
  }

  resetDraft(): void {
    this.draftService.resetDraft(this.seasonId).subscribe({
      next: () => { 
        this.draftService.loadStatus(this.seasonId);
        this.gameService.loadSeasonGames(this.seasonId);
        console.log('Draft reset')
      },
      error: (err) => console.error('Failed to reset draft', err),
    });
  }

}
