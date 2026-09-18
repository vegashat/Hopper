import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { GamesService } from '@services/games.service';
import { Game } from '@models/game.model';
import { MatDialog } from '@angular/material/dialog';
import { GameCardComponent } from '@components/game-card/game-card.component';
import { Selection } from '@models/selection.model';

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
  private destroyRef = inject(DestroyRef);
  games: Game[] = [];
  private events: EventInput[] = [];

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

    eventContent: (arg) => {
      const logo = arg.event.extendedProps['logo'] as string | undefined;
      const title = arg.event.title;
      const time = arg.event.start
        ? new Date(arg.event.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        : '';

      const selections = (arg.event.extendedProps['selections'] ?? []) as Selection[];
      const remaining = arg.event.extendedProps['remaining'] ?? 0;

      const content = document.createElement('div');
      content.className = 'logo-cell';
      content.title = title;
      if (remaining <= 0) {
        content.classList.add('sold-out');
        content.setAttribute('aria-label', `${title}, sold out`);
      }

      if (logo) {
        const image = document.createElement('img');
        image.className = 'opponent-logo';
        image.src = logo;
        image.alt = title;
        content.append(image);
      }

      content.append(
        this.textElement('game-time', time),
        this.textElement('remaining', remaining > 0 ? `${remaining} tickets left` : 'Sold out')
      );
      const participants = document.createElement('div');
      participants.className = 'participants';
      selections.forEach(selection => participants.append(
        this.textElement('participant', `${selection.displayName || selection.firebaseUserId} (${selection.quantity})`)
      ));
      content.append(participants);
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
    this.gamesSvc.games$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(games => {
      this.games = games;
      this.events = games.map(g => ({
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
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    });

  }

  openGameDialog(gameId: number) {
    const game = this.games.find(g => g.gameId === gameId);
    if (!game) return;
    const dialogRef = this.dialog.open(GameCardComponent, {
      width: '600px',
      data: { game },
    });

    dialogRef.componentInstance?.gameUpdated.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updatedGame: Game) => {

      this.gamesSvc.updateGame(updatedGame);
      this.events = this.events.map(event =>
        event.extendedProps?.['gameId'] === updatedGame.gameId
          ? {
            ...event,
            extendedProps: {
              ...event.extendedProps,
              remaining: updatedGame.remainingTickets,
            },
          }
          : event
      );
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    });
  }

  private textElement(className: string, text: string): HTMLElement {
    const element = document.createElement('div');
    element.className = className;
    element.textContent = text;
    return element;
  }
}
