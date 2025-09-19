import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';

import { Game } from '@models/game.model';
import { FilterService, GameFilterState } from '@services/filter.service';
import { GamesService } from '@services/games.service';

// Import your game card
import { GameCardComponent } from '@components/game-card/game-card.component';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [
    CommonModule,
    GameCardComponent // 👈 add this so <app-game-card> is known
  ],
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit {
  private gamesSvc = inject(GamesService);
  private filterSvc = inject(FilterService);

  games: Game[] = [];
  filteredGames: Game[] = [];

  ngOnInit(): void {
    combineLatest([
      this.gamesSvc.games$,
      this.filterSvc.filterState$,
    ]).subscribe(([games, filterState]) => {
      this.games = games;
      this.applyFilters(filterState);
    });
  }

  private applyFilters(filterState: GameFilterState) {
    this.filteredGames = this.games.filter((game) => {
      const date = new Date(game.gameDateTime);

      const matchesSearch =
        !filterState.searchTerm ||
        game.opponent.name?.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
        game.opponent.city?.toLowerCase().includes(filterState.searchTerm.toLowerCase());

      const matchesAvailability =
        !filterState.showAvailableOnly || game.remainingTickets > 0;

      const matchesFilters =
        !filterState.filters ||
        (() => {
          const monthMatch =
            !filterState.filters?.months?.length ||
            filterState.filters.months.includes(date.getMonth() + 1);
          const dayMatch =
            !filterState.filters?.daysOfWeek?.length ||
            filterState.filters.daysOfWeek.includes(date.getDay());
          return monthMatch && dayMatch;
        })();

      return matchesSearch && matchesAvailability && matchesFilters;
    });
  }
}