import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer, exhaustMap, catchError, of } from 'rxjs';
import { environment } from 'environments/environment';
import { Participant } from '@models/participant.model';

interface CounterState {
  enabled: boolean;
  stevenId: string | null;
  total: number;
  nextClickUtc: string | null;
  isSteven: boolean;
}

@Component({
  selector: 'app-steven-counter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  template: `
    <section *ngIf="admin || state?.enabled" class="counter">
      <h2>{{ admin ? 'Steven counter settings' : 'The Steven counter' }}</h2>
      <ng-container *ngIf="admin">
        <p>Just for laughs. This does not affect draft order or picks.</p>
        <p *ngIf="!state && !loadError" role="status">Loading counter settings…</p>
        <p *ngIf="loadError" role="alert">{{ loadError }}</p>
        <label>Steven's account
          <select [(ngModel)]="stevenId" [disabled]="busy || !state">
            <option [ngValue]="null">Choose participant</option>
            <option *ngFor="let p of participants" [value]="p.firebaseUserId">{{ p.displayName }}</option>
          </select>
        </label>
        <label><input type="checkbox" [(ngModel)]="enabled" [disabled]="busy || !state" /> Show counter on draft screen</label>
        <button mat-raised-button color="primary" (click)="save()" [disabled]="busy || !state">Save settings</button>
        <button mat-button (click)="reset()" [disabled]="busy || !state">Reset counter</button>
      </ng-container>
      <p *ngIf="state" class="total">Steven has been screwed <strong>{{ state.total }}</strong> times.</p>
      <ng-container *ngIf="!admin && state?.enabled">
        <label *ngIf="state?.isSteven">Choose your target
          <select [(ngModel)]="targetId">
            <option [ngValue]="null">Choose participant</option>
            <option *ngFor="let p of participants" [value]="p.firebaseUserId">{{ p.displayName }}</option>
          </select>
        </label>
        <button mat-raised-button color="primary" (click)="click()"
          [disabled]="busy || remaining > 0 || (state?.isSteven && !targetId)">
          {{ state?.isSteven ? 'Screw ' + targetName : 'Screw Steven' }}
        </button>
        <p *ngIf="remaining > 0">Give Steven a break! Try again in {{ remaining }}s.</p>
        <small>Just for laughs. Your draft picks are safe.</small>
      </ng-container>
      <p role="status" *ngIf="message">{{ message }}</p>
    </section>
  `,
  styles: [`
    .counter { padding: 1rem; margin-bottom: 1rem; border-radius: 12px; background: #fff8f0; }
    h2 { margin-top: 0; }
    label { display: block; margin: .75rem 0; }
    select { display: block; max-width: 100%; min-height: 44px; margin-top: .25rem; font: inherit; }
    small { display: block; margin-top: .75rem; }
    .total { font-size: 1.1rem; }
  `]
})
export class StevenCounterComponent implements OnInit {
  @Input() admin = false;
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private url = `${environment.apiUrl}/steven-counter`;
  state: CounterState | null = null;
  participants: Participant[] = [];
  stevenId: string | null = null;
  targetId: string | null = null;
  enabled = false;
  busy = false;
  remaining = 0;
  message = '';
  loadError = '';
  private initialized = false;

  get targetName(): string {
    return this.participants.find(p => p.firebaseUserId === this.targetId)?.displayName || 'someone';
  }

  ngOnInit(): void {
    this.http.get<Participant[]>(`${environment.apiUrl}/participants`)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: p => this.participants = p,
        error: () => this.message = 'Unable to load participants.'
      });
    timer(0, 5000).pipe(
      exhaustMap(() => this.http.get<CounterState>(this.url).pipe(catchError((err: HttpErrorResponse) => {
        this.loadError = err.status === 401 || err.status === 403
          ? 'Please log in with an administrator account to load and save these settings.'
          : err.status === 404
            ? 'The counter API is unavailable. Restart or deploy the updated API.'
            : 'Unable to load counter settings. Check that the API is running and the latest database migration has been applied.';
        return of(null);
      }))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(state => {
      if (state) {
        this.loadError = "";
        this.state = state;
        if (!this.initialized) {
          this.enabled = state.enabled;
          this.stevenId = state.stevenId;
          this.initialized = true;
        }
        this.updateCooldown();
      }
    });
    timer(0, 1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateCooldown());
  }

  private updateCooldown(): void {
    const value = this.state?.nextClickUtc;
    const utc = value && /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : value + 'Z';
    this.remaining = value ? Math.max(0, Math.ceil((Date.parse(utc) - Date.now()) / 1000)) : 0;
  }

  private mutate(path: string, body: unknown, put = false): void {
    if (this.busy) return;
    this.busy = true;
    this.message = '';
    const request = put ? this.http.put(this.url, body) : this.http.post<{ message?: string }>(this.url + path, body);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.busy = false;
        this.message = (result as { message?: string } | null)?.message || 'Saved.';
        if (path === '/click' && this.state) {
          this.state.nextClickUtc = new Date(Date.now() + 30000).toISOString();
          this.updateCooldown();
        }
        this.http.get<CounterState>(this.url).pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({ next: state => { this.state = state; this.updateCooldown(); }, error: () => {} });
      },
      error: err => {
        this.busy = false;
        this.message = err.error?.message || 'Unable to update counter.';
      }
    });
  }

  click(): void { this.mutate('/click', { targetId: this.targetId }); }
  save(): void { this.mutate('', { enabled: this.enabled, stevenId: this.stevenId }, true); }
  reset(): void {
    if (window.confirm('Reset Steven’s counter to zero?')) this.mutate('/reset', {});
  }
}
