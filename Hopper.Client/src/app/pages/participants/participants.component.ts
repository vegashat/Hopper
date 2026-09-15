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
    return this.getWaitStats(firebaseUserId).current;
  }

  getBiggestGapForUser(firebaseUserId: string): number {
    return this.getWaitStats(firebaseUserId).longest;
  }

  private getWaitStats(firebaseUserId: string): { current: number; longest: number } {
    // Split selections share a turn; gaps in pickOrder are not completed picks.
    const turns = new Map<number, Set<string>>();
    for (const pick of this.status?.history ?? []) {
      if (!turns.has(pick.pickOrder)) turns.set(pick.pickOrder, new Set());
      turns.get(pick.pickOrder)!.add(pick.firebaseUserId);
    }

    let current = 0;
    let longest = 0;
    for (const [, recipients] of [...turns.entries()].sort(([a], [b]) => a - b)) {
      if (recipients.has(firebaseUserId)) {
        current = 0;
      } else {
        current++;
        longest = Math.max(longest, current);
      }
    }
    // Includes the initial wait, gaps between picks, and the ongoing wait.
    return { current, longest };
  }

  getProgress(p: UserProgress): number {
    return p.allotment > 0 ? (p.picked / p.allotment) * 100 : 0;
  }
}
