import { Component, Input, Inject, Output, EventEmitter, Optional, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Game } from '@models/game.model';
import { Selection } from '@models/selection.model';
import { SelectionsService } from '@services/selections.service';
import { GamesService } from '@services/games.service';
import { DraftService } from '@services/draft.service';
import { DraftStatus } from '@models/draft.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
  @Input() game!: Game;
  @Output() gameUpdated = new EventEmitter<Game>();
  private draftService = inject(DraftService);

  private seasonId = 1;
  private testUsers = ['TestId', 'TestId2', 'TestId3', 'TestId4'];
  private draftStatus : DraftStatus | undefined;

  constructor(
    private selectionsService: SelectionsService,
    private snackBar: MatSnackBar,
    private gamesService: GamesService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { game: Game }
  ) {
      if (data?.game) {
        this.game = data.game;
      }
  }

  ngOnInit(): void {
    this.draftService.draftStatus$.subscribe(status => {
      if(status){
        this.draftStatus = status;
      }
    });
  }
  get draftIsActive() : boolean {
    if(this.draftStatus){
      return this.draftStatus.isActive;
    }
    return false;
  }

  pick(quantity: number) {
    if (!this.game) return;

    const randomUser =
      this.testUsers[Math.floor(Math.random() * this.testUsers.length)];

    const selection: Selection = {
      firebaseUserId: randomUser,
      gameId: this.game.gameId,
      displayName: randomUser,
      quantity,
      pickedUtc: new Date().toISOString(),
    };

    this.selectionsService.makeSelection(this.seasonId, selection).subscribe({
      next: () => {
        // ✅ Update local game object
        this.game.remainingTickets -= quantity;
        this.game.selections = [...(this.game.selections || []), selection];

        this.gamesService.updateGame(this.game);

        this.snackBar.open(
          `Picked ${quantity} tickets by ${randomUser}`,
          'Close',
          { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.open('Failed to make pick', 'Close', { duration: 2000 });
      },
    });
  }
}