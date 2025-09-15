import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../services/games.service';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { Game } from '@models/game.model';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [CommonModule, GameCardComponent],
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {
  games: Game[] = [];

  constructor(private gamesService: GamesService) {}

  ngOnInit() {
    // TODO: seasonId dynamic later
    this.gamesService.getSeasonGames(1).subscribe(g => this.games = g);
  }
}