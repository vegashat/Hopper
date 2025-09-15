import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DraftService } from '@services/draft.service';
import { DraftStatus } from '@models/draft.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  seasonId : number = 1;
  status?: DraftStatus;

  constructor(private draftService: DraftService) { }

  ngOnInit() : void {
    this.loadStatus();
  }

  games = [
    { gameId: 1, opponent: 'Charlotte Hornets', gameDateTime: new Date(), arena: 'Paycom', remainingTickets: 2 },
    { gameId: 2, opponent: 'Denver Nuggets', gameDateTime: new Date(), arena: 'Paycom', remainingTickets: 4 },
  ];

  participants = [
    { firebaseUserId: 'abc', displayName: 'Jeaux Test', email: 'jeaux@test.com', isAdmin: true },
    { firebaseUserId: 'xyz', displayName: 'Kartik Test', email: 'kartik@test.com', isAdmin: false },
  ];

  displayedGameColumns = ['opponent', 'date', 'arena', 'tickets', 'actions'];
  displayedParticipantColumns = ['name', 'email', 'isAdmin'];

  loadStatus(): void {
    this.draftService.getDraftStatus(this.seasonId).subscribe({
      next: (s) => (this.status = s),
      error: (err) => console.error('Failed to load draft status', err),
    });
  }


  startDraft(): void {
    this.draftService.startDraft(this.seasonId).subscribe({
      next: (draft) => console.log('Draft started:', draft),
      error: (err) => console.error('Failed to start draft', err),
    });
  }

  resetDraft(): void {
    this.draftService.resetDraft(this.seasonId).subscribe({
      next: () => console.log('Draft reset'),
      error: (err) => console.error('Failed to reset draft', err),
    });
  }

}