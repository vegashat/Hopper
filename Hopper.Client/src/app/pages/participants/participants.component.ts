import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DraftService } from '../../services/draft.service';
import { UserProgress } from '@models/user-progress.model';
import { DraftStatus } from '@models/draft.model';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatProgressBarModule],
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  participants: UserProgress[] = [];
  status: DraftStatus | undefined;
  displayedColumns: string[] = ['displayName', 'picked', 'allotment', 'remaining', 'lastPick', 'longestWait', 'progress'];

  constructor(private draftService: DraftService) { }

  ngOnInit(): void {
    this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
      if (status && status.users) {
        this.status = status;
        this.participants = status.users ?? [];
      }
    });
  }

  getPicksSinceLastPick(firebaseUserId: string): number {
    if (!this.status?.history || this.status.history.length === 0) return 0;

    // Find the last pick made by this user
    const lastPick = [...this.status.history]
      .reverse()
      .find(p => p.firebaseUserId === firebaseUserId);

    if (!lastPick) {
      // User hasn't picked yet → all picks count
      return this.status.history.length;
    }

    // Total picks since their last pick
    const picksAfter = this.status.history.filter(p => p.pickOrder > lastPick.pickOrder);
    return picksAfter.length;
  }

  getBiggestGapForUser(firebaseUserId: string): number {
    // Filter picks that belong to the user
    const userPicks = this.status?.history
      .filter(p => p.firebaseUserId === firebaseUserId)
      .sort((a, b) => a.pickOrder - b.pickOrder);

    if (userPicks) {
      if(userPicks?.findIndex(u => u.firebaseUserId == firebaseUserId) < 0){
        return 0
      }

      if (userPicks.length < 2) {
        // If only one (or zero) picks, gap is total length since that pick
        return (this.status?.history.length ?? 0) - (userPicks[0]?.pickOrder ?? 0);
      }

      let maxGap = 0;

      for (let i = 1; i < userPicks.length; i++) {
        const prev = userPicks[i - 1].pickOrder;
        const current = userPicks[i].pickOrder;
        const gap = current - prev - 1; // picks in between
        if (gap > maxGap) {
          maxGap = gap;
        }
      }

      // Optionally, include "gap since last pick until now"
      const gapSinceLast = (this.status?.history.length ?? 0) - userPicks[userPicks.length - 1].pickOrder;
      if (gapSinceLast > maxGap) {
        maxGap = gapSinceLast;
      }

      if (maxGap < 0) {
        return this.getPicksSinceLastPick(firebaseUserId);
      } else {
        return maxGap;
      }
    }
    return 0;
  }

  getProgress(p: UserProgress): number {
    return p.allotment > 0 ? (p.picked / p.allotment) * 100 : 0;
  }
}
