import { Component, OnInit } from '@angular/core';
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
  imports: [CommonModule, MatCardModule, MatTableModule, MatListModule, MatDividerModule],
  templateUrl: './draft-status.component.html',
  styleUrls: ['./draft-status.component.scss']
})
export class DraftStatusComponent implements OnInit {
  seasonId = 1; // TODO: wire up properly
  status: DraftStatus | null = null;

  displayedColumns = ['displayName', 'allotment', 'picked', 'remaining'];

  constructor(private draftService: DraftService) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.draftService.getDraftStatus(this.seasonId).subscribe({
      next: (status) => this.status = status,
      error: (err) => console.error('Failed to load draft status', err)
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