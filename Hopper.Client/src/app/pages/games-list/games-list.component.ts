import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Game } from '@models/game.model';
import { GamesService } from '@services/games.service';
import { GameCardComponent } from '@components/game-card/game-card.component';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, GameCardComponent],
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit {
  private gamesSvc = inject(GamesService);
  private snackBar = inject(MatSnackBar);

  games: Game[] = [];
  seasonId = 1;

  ngOnInit(): void {
    // Subscribe to shared state
    this.gamesSvc.games$.subscribe(games => {
      this.games = games;
    });
  }
}