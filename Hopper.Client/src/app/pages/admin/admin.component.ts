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
  imports: [
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

  constructor() { }

  ngOnInit() : void {
    this.loadStatus();
  }

  games = [
    { gameId: 1, opponent: 'Charlotte Hornets', gameDateTime: new Date(), arena: 'Paycom', remainingTickets: 2 },
    { gameId: 2, opponent: 'Denver Nuggets', gameDateTime: new Date(), arena: 'Paycom', remainingTickets: 4 },
  ];

  participants = [
    { firebaseUserId: 'abc', displayName: 'Jeaux Test', email: 'jeaux@test.com', isAdmin: true },
    { firebaseUserId: 'xyz', displayName: 'Kartik Test', email: 'kartik@test.com', isAdmin: false },
  ];

  displayedGameColumns = ['opponent', 'date', 'arena', 'tickets', 'actions'];
  displayedParticipantColumns = ['name', 'email', 'isAdmin'];

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
