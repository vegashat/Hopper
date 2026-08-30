import { Component, DestroyRef, Input, Inject, Output, EventEmitter, Optional, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { Game } from '@models/game.model';
import { Selection } from '@models/selection.model';
import { SelectionsService } from '@services/selections.service';
import { GamesService } from '@services/games.service';
import { DraftService } from '@services/draft.service';
import { DraftStatus } from '@models/draft.model';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { combineLatest } from 'rxjs';
import { Participant } from '@models/participant.model';
import { SplitPickDialogComponent } from '@components/split-pick-dialog/split-pick-dialog.component';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule} from '@angular/material/menu';
import { SeasonService } from '@services/season.service';

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
  private destroyRef = inject(DestroyRef);

  participant: Participant | undefined;
  private draftStatus: DraftStatus | undefined;

  constructor(
    private selectionsService: SelectionsService,
    private toastService: ToastService,
    private gamesService: GamesService,
    private authService: AuthService,
    private seasonService: SeasonService,
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
    ]).pipe(takeUntilDestroyed(this.destroyRef))
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
    const nextPick = this.draftStatus?.upcoming?.[0];
    return !!this.participant
      && !!nextPick
      && (this.participant.isAdmin || nextPick.firebaseUserId === this.participant.firebaseUserId);
  }

  get CurrentPickerRemainingTickets(): number {
    const nextPickUserId = this.draftStatus?.upcoming?.[0]?.firebaseUserId;
    if (!nextPickUserId) return 0;

    return this.draftStatus?.users?.find(u => u.firebaseUserId === nextPickUserId)?.remaining ?? 0;
  }

  pick(quantity: number, splitUserId : string | undefined = undefined) {
    if (!this.game) return;
    const nextPick = this.draftStatus?.upcoming?.[0];
    if (!nextPick) {
      this.toastService.error('No upcoming draft pick is available');
      return;
    }

    let selections: Selection[] = [{
      draftPickId: nextPick.draftPickId,
      firebaseUserId: nextPick.firebaseUserId,
      gameId: this.game.gameId,
      displayName: nextPick.displayName,
      quantity,
      pickedUtc: new Date().toISOString(),
    }];

    if(splitUserId){

      const splitSelection: Selection = {
        draftPickId: nextPick.draftPickId,
        firebaseUserId: splitUserId,
        gameId: this.game.gameId,
        displayName: this.draftStatus?.users.find(u => u.firebaseUserId == splitUserId)?.displayName ?? selections[0].displayName,
        quantity,
        pickedUtc: new Date().toISOString(),
      };
      selections = [...(selections), splitSelection];
    }

    this.selectionsService.makeSelection(this.seasonService.currentSeasonId, selections).subscribe({
      next: () => {
        let fullQuantity = 0;
        selections.forEach(sel => {
          fullQuantity += sel.quantity;
          this.game.selections = [...(this.game.selections || []), sel];
        });
        this.game.remainingTickets -= fullQuantity;

        this.gamesService.updateGame(this.game);
        this.draftService.loadStatus(this.seasonService.currentSeasonId);

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
      width: '95vw',
      data: {game: game, participant: this.participant },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result?: { splitUserId: string }) => {
      if (result) {
        this.pick(2, result.splitUserId); // call pick with split target
      }
    });
  }
}
