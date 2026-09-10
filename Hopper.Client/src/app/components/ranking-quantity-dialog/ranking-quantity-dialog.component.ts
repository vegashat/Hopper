import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Game } from '@models/game.model';

@Component({
  selector: 'app-ranking-quantity-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>How many tickets?</h2>
    <mat-dialog-content>
      <strong>{{ game.opponent.name }}</strong>
      <p>
        {{ game.gameDateTime | date:'EEE, MMM d, y':'America/Chicago' }} ·
        {{ game.gameDateTime | date:'shortTime':'America/Chicago' }}
      </p>
      <div class="quantity-options">
        <button mat-flat-button color="primary" [mat-dialog-close]="2">2 tickets</button>
        <button mat-flat-button color="primary" [mat-dialog-close]="4">4 tickets</button>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .quantity-options { display: flex; gap: 1rem; margin-top: 1rem; }
    .quantity-options button { flex: 1; min-height: 48px; }
  `]
})
export class RankingQuantityDialogComponent {
  readonly game = inject<Game>(MAT_DIALOG_DATA);
}
