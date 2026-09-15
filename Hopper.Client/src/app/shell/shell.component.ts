import { version } from '../../../package.json';
import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Your own components
import { HeaderComponent } from '../components/header/header.component';
import { FilterDialogComponent } from '@components/filter-dialog/filter-dialog.component';
import { RankingSuggestionDialogComponent } from '@components/ranking-suggestion-dialog/ranking-suggestion-dialog.component';

// Services & models
import { FilterService } from '@services/filter.service';
import { GameFilters } from '@models/game-filters.model';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { DraftService } from '@services/draft.service';
import { GameRankingsService } from '@services/game-rankings.service';
import { GamesService } from '@services/games.service';
import { SelectionsService } from '@services/selections.service';
import { SeasonService } from '@services/season.service';
import { Participant } from '@models/participant.model';
import { Selection } from '@models/selection.model';

import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { DraftStatus } from '@models/draft.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-shell',
  standalone: true,
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    // Angular Material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDialogModule,
    // App Components
    HeaderComponent,
  ]
})
export class ShellComponent implements OnInit, OnDestroy {
  readonly appVersion = version;
  private filterSvc = inject(FilterService);
  private dialog = inject(MatDialog);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private draftService = inject(DraftService);
  private rankingsService = inject(GameRankingsService);
  private gamesService = inject(GamesService);
  private selectionsService = inject(SelectionsService);
  private seasonService = inject(SeasonService);

  searchTerm = '';
  searchOpen = false;
  showAvailableOnly = false;
  filters: GameFilters | null = null;
  isCompact = false;

  isUserTurn = false;
  currentUser: Participant | null = null;
  private subs: Subscription[] = [];
  private promptedDraftPickId: number | null = null;
  private checkingDraftPickId: number | null = null;

  constructor() {
    this.updateCompactMode();
  }

  ngOnInit() {
    // Track logged-in user
    this.subs.push(
      this.auth.currentUser$.subscribe(user => {
        if (!this.currentUser && user) {
          this.searchTerm = '';
          this.filterSvc.setSearchTerm('');
        }
        this.currentUser = user;
      })
    );

    this.subs.push(
      combineLatest([this.auth.currentUser$, this.draftService.draftStatus$]).subscribe(([user, status]) => {
        const nextPick = status?.upcoming?.[0];
        this.debugRanking('Turn check', {
          loggedInUserId: user?.firebaseUserId ?? null,
          nextPickerId: nextPick?.firebaseUserId ?? null,
          draftPickId: nextPick?.draftPickId ?? null,
          isDraftActive: status?.isActive ?? false
        });
        if (!nextPick || user?.firebaseUserId !== nextPick.firebaseUserId) return;
        this.fireUserTurnAlert(nextPick.displayName ?? 'It');
        this.offerRankedGame(status!);
      })
    );
  }

  private offerRankedGame(status: DraftStatus): void {
    const nextPick = status.upcoming[0];
    const user = this.currentUser;
    if (!nextPick || !user || this.promptedDraftPickId === nextPick.draftPickId ||
        this.checkingDraftPickId === nextPick.draftPickId) return;
    this.checkingDraftPickId = nextPick.draftPickId;

    const remaining = status.users.find(item => item.firebaseUserId === user.firebaseUserId)?.remaining ?? 0;
    forkJoin({
      rankings: this.rankingsService.get(status.seasonId),
      games: this.gamesService.getSeasonGames(status.seasonId)
    }).subscribe({
      next: ({ rankings, games }) => {
        this.checkingDraftPickId = null;
        const gameById = new Map(games.map(game => [game.gameId, game]));
        const ranking = rankings
          .filter(item => !item.isFulfilled && item.quantity <= remaining)
          .sort((a, b) => a.rankOrder - b.rankOrder)
          .find(item => (gameById.get(item.gameId)?.remainingTickets ?? 0) >= item.quantity);
        this.debugRanking('Suggestion candidates loaded', {
          draftPickId: nextPick.draftPickId,
          remainingAllotment: remaining,
          rankings: rankings.map(item => ({
            gameId: item.gameId,
            rankOrder: item.rankOrder,
            quantity: item.quantity,
            isFulfilled: item.isFulfilled,
            gameTicketsRemaining: gameById.get(item.gameId)?.remainingTickets ?? null
          })),
          selectedRankingId: ranking?.gameRankingId ?? null
        });
        this.promptedDraftPickId = nextPick.draftPickId;
        if (!ranking) {
          this.toast.warning('It is your turn, but none of your ranked choices are currently available. Please choose manually.');
          return;
        }

        const game = gameById.get(ranking.gameId)!;
        const dialogRef = this.dialog.open(RankingSuggestionDialogComponent, {
          width: '420px',
          maxWidth: '95vw',
          disableClose: true,
          data: { game, ranking }
        });
        dialogRef.afterClosed().subscribe(confirmed => {
          if (!confirmed) return;
          const selection: Selection = {
            draftPickId: nextPick.draftPickId,
            firebaseUserId: nextPick.firebaseUserId,
            displayName: nextPick.displayName,
            gameId: ranking.gameId,
            quantity: ranking.quantity,
            pickedUtc: new Date().toISOString()
          };
          this.selectionsService.makeSelection(status.seasonId, [selection], ranking.gameRankingId).subscribe({
            next: () => this.draftService.loadStatus(this.seasonService.currentSeasonId),
            error: () => this.toast.error('That ranked game is no longer available. Please choose another game.')
          });
        });
      },
      error: error => {
        this.checkingDraftPickId = null;
        this.debugRanking('Suggestion request failed', error);
        this.toast.error('Unable to check your ranked games');
      }
    });
  }

  private debugRanking(message: string, details: unknown): void {
    if (!environment.production) console.debug(`[Ranking suggestion] ${message}`, details);
  }

  private fireUserTurnAlert(name: string) {
    this.isUserTurn = true;
    this.toast.show(`${name}, it is your pick!`);
    setTimeout(() => (this.isUserTurn = false), 8000);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    if (!this.searchOpen) {
      this.searchTerm = '';
      this.filterSvc.setSearchTerm('');
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filterSvc.setSearchTerm(term);
  }

  openFilterDialog(): void {
    this.dialog.open(FilterDialogComponent, {
      width: '400px',
      data: {
        filters: this.filters,
        showAvailableOnly: false
      }
    });
  }

  filterCount(): number {
    let count = 0;
    if (this.filters?.months?.length) count += this.filters.months.length;
    if (this.filters?.daysOfWeek?.length) count += this.filters.daysOfWeek.length;
    return count;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCompactMode();
  }

  private updateCompactMode() {
    this.isCompact = window.innerWidth < 600;
  }
}
