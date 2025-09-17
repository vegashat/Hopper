// split-pick-dialog.component.ts
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Participant } from '@models/participant.model';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ParticipantsService } from '@services/participants.service';
import { DraftService } from '@services/draft.service';
import { UserProgress } from '@models/draft.model';
import { CommonModule } from '@angular/common';
import { Game } from '@models/game.model';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-split-pick-dialog',
  templateUrl: './split-pick-dialog.component.html',
  imports: [MatInputModule, MatSelectModule, CommonModule, FormsModule, MatDialogContent, MatDialogActions, MatButtonModule],
})
export class SplitPickDialogComponent implements OnInit {
  selectedUserId: string | null = null;
  pickingUserId: string | null = null;
  game: Game | null = null;
  draftService = inject(DraftService)
  users : UserProgress[] = [];

  constructor(
    public dialogRef: MatDialogRef<SplitPickDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {game: Game, participant: Participant}
  ) {
    if(data){
      this.pickingUserId = data.participant.firebaseUserId;
      this.game = data.game;
    }
  }

  ngOnInit(): void {
    const seasonId = 1;
    this.draftService.draftStatus$.subscribe(status => {
      if(status && status.users){
        this.users = status.users.filter(p => p.remaining > 0 && p.firebaseUserId !== this.pickingUserId);
      }
    });
  }

  confirm() {
    if (this.selectedUserId) {
      this.dialogRef.close({ splitUserId: this.selectedUserId, splitQuantity: 2 });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}