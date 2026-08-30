import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';

import { DraftService } from '@services/draft.service';
import { DraftStatus } from '@models/draft.model';
import { LoginDialogComponent } from '@components/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { FilterService } from '@services/filter.service';
import { FilterDialogComponent } from '@components/filter-dialog/filter-dialog.component';
import { SeasonService } from '@services/season.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;
  @Output() menuToggle = new EventEmitter<void>();
  dialog = inject(MatDialog)
  authService = inject(AuthService);
  seasonId = inject(SeasonService).currentSeasonId;
  status: DraftStatus | null = null;
  private filterSvc = inject(FilterService);
  private destroyRef = inject(DestroyRef);



  constructor(private draftService: DraftService) { }

  ngOnInit(): void {
    this.loadStatus();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  loadStatus(): void {

    this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
      this.status = status;
    });
  }

  get currentPick(): string {
    // The "current" pick should be the first in upcoming
    return this.status?.upcoming?.[0]?.displayName ?? 'N/A';
  }

  get nextPick(): string {
    // The "next" pick is the second in upcoming
    return this.status?.upcoming?.[1]?.displayName ?? 'N/A';
  }

  get lastPick(): string {

    const lastPick = this.status?.history.filter(h => h.claimedUtc)
                    .sort((a, b) => new Date(b.claimedUtc!).getTime() - new Date(a.claimedUtc!).getTime())[0];
    const name = this.status?.users.find(u => u.firebaseUserId == lastPick?.firebaseUserId)?.displayName ?? 'N/A';
    return name;
    // return `${name} picked ${lastPick?.quantity} tix to ${lastPick?.team.name}`;
  }

  openLogin() : void {
    this.dialog.open(LoginDialogComponent, {width: '400px'});
  }

  logout() : void {
    this.authService.logout();
  }

  openFilterDialog(): void {
    const currentState = this.filterSvc.currentState; // grab snapshot
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '400px',
      data: { filters: currentState.filters }
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result) {
        this.filterSvc.setFilters(result);
      }
    });
  }
}
