import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HistoryService } from '../../services/history.service';
import { DraftPick } from '@models/draft.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  picks: DraftPick[] = [];
  displayedColumns: string[] = ['order', 'user', 'team', 'quantity'];
  loading = true;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
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