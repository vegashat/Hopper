import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DraftStatus, UserProgress } from '@models/draft.model';
import { AuthService } from '@services/auth.service';
import { DraftService } from '@services/draft.service';
import { GamesService } from '@services/games.service';

@Component({
  selector: 'app-allotment-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  template: `
    <ng-container *ngIf="editing; else display">
      <input type="number" [(ngModel)]="value" [min]="user.picked" [max]="maximum" step="1"
        [disabled]="saving" [attr.aria-label]="'Ticket allotment for ' + user.displayName" />
      <button mat-flat-button color="primary" (click)="save()" [disabled]="saving || !valid">Save</button>
      <button mat-stroked-button (click)="editing = false" [disabled]="saving">Cancel</button>
      <small>Min {{ user.picked }}, max {{ maximum }}. Total limit for all users: {{ capacity }} (games × 4).</small>
      <small *ngIf="error" role="alert">{{ error }}</small>
    </ng-container>
    <ng-template #display>
      {{ user.allotment }}
      <button mat-stroked-button color="primary" *ngIf="auth.currentUser?.isAdmin" (click)="begin()">Edit</button>
    </ng-template>
  `,
  styles: [`
    :host { display: block; padding: 0.5rem 0; }
    input { width: 5rem; }
    button { margin: 0.25rem 0 0.25rem 0.5rem; }
    small { display: block; margin-top: 0.25rem; }
  `]
})
export class AllotmentEditorComponent {
  @Input({ required: true }) user!: UserProgress;
  @Input({ required: true }) status!: DraftStatus;
  auth = inject(AuthService);
  private drafts = inject(DraftService);
  private games = inject(GamesService);
  editing = false;
  saving = false;
  value: number | null = null;
  capacity: number | null = null;
  error = '';

  get maximum(): number {
    return Math.max(0, (this.capacity ?? 0) - this.status.users
      .filter(user => user.firebaseUserId !== this.user.firebaseUserId)
      .reduce((sum, user) => sum + user.allotment, 0));
  }

  get valid(): boolean {
    return this.capacity !== null && this.value !== null && Number.isInteger(this.value)
      && this.value >= this.user.picked && this.value >= 0 && this.value <= this.maximum;
  }

  begin(): void {
    this.value = this.user.allotment;
    this.error = '';
    this.capacity = null;
    this.editing = true;
    this.games.getSeasonGames(this.status.seasonId).subscribe({
      next: games => this.capacity = games.length * 4,
      error: () => this.error = 'Unable to load the ticket limit. Cancel and try again.'
    });
  }

  save(): void {
    if (!this.valid || this.saving) return;
    this.saving = true;
    this.error = '';
    this.drafts.updateAllotment(this.status.seasonId, this.user.firebaseUserId, this.value!).subscribe({
      next: () => { this.saving = false; this.editing = false; },
      error: err => {
        this.saving = false;
        this.error = err.error?.message || 'Unable to save allotment. Please try again.';
      }
    });
  }
}
