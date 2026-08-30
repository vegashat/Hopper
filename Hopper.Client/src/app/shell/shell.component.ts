import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
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
import { FilterDialogComponent } from '@components/filter-dialog/filter-dialog.component';

// Services & models
import { FilterService } from '@services/filter.service';
import { GameFilters } from '@models/game-filters.model';
import { AuthService } from '@services/auth.service';
import { SignalRService } from '@services/signalr.service';
import { ToastService } from '@services/toast.service';
import { Participant } from '@models/participant.model';

import { Subscription } from 'rxjs';
import { DraftStatus } from '@models/draft.model';

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
export class ShellComponent implements OnInit, OnDestroy {
  private filterSvc = inject(FilterService);
  private dialog = inject(MatDialog);
  private auth = inject(AuthService);
  private signalR = inject(SignalRService);
  private toast = inject(ToastService);

  searchTerm = '';
  searchOpen = false;
  showAvailableOnly = false;
  filters: GameFilters | null = null;
  isCompact = false;

  isUserTurn = false;
  currentUser: Participant | null = null;
  private subs: Subscription[] = [];

  constructor() {
    this.updateCompactMode();
  }

  ngOnInit() {
    // Track logged-in user
    this.subs.push(
      this.auth.currentUser$.subscribe(u => this.currentUser = u)
    );

    // Listen for draft events
    this.signalR.on<any>('StatusChanged', (status: DraftStatus) => {
      const nextPick = status?.upcoming?.[0];
      if (nextPick && this.currentUser?.firebaseUserId === nextPick.firebaseUserId) {
        this.fireUserTurnAlert(nextPick.displayName);
      }
    });
  }

  private fireUserTurnAlert(name: string) {
    this.isUserTurn = true;
    this.toast.show(`${name}, it is your pick!`);
    setTimeout(() => (this.isUserTurn = false), 8000);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

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

  openFilterDialog(): void {
    this.dialog.open(FilterDialogComponent, {
      width: '400px',
      data: {
        filters: this.filters,
        showAvailableOnly: false
      }
    });
  }

  filterCount(): number {
    let count = 0;
    if (this.filters?.months?.length) count += this.filters.months.length;
    if (this.filters?.daysOfWeek?.length) count += this.filters.daysOfWeek.length;
    return count;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCompactMode();
  }

  private updateCompactMode() {
    this.isCompact = window.innerWidth < 600;
  }
}
