import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Game } from '@models/game.model';
import { SelectionsService } from '@services/selections.service';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent {
  @Input() game!: Game;
  private seasonId = 1;
  private testUsers = ['TestId', 'TestId2', 'TestId3', 'TestId4'];

  constructor(
    private selectionsService: SelectionsService,
    private snackBar: MatSnackBar
  ) {}

  pick(quantity: number) {
    const randomUser =
      this.testUsers[Math.floor(Math.random() * this.testUsers.length)];

    const selection = {
      firebaseUserId: randomUser,
      gameId: this.game.gameId,
      quantity,
    };

    this.selectionsService.makeSelection(this.seasonId, selection).subscribe({
      next: () => {
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