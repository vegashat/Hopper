import { Component, inject } from '@angular/core';
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

// Services & models
import { FilterService } from '@services/filter.service';
import { GameFilters } from '@models/game-filters.model';
import { FilterDialogComponent } from '@components/filter-dialog/filter-dialog.component';

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
export class ShellComponent {
  private filterSvc = inject(FilterService);
  private dialog = inject(MatDialog);

  searchTerm = '';
  searchOpen = false;
  showAvailableOnly = false;
  filters: GameFilters | null = null;

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

  toggleAvailable(): void {
    this.showAvailableOnly = !this.showAvailableOnly;
    this.filterSvc.toggleAvailable();
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '400px',
      data: { filters: this.filters }
    });

    dialogRef.afterClosed().subscribe((result: GameFilters | null) => {
      if (result) {
        this.filters = result;
        this.filterSvc.setFilters(result);
      }
    });
  }

  filterCount(): number {
    let count = 0;
    if (this.filters?.months?.length) count += this.filters.months.length;
    if (this.filters?.daysOfWeek?.length) count += this.filters.daysOfWeek.length;
    return count;
  }
}