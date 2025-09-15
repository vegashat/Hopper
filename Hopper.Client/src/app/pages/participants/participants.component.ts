import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DraftService } from '../../services/draft.service';
import { UserProgress } from '@models/user-progress.model';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatProgressBarModule],
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  participants: UserProgress[] = [];
  displayedColumns: string[] = ['displayName', 'picked', 'allotment', 'remaining', 'progress'];

  constructor(private draftService: DraftService) { }

  ngOnInit(): void {
    // You’ll need the current seasonId from somewhere (config, service, etc.)
    const seasonId = 1;
    this.draftService.draftStatus$.subscribe(status => {
      if(status && status.users){
        this.participants = status.users ?? [];
      }
    });
  }

  getProgress(p: UserProgress): number {
    return (p.picked / p.allotment) * 100;
  }
}