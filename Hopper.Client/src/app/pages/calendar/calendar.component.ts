import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { GamesService } from '@services/games.service';
import { Game } from '@models/game.model';
import { MatDialog } from '@angular/material/dialog';
import { GameCardComponent } from '@components/game-card/game-card.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private gamesSvc = inject(GamesService);
  private dialog = inject(MatDialog);
  games: Game[] = [];
  seasonId = 1;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    height: 'auto',
    timeZone: 'local',
    dayMaxEventRows: true,

    //   eventContent: (arg) => {
    //     const logo = arg.event.extendedProps['logo'] as string | undefined;
    //     const title = arg.event.title;
    //     const time = arg.event.start
    //       ? new Date(arg.event.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    //       : '';
    //     const selections = arg.event.extendedProps['selections'] || [];
    //     const remaining = arg.event.extendedProps['remaining'] ?? 0;

    //     let html = `
    //   <div class="logo-cell ${remaining == 0 ? 'disabled' : ''}">
    //     ${logo ? `<img class="opponent-logo" src="${logo}" alt="${title}" />` : ''}
    //     <div class="game-title">${title} - ${time}</div>
    //        <div class="remaining">
    //       ${remaining > 0 ? `${remaining} tickets left` : 'Sold out'}
    //     </div>

    //     <div class="participants">
    //       ${selections.map((s: any) =>
    //       `<div class="participant">${s.displayName || s.firebaseUserId} (${s.quantity})</div>`
    //     ).join('')}
    //     </div>
    //   </div>
    // `;

    //     let content = document.createElement('div');
    //     content.innerHTML = html.trim();

    //     return { domNodes: [content] };
    //   },
    eventContent: (arg) => {
      const logo = arg.event.extendedProps['logo'] as string | undefined;
      const title = arg.event.title;
      const time = arg.event.start
        ? new Date(arg.event.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        : '';

      const selections = arg.event.extendedProps['selections'] || [];
      const remaining = arg.event.extendedProps['remaining'] ?? 0;

      // Add "disabled" class if sold out
      const disabledStyle = remaining <= 0 ? "style='opacity: 0.5;'" : '';

      const html = `
    <div class="logo-cell" ${disabledStyle} title="${title}">
      ${logo ? `<img class="opponent-logo" src="${logo}" alt="${title}" />` : ''}
      <div class="game-time">${time}</div>
      <div class="remaining">${remaining > 0 ? remaining + ' tickets left' : 'Sold out'}</div>
        <div class="participants">
          ${selections.map((s: any) =>
            `<div class="participant">${s.displayName || s.firebaseUserId} (${s.quantity})</div>`
          ).join('')}
        </div>
    </div>
  `;

      let content = document.createElement('div');
      if (remaining == 0) {
        content.classList.add('disabled'); // Add a custom class
      }
      content.innerHTML = html;
      return { domNodes: [content] };
    },
    eventClick: (info) => {
      const gameId = info.event.extendedProps['gameId'];
      this.openGameDialog(gameId);
    },
    events: []
  };

  ngOnInit(): void {
    this.refreshEvents();
  }

  refreshEvents(): void {
    this.gamesSvc.games$.subscribe(games => {
      this.games = games;
      const events = games.map(g => ({
        title: g.opponent.name,
        start: g.gameDateTime,
        allDay: false,
        extendedProps: {
          logo: g.opponent.logoUrl ? `assets/${g.opponent.logoUrl}` : undefined,
          opponent: g.opponent.name,
          gameId: g.gameId,
          arena: g.arena,
          remaining: g.remainingTickets,
          selections: g.selections
        }
      }));
      this.calendarOptions = { ...this.calendarOptions, events };
    });

  }

  openGameDialog(gameId: number) {
    const game = this.games.find(g => g.gameId == gameId);
    const dialogRef = this.dialog.open(GameCardComponent, {
      width: '600px',
      data: { game },
    });

    // ✅ listen for updates from inside dialog
    dialogRef.componentInstance?.gameUpdated.subscribe((updatedGame: Game) => {

      this.gamesSvc.updateGame(updatedGame);
      this.calendarOptions.events = (this.calendarOptions.events as any[]).map(ev =>
        ev.extendedProps['gameId'] === updatedGame.gameId
          ? {
            ...ev,
            extendedProps: {
              ...ev.extendedProps,
              remaining: updatedGame.remainingTickets,
            },
          }
          : ev
      );
    });
  }
}