import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { DraftService } from '@services/draft.service';
import { DraftPick, DraftStatus, UpcomingPick, UserProgress } from '@models/draft.model';

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
    this.draftService.draftStatus$.subscribe(status => {
      this.status = status;
    });
  }

  get upcoming(): UpcomingPick[] {
    return this.status?.upcoming ?? [];
  }

  get history(): DraftPick[] {
    return this.status?.history ?? [];
  }

  get users(): UserProgress[] {
    return this.status?.users ?? [];
  }
}