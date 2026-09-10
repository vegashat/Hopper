import { StevenCounterComponent } from '../../components/steven-counter/steven-counter.component';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { DraftService } from '@services/draft.service';
import { DraftStatus, HistoryPick, UpcomingPick, UserProgress } from '@models/draft.model';

@Component({
  selector: 'app-draft-status',
  standalone: true,
  imports: [StevenCounterComponent,CommonModule, MatCardModule, MatTableModule, MatListModule, MatDividerModule],
  templateUrl: './draft-status.component.html',
  styleUrls: ['./draft-status.component.scss']
})
export class DraftStatusComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  status: DraftStatus | null = null;

  displayedColumns = ['displayName', 'allotment', 'picked', 'remaining'];

  constructor(private draftService: DraftService) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
      this.status = status;
    });
  }

  get upcoming(): UpcomingPick[] {
    return this.status?.upcoming ?? [];
  }

  get history(): HistoryPick[] {
    return this.status?.history ?? [];
  }

  get users(): UserProgress[] {
    return this.status?.users ?? [];
  }
}
