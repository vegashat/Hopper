import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GamesService } from '@services/games.service';
import { MatDialog } from '@angular/material/dialog';
import { GameCardComponent } from '@components/game-card/game-card.component';
import * as i0 from "@angular/core";
import * as i1 from "@fullcalendar/angular";
export class CalendarComponent {
    gamesSvc = inject(GamesService);
    dialog = inject(MatDialog);
    destroyRef = inject(DestroyRef);
    games = [];
    events = [];
    calendarOptions = {
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
            const logo = arg.event.extendedProps['logo'];
            const title = arg.event.title;
            const time = arg.event.start
                ? new Date(arg.event.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                : '';
            const selections = (arg.event.extendedProps['selections'] ?? []);
            const remaining = arg.event.extendedProps['remaining'] ?? 0;
            const content = document.createElement('div');
            content.className = 'logo-cell';
            content.title = title;
            if (remaining <= 0)
                content.classList.add('disabled');
            if (logo) {
                const image = document.createElement('img');
                image.className = 'opponent-logo';
                image.src = logo;
                image.alt = title;
                content.append(image);
            }
            content.append(this.textElement('game-time', time), this.textElement('remaining', remaining > 0 ? `${remaining} tickets left` : 'Sold out'));
            const participants = document.createElement('div');
            participants.className = 'participants';
            selections.forEach(selection => participants.append(this.textElement('participant', `${selection.displayName || selection.firebaseUserId} (${selection.quantity})`)));
            content.append(participants);
            return { domNodes: [content] };
        },
        eventClick: (info) => {
            const gameId = info.event.extendedProps['gameId'];
            this.openGameDialog(gameId);
        },
        events: []
    };
    ngOnInit() {
        this.refreshEvents();
    }
    refreshEvents() {
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
    openGameDialog(gameId) {
        const game = this.games.find(g => g.gameId === gameId);
        if (!game)
            return;
        const dialogRef = this.dialog.open(GameCardComponent, {
            width: '600px',
            data: { game },
        });
        dialogRef.componentInstance?.gameUpdated.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updatedGame) => {
            this.gamesSvc.updateGame(updatedGame);
            this.events = this.events.map(event => event.extendedProps?.['gameId'] === updatedGame.gameId
                ? {
                    ...event,
                    extendedProps: {
                        ...event.extendedProps,
                        remaining: updatedGame.remainingTickets,
                    },
                }
                : event);
            this.calendarOptions = { ...this.calendarOptions, events: this.events };
        });
    }
    textElement(className, text) {
        const element = document.createElement('div');
        element.className = className;
        element.textContent = text;
        return element;
    }
    static ɵfac = function CalendarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CalendarComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CalendarComponent, selectors: [["app-calendar"]], decls: 2, vars: 1, consts: [[1, "calendar-wrap"], [3, "options"]], template: function CalendarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵelement(1, "full-calendar", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("options", ctx.calendarOptions);
        } }, dependencies: [CommonModule, FullCalendarModule, i1.FullCalendarComponent], styles: ["\n\n.fc[_ngcontent-%COMP%] {\n    background: white;\n    \n\n    border-radius: 8px;\n    padding: 8px;\n}\n\n\n\n\n\n.fc-event[_ngcontent-%COMP%], \n.fc-event[_ngcontent-%COMP%]   .fc-event-main[_ngcontent-%COMP%] {\n  background: transparent !important;\n  border: none !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  box-shadow: none !important;\n}\n.fc[_ngcontent-%COMP%]   .opponent-logo[_ngcontent-%COMP%] {\n  width: 28px;   \n\n  height: 28px;\n  object-fit: contain;\n  display: block;\n  margin: 0 auto; \n\n}\n\n\n\n.fc[_ngcontent-%COMP%]   .logo-cell[_ngcontent-%COMP%] {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 100%;\n}\n\n\n\n.fc[_ngcontent-%COMP%]   .opponent-logo[_ngcontent-%COMP%] {\n    width: 36px;\n    height: 36px;\n    object-fit: contain;\n}\n\n.legend[_ngcontent-%COMP%] {\n    margin-top: 12px;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    font-weight: 500;\n\n    .legend-logo {\n        width: 28px;\n        height: 28px;\n        object-fit: contain;\n    }\n}\n\n.calendar-wrap[_ngcontent-%COMP%] {\n    padding: 8px;\n}\n\n.fc-h-event[_ngcontent-%COMP%] {\n    background-color: transparent;\n    border: transparent;\n}\n  .fc-daygrid-event {\n  display: flex !important;\n  justify-content: center !important;\n  align-items: center !important;\n  background: transparent !important;\n  border: none !important;\n  box-shadow: none !important;\n  padding: 0 !important;\n}\n\n  .fc-daygrid-event img {\n    width: 4em;\n    height: auto;\n    display: block;\n    // margin-left: 3em;\n}\n\n  .fc-daygrid-event {\n  background: transparent !important;\n  border: none !important;\n  box-shadow: none !important;\n  padding: 0 !important;\n}\n\n\n  .fc-daygrid-event {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  background: transparent !important;\n  border: none !important;\n  box-shadow: none !important;\n  padding: 0 !important;\n  overflow: visible !important; \n\n}\n\n\n\n.logo-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n\n\n\n.opponent-logo[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  object-fit: contain;\n  margin-bottom: 2px;\n}\n\n\n\n.game-time[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #333;\n  text-align: center;\n  line-height: 1;\n}\n.calendar-event[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n\n.calendar-event[_ngcontent-%COMP%]   .details[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  line-height: 1.2;\n}\n\n.calendar-event[_ngcontent-%COMP%]   .time[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n\n.calendar-event[_ngcontent-%COMP%]   .remaining[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  color: #666;\n}\n\n.calendar-event[_ngcontent-%COMP%]   .attendees[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  color: #333;\n}\n\n\n\n\n\n.fc[_ngcontent-%COMP%]   .opponent-logo[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  object-fit: contain;\n  display: block;\n  margin: 0 auto;\n}\n\n\n\n.fc[_ngcontent-%COMP%]   .logo-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n}\n\n\n\n.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5 !important;\n  filter: grayscale(100%) brightness(0.7) !important;\n  pointer-events: none;\n}\n\n.disabled[_ngcontent-%COMP%]   .opponent-logo[_ngcontent-%COMP%] {\n  opacity: 0.5 !important;\n  filter: grayscale(100%) brightness(0.6) !important;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CalendarComponent, [{
        type: Component,
        args: [{ selector: 'app-calendar', standalone: true, imports: [CommonModule, FullCalendarModule], template: "    <div class=\"calendar-wrap\">\n      <full-calendar [options]=\"calendarOptions\"></full-calendar>\n    </div>\n", styles: ["/* Calendar background cleanup */\n.fc {\n    background: white;\n    /* cells on white instead of orange */\n    border-radius: 8px;\n    padding: 8px;\n}\n\n/* Remove default event blue background */\n/* Remove all default event box styles */\n.fc-event,\n.fc-event .fc-event-main {\n  background: transparent !important;\n  border: none !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  box-shadow: none !important;\n}\n.fc .opponent-logo {\n  width: 28px;   /* shrink size */\n  height: 28px;\n  object-fit: contain;\n  display: block;\n  margin: 0 auto; /* center in the day cell */\n}\n\n/* Cell layout for logos */\n.fc .logo-cell {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 100%;\n}\n\n/* Logo size + remove weird spacing */\n.fc .opponent-logo {\n    width: 36px;\n    height: 36px;\n    object-fit: contain;\n}\n\n.legend {\n    margin-top: 12px;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    font-weight: 500;\n\n    .legend-logo {\n        width: 28px;\n        height: 28px;\n        object-fit: contain;\n    }\n}\n\n.calendar-wrap {\n    padding: 8px;\n}\n\n.fc-h-event {\n    background-color: transparent;\n    border: transparent;\n}\n::ng-deep .fc-daygrid-event {\n  display: flex !important;\n  justify-content: center !important;\n  align-items: center !important;\n  background: transparent !important;\n  border: none !important;\n  box-shadow: none !important;\n  padding: 0 !important;\n}\n\n::ng-deep .fc-daygrid-event img {\n    width: 4em;\n    height: auto;\n    display: block;\n    // margin-left: 3em;\n}\n\n::ng-deep .fc-daygrid-event {\n  background: transparent !important;\n  border: none !important;\n  box-shadow: none !important;\n  padding: 0 !important;\n}\n/* Make sure our event can stack items */\n::ng-deep .fc-daygrid-event {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  background: transparent !important;\n  border: none !important;\n  box-shadow: none !important;\n  padding: 0 !important;\n  overflow: visible !important; /* important: allows text to show */\n}\n\n/* Center logo and time vertically */\n.logo-cell {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n\n/* Smaller, centered logo */\n.opponent-logo {\n  width: 32px;\n  height: 32px;\n  object-fit: contain;\n  margin-bottom: 2px;\n}\n\n/* Game time styling */\n.game-time {\n  font-size: 0.75rem;\n  color: #333;\n  text-align: center;\n  line-height: 1;\n}\n.calendar-event {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n\n.calendar-event .details {\n  font-size: 0.75rem;\n  line-height: 1.2;\n}\n\n.calendar-event .time {\n  font-weight: 500;\n}\n\n.calendar-event .remaining {\n  font-size: 0.7rem;\n  color: #666;\n}\n\n.calendar-event .attendees {\n  font-size: 0.65rem;\n  color: #333;\n}\n\n/* Center everything inside the cell */\n/* Base logo styling */\n.fc .opponent-logo {\n  width: 36px;\n  height: 36px;\n  object-fit: contain;\n  display: block;\n  margin: 0 auto;\n}\n\n/* Cell container */\n.fc .logo-cell {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n}\n\n/* Disabled state */\n.disabled {\n  opacity: 0.5 !important;\n  filter: grayscale(100%) brightness(0.7) !important;\n  pointer-events: none;\n}\n\n.disabled .opponent-logo {\n  opacity: 0.5 !important;\n  filter: grayscale(100%) brightness(0.6) !important;\n}"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CalendarComponent, { className: "CalendarComponent", filePath: "src/app/pages/calendar/calendar.component.ts", lineNumber: 21 }); })();
