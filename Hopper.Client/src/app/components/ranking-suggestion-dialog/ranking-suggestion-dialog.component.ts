import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Game } from '@models/game.model';
import { GameRanking } from '@models/game-ranking.model';

export interface RankingSuggestionData {
  game: Game;
  ranking: GameRanking;
}

@Component({
  selector: 'app-ranking-suggestion-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './ranking-suggestion-dialog.component.html',
  styleUrls: ['./ranking-suggestion-dialog.component.scss']
})
export class RankingSuggestionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: RankingSuggestionData) {}
}
