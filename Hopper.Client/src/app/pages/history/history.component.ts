import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Subscription } from 'rxjs';

import { HistoryService } from '../../services/history.service';
import { DraftPick } from '@models/draft.model';
import { AuthService } from '@services/auth.service';
import { MatSlideToggle } from "@angular/material/slide-toggle";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatButtonToggleModule, MatSlideToggle],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  private historyService = inject(HistoryService);
  private auth = inject(AuthService);

  displayedColumns: string[] = ['order', 'user', 'team', 'date', 'quantity'];
  loading = true;

  // full list from the service
  allPicks: DraftPick[] = [];
  // what the table binds to (filtered)
  picks: DraftPick[] = [];

  // toggle state (persisted)
  showMineOnly = JSON.parse(localStorage.getItem('history_showMineOnly') ?? 'false');
  currentUserId: string | null = null;

  private subs: Subscription[] = [];

  ngOnInit(): void {
    // who am I?
    this.subs.push(
      this.auth.currentUser$.subscribe(u => {
        this.currentUserId = u?.firebaseUserId ?? null;
        this.applyFilter();
      })
    );

    // history stream
    this.subs.push(
      this.historyService.history$.subscribe({
        next: (data : DraftPick[]) => {
          this.allPicks = data ?? [];
          this.loading = false;
          this.applyFilter();
        },
        error: err => {
          console.error('Failed to load history', err);
          this.loading = false;
        }
      })
    );
  }

  onToggleMine(value: boolean) {
    this.showMineOnly = value;
    localStorage.setItem('history_showMineOnly', JSON.stringify(this.showMineOnly));
    this.applyFilter();
  }

  private applyFilter() {
    if (this.showMineOnly && this.currentUserId) {
      this.picks = this.allPicks.filter(p => p.firebaseUserId === this.currentUserId);
    } else {
      this.picks = this.allPicks;
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}