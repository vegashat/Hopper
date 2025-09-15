// src/app/pages/history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HistoryService } from '../../services/history.service';
import { HistoryPick } from '@models/draft.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  picks: HistoryPick[] = [];
  displayedColumns: string[] = ['order', 'user', 'claimedUtc'];
  loading = true;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    // TODO: Replace with real seasonId from context/session
    const seasonId = 1;

    this.historyService.getHistory(seasonId).subscribe({
      next: data => {
        this.picks = data;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load history', err);
        this.loading = false;
      }
    });
  }
}