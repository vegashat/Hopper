import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { Game } from '@models/game.model';
import { GamesService } from '@services/games.service';
import { GameCardComponent } from '@components/game-card/game-card.component';
import { FilterDialogComponent } from '@components/filter-dialog/filter-dialog.component';
import { GameFilters } from '@models/game-filters.model';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    GameCardComponent,
    MatBadgeModule
  ],
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit {
  private gamesSvc = inject(GamesService);
  private dialog = inject(MatDialog);

  games: Game[] = [];
  filteredGames: Game[] = [];
  seasonId = 1;

  searchTerm = '';
  showAvailableOnly = false;
  filters: GameFilters | null = null;

  ngOnInit(): void {
    this.gamesSvc.games$.subscribe(games => {
      this.games = games;
      this.applyFilters();
    });
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '500px',
      data: { ...this.filters },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filters = result;
        this.applyFilters();
      }
    });
  }

  toggleAvailable(): void {
    this.showAvailableOnly = !this.showAvailableOnly;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredGames = this.games.filter(game => {
      const date = new Date(game.gameDateTime);

      // Search
      const matchesSearch =
        !this.searchTerm ||
        game.opponent.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        game.opponent.city?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Availability
      const matchesAvailability =
        !this.showAvailableOnly || game.remainingTickets > 0;

      // Month/day filters
      const matchesFilters = !this.filters || (() => {
        const monthMatch =
          !this.filters?.months?.length || this.filters.months.includes(date.getMonth() + 1);
        const dayMatch =
          !this.filters?.daysOfWeek?.length || this.filters.daysOfWeek.includes(date.getDay());
        return monthMatch && dayMatch;
      })();

      return matchesSearch && matchesAvailability && matchesFilters;
    });
  }
  filterCount(): number {
    let count = 0;
    if (this.filters?.months?.length) {
      count += this.filters.months.length;
    }
    if (this.filters?.daysOfWeek?.length) {
      count += this.filters.daysOfWeek.length;
    }
    return count;
  }
}