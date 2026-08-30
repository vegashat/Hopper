import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { HistoryService } from '../../services/history.service';
import { DraftPick } from '@models/draft.model';
import { AuthService } from '@services/auth.service';
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { GamesService } from '@services/games.service';
import { SeasonService } from '@services/season.service';
import { ToastService } from '@services/toast.service';
import { Game } from '@models/game.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatSlideToggle,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  private historyService = inject(HistoryService);
  private auth = inject(AuthService);
  private gamesService = inject(GamesService);
  private seasonService = inject(SeasonService);
  private toast = inject(ToastService);

  displayedColumns: string[] = ['order', 'user', 'team', 'date', 'quantity'];
  loading = true;

  // full list from the service
  allPicks: DraftPick[] = [];
  // what the table binds to (filtered)
  picks: DraftPick[] = [];

  // toggle state (persisted)
  showMineOnly = JSON.parse(localStorage.getItem('history_showMineOnly') ?? 'false');
  currentUserId: string | null = null;

  private subs: Subscription[] = [];

  ngOnInit(): void {
    // who am I?
    this.subs.push(
      this.auth.currentUser$.subscribe(u => {
        this.currentUserId = u?.firebaseUserId ?? null;
        this.applyFilter();
      })
    );

    // history stream
    this.subs.push(
      this.historyService.history$.subscribe({
        next: (data : DraftPick[]) => {
          this.allPicks = data ?? [];
          this.loading = false;
          this.applyFilter();
        },
        error: err => {
          console.error('Failed to load history', err);
          this.loading = false;
        }
      })
    );
  }

  onToggleMine(value: boolean) {
    this.showMineOnly = value;
    localStorage.setItem('history_showMineOnly', JSON.stringify(this.showMineOnly));
    this.applyFilter();
  }

  downloadCalendar(): void {
    const user = this.auth.currentUser;
    if (!user) {
      this.toast.error('Log in to download your game calendar');
      return;
    }

    const seasonId = this.seasonService.currentSeasonId;
    this.gamesService.getSeasonGames(seasonId).subscribe({
      next: games => {
        const selectedGames = games.filter(game =>
          game.selections.some(selection => selection.firebaseUserId === user.firebaseUserId));
        if (selectedGames.length === 0) {
          this.toast.warning('You do not have any selected games to download yet');
          return;
        }

        const calendar = this.buildCalendar(selectedGames, user.firebaseUserId, seasonId);
        const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hopper-selections-season-${seasonId}.ics`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
      },
      error: () => this.toast.error('Unable to create your game calendar')
    });
  }

  private buildCalendar(games: Game[], userId: string, seasonId: number): string {
    const now = this.formatIcsDate(new Date());
    const events = games
      .sort((a, b) => new Date(a.gameDateTime).getTime() - new Date(b.gameDateTime).getTime())
      .map(game => {
        const start = new Date(game.gameDateTime);
        const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
        const myTickets = game.selections
          .filter(selection => selection.firebaseUserId === userId)
          .reduce((total, selection) => total + selection.quantity, 0);
        const companions = [...new Set(game.selections
          .filter(selection => selection.firebaseUserId !== userId)
          .map(selection => selection.displayName || selection.firebaseUserId))];
        const goingWith = companions.length ? companions.join(', ') : 'No one else assigned yet';

        return [
          'BEGIN:VEVENT',
          `UID:hopper-${seasonId}-${game.gameId}-${this.escapeIcs(userId)}@hopper`,
          `DTSTAMP:${now}`,
          `DTSTART:${this.formatIcsDate(start)}`,
          `DTEND:${this.formatIcsDate(end)}`,
          `SUMMARY:${this.escapeIcs(`Thunder vs ${game.opponent.name}`)}`,
          `LOCATION:${this.escapeIcs(game.arena ?? '')}`,
          `DESCRIPTION:${this.escapeIcs(`Your tickets: ${myTickets}\nGoing with: ${goingWith}`)}`,
          'END:VEVENT'
        ].join('\r\n');
      });

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hopper//Game Selections//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Hopper Game Selections',
      ...events,
      'END:VCALENDAR',
      ''
    ].join('\r\n');
  }

  private formatIcsDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  }

  private escapeIcs(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  private applyFilter() {
    if (this.showMineOnly && this.currentUserId) {
      this.picks = this.allPicks.filter(p => p.firebaseUserId === this.currentUserId);
    } else {
      this.picks = this.allPicks;
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
