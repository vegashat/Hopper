import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RankingQuantityDialogComponent } from '../../components/ranking-quantity-dialog/ranking-quantity-dialog.component';
import { Game } from '@models/game.model';
import { GameRankingsService } from '@services/game-rankings.service';
import { GamesService } from '@services/games.service';
import { SeasonService } from '@services/season.service';
import { DraftService } from '@services/draft.service';
import { ToastService } from '@services/toast.service';
import { forkJoin } from 'rxjs';

interface RankedGame {
  game: Game;
  quantity: 2 | 4;
}

@Component({
  selector: 'app-game-rankings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './game-rankings.component.html',
  styleUrls: ['./game-rankings.component.scss']
})
export class GameRankingsComponent implements OnInit {
  private rankingsService = inject(GameRankingsService);
  private gamesService = inject(GamesService);
  private seasonService = inject(SeasonService);
  private draftService = inject(DraftService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  rankedGames: RankedGame[] = [];
  availableGames: Game[] = [];
  isDraftActive = false;
  loading = true;
  saving = false;
  readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  selectedWeekday: string | null = null;
  private readonly weekdayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'America/Chicago'
  });

  get filteredAvailableGames(): Game[] {
    if (this.selectedWeekday === null) return this.availableGames;
    return this.availableGames.filter(game =>
      this.weekdayFormatter.format(new Date(game.gameDateTime)) === this.selectedWeekday
    );
  }

  ngOnInit(): void {
    const seasonId = this.seasonService.currentSeasonId;
    forkJoin({
      rankings: this.rankingsService.get(seasonId),
      games: this.gamesService.getSeasonGames(seasonId)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ rankings, games }) => {
        const gamesById = new Map(games.map(game => [game.gameId, game]));
        this.rankedGames = rankings
          .filter(ranking => !ranking.isFulfilled && gamesById.has(ranking.gameId))
          .map(ranking => ({ game: gamesById.get(ranking.gameId)!, quantity: ranking.quantity }));
        this.availableGames = games.filter(
          game => !this.rankedGames.some(ranking => ranking.game.gameId === game.gameId)
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Unable to load game rankings');
      }
    });

    this.draftService.draftStatus$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => this.isDraftActive = status?.isActive ?? false);
  }

  add(game: Game): void {
    if (this.isDraftActive) return;
    this.dialog.open<RankingQuantityDialogComponent, Game, 2 | 4>(RankingQuantityDialogComponent, {
      data: game,
      width: '360px'
    }).afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(quantity => {
      if ((quantity !== 2 && quantity !== 4) || this.isDraftActive ||
          !this.availableGames.some(item => item.gameId === game.gameId)) return;
      this.availableGames = this.availableGames.filter(item => item.gameId !== game.gameId);
      this.rankedGames.push({ game, quantity });
      this.save();
    });
  }

  remove(index: number): void {
    if (this.isDraftActive) return;
    const [removed] = this.rankedGames.splice(index, 1);
    this.availableGames = [...this.availableGames, removed.game]
      .sort((a, b) => new Date(a.gameDateTime).getTime() - new Date(b.gameDateTime).getTime());
  }

  drop(event: CdkDragDrop<RankedGame[]>): void {
    if (!this.isDraftActive) moveItemInArray(this.rankedGames, event.previousIndex, event.currentIndex);
  }

  save(): void {
    if (this.isDraftActive || this.saving) return;
    this.saving = true;
    this.rankingsService.replace(
      this.seasonService.currentSeasonId,
      this.rankedGames.map(item => ({ gameId: item.game.gameId, quantity: item.quantity }))
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving = false;
        this.toast.success('Game rankings saved');
      },
      error: () => {
        this.saving = false;
        this.toast.error('Unable to save game rankings');
      }
    });
  }
}
