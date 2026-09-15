import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HistoryService } from '../../services/history.service';
import { AuthService } from '@services/auth.service';
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { GamesService } from '@services/games.service';
import { SeasonService } from '@services/season.service';
import { ToastService } from '@services/toast.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/table";
import * as i3 from "@angular/material/progress-spinner";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
function HistoryComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵelement(1, "mat-spinner");
    i0.ɵɵelementEnd();
} }
function HistoryComponent_div_8_th_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 16);
    i0.ɵɵtext(1, " Pick # ");
    i0.ɵɵelementEnd();
} }
function HistoryComponent_div_8_td_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", pick_r1.pickOrder, " ");
} }
function HistoryComponent_div_8_th_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 16);
    i0.ɵɵtext(1, " User ");
    i0.ɵɵelementEnd();
} }
function HistoryComponent_div_8_td_7_i_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "i");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("(Picked by ", pick_r2.pickedByDisplayName, ")");
} }
function HistoryComponent_div_8_td_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 17);
    i0.ɵɵtext(1);
    i0.ɵɵtemplate(2, HistoryComponent_div_8_td_7_i_2_Template, 2, 1, "i", 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", pick_r2.displayName || pick_r2.firebaseUserId, " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", pick_r2.firebaseUserId != pick_r2.pickedById);
} }
function HistoryComponent_div_8_th_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 16);
    i0.ɵɵtext(1, " Team ");
    i0.ɵɵelementEnd();
} }
function HistoryComponent_div_8_td_10_img_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 20);
} if (rf & 2) {
    const pick_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("src", "assets/" + pick_r3.team.logoUrl, i0.ɵɵsanitizeUrl)("alt", pick_r3.team.name);
} }
function HistoryComponent_div_8_td_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 17)(1, "div", 18);
    i0.ɵɵtemplate(2, HistoryComponent_div_8_td_10_img_2_Template, 1, 2, "img", 19);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const pick_r3 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", pick_r3.team == null ? null : pick_r3.team.logoUrl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(pick_r3.team == null ? null : pick_r3.team.name);
} }
function HistoryComponent_div_8_th_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 16);
    i0.ɵɵtext(1, " Date ");
    i0.ɵɵelementEnd();
} }
function HistoryComponent_div_8_td_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", pick_r4.gameDateTime, " ");
} }
function HistoryComponent_div_8_th_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 16);
    i0.ɵɵtext(1, " Tickets ");
    i0.ɵɵelementEnd();
} }
function HistoryComponent_div_8_td_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", pick_r5.quantity, " ");
} }
function HistoryComponent_div_8_tr_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 21);
} }
function HistoryComponent_div_8_tr_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 22);
} }
function HistoryComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "table", 6);
    i0.ɵɵelementContainerStart(2, 7);
    i0.ɵɵtemplate(3, HistoryComponent_div_8_th_3_Template, 2, 0, "th", 8)(4, HistoryComponent_div_8_td_4_Template, 2, 1, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(5, 10);
    i0.ɵɵtemplate(6, HistoryComponent_div_8_th_6_Template, 2, 0, "th", 8)(7, HistoryComponent_div_8_td_7_Template, 3, 2, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(8, 11);
    i0.ɵɵtemplate(9, HistoryComponent_div_8_th_9_Template, 2, 0, "th", 8)(10, HistoryComponent_div_8_td_10_Template, 5, 2, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(11, 12);
    i0.ɵɵtemplate(12, HistoryComponent_div_8_th_12_Template, 2, 0, "th", 8)(13, HistoryComponent_div_8_td_13_Template, 2, 1, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(14, 13);
    i0.ɵɵtemplate(15, HistoryComponent_div_8_th_15_Template, 2, 0, "th", 8)(16, HistoryComponent_div_8_td_16_Template, 2, 1, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(17, HistoryComponent_div_8_tr_17_Template, 1, 0, "tr", 14)(18, HistoryComponent_div_8_tr_18_Template, 1, 0, "tr", 15);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r5 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("dataSource", ctx_r5.picks);
    i0.ɵɵadvance(16);
    i0.ɵɵproperty("matHeaderRowDef", ctx_r5.displayedColumns);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", ctx_r5.displayedColumns);
} }
export class HistoryComponent {
    historyService = inject(HistoryService);
    auth = inject(AuthService);
    gamesService = inject(GamesService);
    seasonService = inject(SeasonService);
    toast = inject(ToastService);
    displayedColumns = ['order', 'user', 'team', 'date', 'quantity'];
    loading = true;
    // full list from the service
    allPicks = [];
    // what the table binds to (filtered)
    picks = [];
    // toggle state (persisted)
    showMineOnly = JSON.parse(localStorage.getItem('history_showMineOnly') ?? 'false');
    currentUserId = null;
    subs = [];
    ngOnInit() {
        // who am I?
        this.subs.push(this.auth.currentUser$.subscribe(u => {
            this.currentUserId = u?.firebaseUserId ?? null;
            this.applyFilter();
        }));
        // history stream
        this.subs.push(this.historyService.history$.subscribe({
            next: (data) => {
                this.allPicks = data ?? [];
                this.loading = false;
                this.applyFilter();
            },
            error: err => {
                console.error('Failed to load history', err);
                this.loading = false;
            }
        }));
    }
    onToggleMine(value) {
        this.showMineOnly = value;
        localStorage.setItem('history_showMineOnly', JSON.stringify(this.showMineOnly));
        this.applyFilter();
    }
    downloadCalendar() {
        const user = this.auth.currentUser;
        if (!user) {
            this.toast.error('Log in to download your game calendar');
            return;
        }
        const seasonId = this.seasonService.currentSeasonId;
        this.gamesService.getSeasonGames(seasonId).subscribe({
            next: games => {
                const selectedGames = games.filter(game => game.selections.some(selection => selection.firebaseUserId === user.firebaseUserId));
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
    buildCalendar(games, userId, seasonId) {
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
    formatIcsDate(date) {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    }
    escapeIcs(value) {
        return value
            .replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/,/g, '\\,')
            .replace(/;/g, '\\;');
    }
    applyFilter() {
        if (this.showMineOnly && this.currentUserId) {
            this.picks = this.allPicks.filter(p => p.firebaseUserId === this.currentUserId);
        }
        else {
            this.picks = this.allPicks;
        }
    }
    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
    static ɵfac = function HistoryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HistoryComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: HistoryComponent, selectors: [["app-history"]], decls: 9, vars: 5, consts: [[1, "history-toolbar"], [3, "change", "checked", "disabled"], ["mat-stroked-button", "", "color", "primary", 3, "click", "disabled"], ["class", "loading", 4, "ngIf"], [4, "ngIf"], [1, "loading"], ["mat-table", "", 1, "mat-elevation-z1", "full-width", 3, "dataSource"], ["matColumnDef", "order"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "user"], ["matColumnDef", "team"], ["matColumnDef", "date"], ["matColumnDef", "quantity"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "team-cell"], ["class", "team-logo", 3, "src", "alt", 4, "ngIf"], [1, "team-logo", 3, "src", "alt"], ["mat-header-row", ""], ["mat-row", ""]], template: function HistoryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "mat-slide-toggle", 1);
            i0.ɵɵlistener("change", function HistoryComponent_Template_mat_slide_toggle_change_1_listener($event) { return ctx.onToggleMine($event.checked); });
            i0.ɵɵtext(2, " Show only my picks ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "button", 2);
            i0.ɵɵlistener("click", function HistoryComponent_Template_button_click_3_listener() { return ctx.downloadCalendar(); });
            i0.ɵɵelementStart(4, "mat-icon");
            i0.ɵɵtext(5, "calendar_add_on");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6, " Download my calendar ");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(7, HistoryComponent_div_7_Template, 2, 0, "div", 3)(8, HistoryComponent_div_8_Template, 19, 3, "div", 4);
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("checked", ctx.showMineOnly)("disabled", !ctx.currentUserId);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", !ctx.currentUserId);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading);
        } }, dependencies: [CommonModule, i1.NgIf, MatTableModule, i2.MatTable, i2.MatHeaderCellDef, i2.MatHeaderRowDef, i2.MatColumnDef, i2.MatCellDef, i2.MatRowDef, i2.MatHeaderCell, i2.MatCell, i2.MatHeaderRow, i2.MatRow, MatProgressSpinnerModule, i3.MatProgressSpinner, MatButtonToggleModule,
            MatSlideToggle,
            MatButtonModule, i4.MatButton, MatIconModule, i5.MatIcon], styles: [".full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.history-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n\n.team-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.team-logo[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  object-fit: contain;\n}\n\n@media (max-width: 600px) {\n  .history-toolbar[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    flex-direction: column;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HistoryComponent, [{
        type: Component,
        args: [{ selector: 'app-history', standalone: true, imports: [
                    CommonModule,
                    MatTableModule,
                    MatProgressSpinnerModule,
                    MatButtonToggleModule,
                    MatSlideToggle,
                    MatButtonModule,
                    MatIconModule
                ], template: "<div class=\"history-toolbar\">\n  <mat-slide-toggle [checked]=\"showMineOnly\" (change)=\"onToggleMine($event.checked)\" [disabled]=\"!currentUserId\">\n    Show only my picks\n  </mat-slide-toggle>\n  <button mat-stroked-button color=\"primary\" (click)=\"downloadCalendar()\" [disabled]=\"!currentUserId\">\n    <mat-icon>calendar_add_on</mat-icon>\n    Download my calendar\n  </button>\n</div>\n\n<div *ngIf=\"loading\" class=\"loading\">\n  <mat-spinner></mat-spinner>\n</div>\n\n<div *ngIf=\"!loading\">\n  <table mat-table [dataSource]=\"picks\" class=\"mat-elevation-z1 full-width\">\n\n    <!-- Pick Order -->\n    <ng-container matColumnDef=\"order\">\n      <th mat-header-cell *matHeaderCellDef> Pick # </th>\n      <td mat-cell *matCellDef=\"let pick\"> {{ pick.pickOrder }} </td>\n    </ng-container>\n\n    <!-- User -->\n    <ng-container matColumnDef=\"user\">\n      <th mat-header-cell *matHeaderCellDef> User </th>\n      <td mat-cell *matCellDef=\"let pick\"> {{ pick.displayName || pick.firebaseUserId }}\n        <i *ngIf=\"pick.firebaseUserId != pick.pickedById\">(Picked by {{pick.pickedByDisplayName}})</i>\n      </td>\n    </ng-container>\n\n    <!-- Team -->\n    <ng-container matColumnDef=\"team\">\n      <th mat-header-cell *matHeaderCellDef> Team </th>\n      <td mat-cell *matCellDef=\"let pick\">\n        <div class=\"team-cell\">\n          <img *ngIf=\"pick.team?.logoUrl\" [src]=\"'assets/' + pick.team.logoUrl\" [alt]=\"pick.team.name\"\n            class=\"team-logo\" />\n          <span>{{ pick.team?.name }}</span>\n        </div>\n      </td>\n    </ng-container>\n\n    <!-- Date -->\n    <ng-container matColumnDef=\"date\">\n      <th mat-header-cell *matHeaderCellDef> Date </th>\n      <td mat-cell *matCellDef=\"let pick\"> {{ pick.gameDateTime}} </td>\n    </ng-container>\n\n    <!-- Quantity -->\n    <ng-container matColumnDef=\"quantity\">\n      <th mat-header-cell *matHeaderCellDef> Tickets </th>\n      <td mat-cell *matCellDef=\"let pick\"> {{ pick.quantity }} </td>\n    </ng-container>\n\n    <!-- Table rows -->\n    <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\n    <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n  </table>\n</div>\n", styles: [".full-width {\n  width: 100%;\n}\n\n.history-toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n\n.team-cell {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.team-logo {\n  width: 28px;\n  height: 28px;\n  object-fit: contain;\n}\n\n@media (max-width: 600px) {\n  .history-toolbar {\n    align-items: flex-start;\n    flex-direction: column;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(HistoryComponent, { className: "HistoryComponent", filePath: "src/app/pages/history/history.component.ts", lineNumber: 34 }); })();
