// src/app/pages/progress.component.ts
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { DraftService,  } from '../../services/draft.service';
import { DraftStatus } from '@models/draft.model';
import { SeasonService } from '@services/season.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
  status?: DraftStatus;
  seasonId = inject(SeasonService).currentSeasonId;
  private destroyRef = inject(DestroyRef);

  constructor(private draftService: DraftService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
      this.status  = status ?? undefined;
    });
  }
}
