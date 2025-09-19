import { Component, Input, Inject, Output, EventEmitter, Optional, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { Game } from '@models/game.model';
import { Selection } from '@models/selection.model';
import { SelectionsService } from '@services/selections.service';
import { GamesService } from '@services/games.service';
import { DraftService } from '@services/draft.service';
import { DraftStatus, UpcomingPick } from '@models/draft.model';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { combineLatest } from 'rxjs';
import { Participant } from '@models/participant.model';
import { SplitPickDialogComponent } from '@components/split-pick-dialog/split-pick-dialog.component';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
  @Input() game!: Game;
  @Output() gameUpdated = new EventEmitter<Game>();
  private draftService = inject(DraftService);
  private dialog = inject(MatDialog);

  private seasonId = 1;
  participant: Participant | undefined;
  private draftStatus: DraftStatus | undefined;

  constructor(
    private selectionsService: SelectionsService,
    private toastService: ToastService,
    private gamesService: GamesService,
    private authService: AuthService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { game: Game }
  ) {
    if (data?.game) {
      this.game = data.game;
    }
  }

  ngOnInit(): void {

    const user$ = this.authService.currentUser$;
    const draftStatus$ = this.draftService.draftStatus$;
    combineLatest([
      user$, draftStatus$
    ]).pipe()
      .subscribe(([user, status]) => {
        if (status) {
          this.draftStatus = status;
        }
        this.participant = user ?? undefined;
      });
  }

  get draftIsActive(): boolean {
    if (this.draftStatus) {
      return this.draftStatus.isActive;
    }
    return false;
  }

  get canSelect(): boolean {
    if (this.participant) {
      if (this.draftStatus && this.draftStatus.upcoming[0]) {
        return this.participant.isAdmin || this.draftStatus.upcoming[0].firebaseUserId == this.participant?.firebaseUserId;
      }
    }
    return false
  }

  get CurrentPickerRemainingTickets(): number {
    var nextPickUserId = this.draftStatus?.upcoming[0].firebaseUserId;

    return this.draftStatus?.users.filter(u => u.firebaseUserId == nextPickUserId)[0]?.remaining ?? 0;
  }

  pick(quantity: number, splitUserId : string | undefined = undefined) {
    if (!this.game) return;

    let selections: Selection[] = [{
      draftPickId: this.draftStatus?.upcoming[0].draftPickId ?? 0,
      firebaseUserId: this.draftStatus?.upcoming[0].firebaseUserId ?? '',
      gameId: this.game.gameId,
      displayName: this.draftStatus?.upcoming[0].displayName ?? '',
      quantity,
      pickedUtc: new Date().toISOString(),
    }];

    if(splitUserId){

      const splitSelection: Selection = {
        draftPickId: this.draftStatus?.upcoming[0].draftPickId ?? 0,
        firebaseUserId: splitUserId,
        gameId: this.game.gameId,
        displayName: this.draftStatus?.users.find(u => u.firebaseUserId == splitUserId)?.displayName ?? selections[0].displayName,
        quantity,
        pickedUtc: new Date().toISOString(),
      };
      selections = [...(selections), splitSelection];
    }

    this.selectionsService.makeSelection(this.seasonId, selections).subscribe({
      next: () => {
        let fullQuantity = 0;
        selections.forEach(sel => {
          fullQuantity += sel.quantity;
          this.game.selections = [...(this.game.selections || []), sel];
        });
        this.game.remainingTickets -= fullQuantity;

        this.gamesService.updateGame(this.game);
        this.draftService.loadStatus(this.seasonId);

        // this.toastService.success(`Picked ${fullQuantity} tickets for ${this.game.opponent.name} by ${selections[0].displayName}`);
      },
      error: () => {
        this.toastService.error('Failed to make pick');
      },
    });
  }

  openSplitDialog(game: Game) {
    // Filter participants with tickets remaining > 0

    const dialogRef = this.dialog.open(SplitPickDialogComponent, {
      width: '40vw',
      data: {game: game, participant: this.participant },
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.pick(2, result.splitUserId); // call pick with split target
      }
    });
  }
}