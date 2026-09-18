import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AllotmentEditorComponent } from '../../components/allotment-editor/allotment-editor.component';
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
import { Game, Team } from '@models/game.model';
import { GamesService } from '@services/games.service';
import { SeasonService } from '@services/season.service';
import { GameRankingsService } from '@services/game-rankings.service';
import { GameRanking } from '@models/game-ranking.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AllotmentEditorComponent, StevenCounterComponent,
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
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
  private rankingsService = inject(GameRankingsService);
  private destroyRef = inject(DestroyRef);

  private http = inject(HttpClient);
  private toast = inject(ToastService);
  resettingUser: string | null = null;

  addingGame = false;
  savingGame = false;
  teams: Team[] = [];
  opponent: Team | null = null;
  gameDateTime = '';
  arena = '';
  gameError = '';

  openAddGame(): void {
    this.addingGame = true;
    this.gameError = '';
    this.gameService.getTeams().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: teams => this.teams = teams,
      error: () => this.gameError = 'Unable to load opponents. Close the form and try again.'
    });
  }

  addGame(): void {
    if (this.savingGame || !this.opponent || !this.gameDateTime) return;
    const date = new Date(this.gameDateTime);
    if (!Number.isFinite(date.getTime())) {
      this.gameError = 'Enter a valid game date and time.';
      return;
    }
    this.savingGame = true;
    this.gameError = '';
    this.gameService.createGame({
      seasonId: this.seasonId, opponent: this.opponent,
      gameDateTime: date.toISOString(), arena: this.arena.trim(), remainingTickets: 4
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.savingGame = false;
        this.addingGame = false;
        this.opponent = null;
        this.gameDateTime = '';
        this.arena = '';
        this.toast.success('Game added.');
      },
      error: err => {
        this.savingGame = false;
        this.gameError = err.error?.message || 'Unable to add game. Please try again.';
      }
    });
  }

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
    this.gameService.games$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(games => {
      this.games = games;
    });
    this.http.get<Participant[]>(`${environment.apiUrl}/participants`)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: participants => this.participants = participants,
        error: () => this.toast.error('Unable to load participants.')
      });
  }

  games: Game[] = [];

  participants: Participant[] = [];
  selectedRankingUserId = '';
  selectedUserRankings: GameRanking[] = [];
  loadingUserRankings = false;

  displayedGameColumns = ['opponent', 'date', 'arena', 'tickets', 'actions'];
  displayedParticipantColumns = ['name', 'isAdmin', 'pinReset'];

  loadUserRankings(firebaseUserId: string): void {
    this.selectedRankingUserId = firebaseUserId;
    this.selectedUserRankings = [];
    if (!firebaseUserId) return;
    this.loadingUserRankings = true;
    this.rankingsService.getForUser(this.seasonId, firebaseUserId)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: rankings => {
          this.selectedUserRankings = rankings.sort((a, b) => a.rankOrder - b.rankOrder);
          this.loadingUserRankings = false;
        },
        error: () => {
          this.loadingUserRankings = false;
          this.toast.error('Unable to load this participant’s rankings.');
        }
      });
  }

  gameForRanking(ranking: GameRanking): Game | undefined {
    return this.games.find(game => game.gameId === ranking.gameId);
  }

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
