// src/app/pages/progress.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { DraftService,  } from '../../services/draft.service';
import { DraftStatus } from '@models/draft.model';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
  status?: DraftStatus;
  seasonId = 1; // TODO: make dynamic later

  constructor(private draftService: DraftService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.draftService.getDraftStatus(this.seasonId).subscribe({
      next: res => (this.status = res),
      error: err => console.error('Failed to load draft status', err),
    });
  }
}