import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RankingQuantityDialogComponent } from '../../components/ranking-quantity-dialog/ranking-quantity-dialog.component';
import { GameRankingsService } from '@services/game-rankings.service';
import { GamesService } from '@services/games.service';
import { SeasonService } from '@services/season.service';
import { DraftService } from '@services/draft.service';
import { ToastService } from '@services/toast.service';
import { forkJoin } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/cdk/drag-drop";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/select";
function GameRankingsComponent_button_15_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 5);
    i0.ɵɵlistener("click", function GameRankingsComponent_button_15_Template_button_click_0_listener() { const day_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.selectedWeekday = day_r2); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const day_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("selected", ctx_r2.selectedWeekday === day_r2);
    i0.ɵɵattribute("aria-pressed", ctx_r2.selectedWeekday === day_r2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(day_r2);
} }
function GameRankingsComponent_div_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵtext(1, " The draft has started, so rankings are now locked. ");
    i0.ɵɵelementEnd();
} }
function GameRankingsComponent_div_17_div_5_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16)(1, "mat-icon", 17);
    i0.ɵɵtext(2, "drag_indicator");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 18);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(5, "img", 19);
    i0.ɵɵelementStart(6, "div", 20)(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵpipe(11, "date");
    i0.ɵɵpipe(12, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "mat-select", 21);
    i0.ɵɵtwoWayListener("valueChange", function GameRankingsComponent_div_17_div_5_Template_mat_select_valueChange_13_listener($event) { const item_r6 = i0.ɵɵrestoreView(_r5).$implicit; i0.ɵɵtwoWayBindingSet(item_r6.quantity, $event) || (item_r6.quantity = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementStart(14, "mat-option", 22);
    i0.ɵɵtext(15, "2 tickets");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "mat-option", 22);
    i0.ɵɵtext(17, "4 tickets");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "button", 23);
    i0.ɵɵlistener("click", function GameRankingsComponent_div_17_div_5_Template_button_click_18_listener() { const index_r7 = i0.ɵɵrestoreView(_r5).index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.remove(index_r7)); });
    i0.ɵɵelementStart(19, "mat-icon");
    i0.ɵɵtext(20, "close");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const index_r7 = ctx.index;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("cdkDragDisabled", ctx_r2.isDraftActive);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(index_r7 + 1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", "assets/" + item_r6.game.opponent.logoUrl, i0.ɵɵsanitizeUrl)("alt", item_r6.game.opponent.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r6.game.opponent.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind3(11, 12, item_r6.game.gameDateTime, "EEE, MMM d, y", "America/Chicago"), " \u00B7 ", i0.ɵɵpipeBind3(12, 16, item_r6.game.gameDateTime, "shortTime", "America/Chicago"), " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("value", item_r6.quantity);
    i0.ɵɵproperty("disabled", ctx_r2.isDraftActive);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", 2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", 4);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r2.isDraftActive);
} }
function GameRankingsComponent_div_17_p_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 24);
    i0.ɵɵtext(1, "Add games to create your ranking.");
    i0.ɵɵelementEnd();
} }
function GameRankingsComponent_div_17_p_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.selectedWeekday ? "No available games on " + ctx_r2.selectedWeekday + "." : "No available games.", " ");
} }
function GameRankingsComponent_div_17_div_11_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26);
    i0.ɵɵelement(1, "img", 19);
    i0.ɵɵelementStart(2, "div", 20)(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "date");
    i0.ɵɵpipe(8, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 27);
    i0.ɵɵlistener("click", function GameRankingsComponent_div_17_div_11_Template_button_click_9_listener() { const game_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.add(game_r9)); });
    i0.ɵɵelementStart(10, "mat-icon");
    i0.ɵɵtext(11, "add");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(12, " Add ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const game_r9 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", "assets/" + game_r9.opponent.logoUrl, i0.ɵɵsanitizeUrl)("alt", game_r9.opponent.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(game_r9.opponent.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind3(7, 6, game_r9.gameDateTime, "EEE, MMM d, y", "America/Chicago"), " \u00B7 ", i0.ɵɵpipeBind3(8, 10, game_r9.gameDateTime, "shortTime", "America/Chicago"), " ");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r2.isDraftActive);
} }
function GameRankingsComponent_div_17_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 10)(1, "div")(2, "h2");
    i0.ɵɵtext(3, "Ranked choices");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 11);
    i0.ɵɵlistener("cdkDropListDropped", function GameRankingsComponent_div_17_Template_div_cdkDropListDropped_4_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.drop($event)); });
    i0.ɵɵtemplate(5, GameRankingsComponent_div_17_div_5_Template, 21, 20, "div", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, GameRankingsComponent_div_17_p_6_Template, 2, 0, "p", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div")(8, "h2");
    i0.ɵɵtext(9, "Available games");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, GameRankingsComponent_div_17_p_10_Template, 2, 1, "p", 14)(11, GameRankingsComponent_div_17_div_11_Template, 13, 14, "div", 15);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("cdkDropListData", ctx_r2.rankedGames);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r2.rankedGames);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.rankedGames.length === 0);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r2.filteredAvailableGames.length === 0);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r2.filteredAvailableGames);
} }
export class GameRankingsComponent {
    rankingsService = inject(GameRankingsService);
    gamesService = inject(GamesService);
    seasonService = inject(SeasonService);
    draftService = inject(DraftService);
    toast = inject(ToastService);
    destroyRef = inject(DestroyRef);
    dialog = inject(MatDialog);
    rankedGames = [];
    availableGames = [];
    isDraftActive = false;
    loading = true;
    saving = false;
    weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    selectedWeekday = null;
    weekdayFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        timeZone: 'America/Chicago'
    });
    get filteredAvailableGames() {
        if (this.selectedWeekday === null)
            return this.availableGames;
        return this.availableGames.filter(game => this.weekdayFormatter.format(new Date(game.gameDateTime)) === this.selectedWeekday);
    }
    ngOnInit() {
        const seasonId = this.seasonService.currentSeasonId;
        forkJoin({
            rankings: this.rankingsService.get(seasonId),
            games: this.gamesService.getSeasonGames(seasonId)
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({ rankings, games }) => {
                const gamesById = new Map(games.map(game => [game.gameId, game]));
                this.rankedGames = rankings
                    .filter(ranking => !ranking.isFulfilled && gamesById.has(ranking.gameId))
                    .map(ranking => ({ game: gamesById.get(ranking.gameId), quantity: ranking.quantity }));
                this.availableGames = games.filter(game => !this.rankedGames.some(ranking => ranking.game.gameId === game.gameId));
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.toast.error('Unable to load game rankings');
            }
        });
        this.draftService.draftStatus$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(status => this.isDraftActive = status?.isActive ?? false);
    }
    add(game) {
        if (this.isDraftActive)
            return;
        this.dialog.open(RankingQuantityDialogComponent, {
            data: game,
            width: '360px'
        }).afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(quantity => {
            if ((quantity !== 2 && quantity !== 4) || this.isDraftActive ||
                !this.availableGames.some(item => item.gameId === game.gameId))
                return;
            this.availableGames = this.availableGames.filter(item => item.gameId !== game.gameId);
            this.rankedGames.push({ game, quantity });
        });
    }
    remove(index) {
        if (this.isDraftActive)
            return;
        const [removed] = this.rankedGames.splice(index, 1);
        this.availableGames = [...this.availableGames, removed.game]
            .sort((a, b) => new Date(a.gameDateTime).getTime() - new Date(b.gameDateTime).getTime());
    }
    drop(event) {
        if (!this.isDraftActive)
            moveItemInArray(this.rankedGames, event.previousIndex, event.currentIndex);
    }
    save() {
        if (this.isDraftActive || this.saving)
            return;
        this.saving = true;
        this.rankingsService.replace(this.seasonService.currentSeasonId, this.rankedGames.map(item => ({ gameId: item.game.gameId, quantity: item.quantity }))).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.saving = false;
                this.toast.success('Game rankings saved');
            },
            error: () => {
                this.saving = false;
                this.toast.error('Unable to save game rankings');
            }
        });
    }
    static ɵfac = function GameRankingsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GameRankingsComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: GameRankingsComponent, selectors: [["app-game-rankings"]], decls: 18, vars: 8, consts: [[1, "rankings-page"], ["mat-flat-button", "", "color", "primary", 3, "click", "disabled"], ["role", "group", "aria-label", "Filter available games by weekday", 1, "weekday-filter"], [1, "filter-label"], [1, "weekday-options"], ["mat-stroked-button", "", 3, "click"], ["mat-stroked-button", "", 3, "selected", "click", 4, "ngFor", "ngForOf"], ["class", "notice", "role", "status", 4, "ngIf"], ["class", "columns", 4, "ngIf"], ["role", "status", 1, "notice"], [1, "columns"], ["cdkDropList", "", 1, "ranking-list", 3, "cdkDropListDropped", "cdkDropListData"], ["cdkDrag", "", "class", "game-row ranking-row", 3, "cdkDragDisabled", 4, "ngFor", "ngForOf"], ["class", "empty", 4, "ngIf"], ["class", "empty", "role", "status", 4, "ngIf"], ["class", "game-row available-row", 4, "ngFor", "ngForOf"], ["cdkDrag", "", 1, "game-row", "ranking-row", 3, "cdkDragDisabled"], ["cdkDragHandle", "", 1, "drag-handle"], [1, "rank"], [3, "src", "alt"], [1, "game-info"], ["aria-label", "Ticket quantity", 3, "valueChange", "value", "disabled"], [3, "value"], ["mat-icon-button", "", "aria-label", "Remove ranking", 3, "click", "disabled"], [1, "empty"], ["role", "status", 1, "empty"], [1, "game-row", "available-row"], ["mat-stroked-button", "", "color", "primary", 1, "add-button", 3, "click", "disabled"]], template: function GameRankingsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header")(2, "div")(3, "h1");
            i0.ɵɵtext(4, "My Game Rankings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "Choose 2 or 4 tickets when adding games, then drag them into your preferred order.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "button", 1);
            i0.ɵɵlistener("click", function GameRankingsComponent_Template_button_click_7_listener() { return ctx.save(); });
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 2)(10, "span", 3);
            i0.ɵɵtext(11, "Available games by day");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "div", 4)(13, "button", 5);
            i0.ɵɵlistener("click", function GameRankingsComponent_Template_button_click_13_listener() { return ctx.selectedWeekday = null; });
            i0.ɵɵtext(14, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(15, GameRankingsComponent_button_15_Template, 2, 4, "button", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(16, GameRankingsComponent_div_16_Template, 2, 0, "div", 7)(17, GameRankingsComponent_div_17_Template, 12, 5, "div", 8);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("disabled", ctx.loading || ctx.saving || ctx.isDraftActive);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.saving ? "Saving\u2026" : "Save rankings", " ");
            i0.ɵɵadvance(5);
            i0.ɵɵclassProp("selected", ctx.selectedWeekday === null);
            i0.ɵɵattribute("aria-pressed", ctx.selectedWeekday === null);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngForOf", ctx.weekdays);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.isDraftActive);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading);
        } }, dependencies: [CommonModule, i1.NgForOf, i1.NgIf, i1.DatePipe, FormsModule,
            DragDropModule, i2.CdkDropList, i2.CdkDrag, i2.CdkDragHandle, MatButtonModule, i3.MatButton, i3.MatIconButton, MatIconModule, i4.MatIcon, MatSelectModule, i5.MatSelect, i5.MatOption, MatDialogModule], styles: [".rankings-page[_ngcontent-%COMP%] { padding: .75rem; max-width: 1200px; margin: 0 auto; }\nheader[_ngcontent-%COMP%] { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 1rem; }\nheader[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] { margin: 0 0 .2rem; }\nh2[_ngcontent-%COMP%] { margin: 0 0 .5rem; font-size: 1.25rem; }\nheader[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin-top: 0; color: #666; }\n.notice[_ngcontent-%COMP%] { padding: 1rem; margin-bottom: 1rem; background: #fff3cd; }\n.weekday-filter[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  padding: .75rem;\n  margin-bottom: 1rem;\n  border-radius: 8px;\n  background: #fff8f0;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, .15);\n}\n.filter-label[_ngcontent-%COMP%] { display: block; margin-bottom: .5rem; font-size: .85rem; font-weight: 600; }\n.weekday-options[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: .375rem; }\n.weekday-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { min-width: 0; min-height: 44px; padding: 0 .25rem; }\n.weekday-options[_ngcontent-%COMP%]   button.selected[_ngcontent-%COMP%] { background: #1976d2; color: white; border-color: #1976d2; }\n.columns[_ngcontent-%COMP%] { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; align-items: start; }\n.columns[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] { min-width: 0; }\n.ranking-list[_ngcontent-%COMP%] { min-height: 4rem; }\n.ranking-list[_ngcontent-%COMP%]:empty { min-height: 0; }\n.game-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: .5rem;\n  min-height: 48px;\n  padding: .35rem .5rem;\n  border-bottom: 1px solid rgba(0, 0, 0, .12);\n  background: rgba(255, 255, 255, .82);\n}\n.game-row[_ngcontent-%COMP%]:first-child { border-radius: 6px 6px 0 0; }\n.game-row[_ngcontent-%COMP%]:last-child { border-bottom: 0; border-radius: 0 0 6px 6px; }\n.game-row[_ngcontent-%COMP%]:only-child { border-radius: 6px; }\n.game-row[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] { width: 32px; height: 32px; flex: 0 0 32px; object-fit: contain; }\n.drag-handle[_ngcontent-%COMP%] { color: #777; cursor: grab; }\n.rank[_ngcontent-%COMP%] { font-weight: 700; width: 1.25rem; text-align: center; }\n.game-info[_ngcontent-%COMP%] { display: flex; flex: 1; min-width: 0; flex-wrap: wrap; align-items: baseline; gap: .25rem .5rem; }\n.game-info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.game-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { color: #666; font-size: .85rem; line-height: 1.4; }\n.empty[_ngcontent-%COMP%] { color: #666; }\nmat-select[_ngcontent-%COMP%] { width: 96px; flex: 0 0 96px; font-size: .9rem; }\n.game-row[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { flex: 0 0 auto; }\n.add-button[_ngcontent-%COMP%] { height: 34px; padding: 0 .75rem; border-radius: 6px; }\n.cdk-drag-preview[_ngcontent-%COMP%] { box-shadow: 0 8px 20px rgba(0, 0, 0, .25); }\n.cdk-drag-placeholder[_ngcontent-%COMP%] { opacity: .25; }\n@media (max-width: 600px) {\n  //[_ngcontent-%COMP%]   Mobile[_ngcontent-%COMP%]   uses[_ngcontent-%COMP%]   document[_ngcontent-%COMP%]   scrolling[_ngcontent-%COMP%], beneath[_ngcontent-%COMP%]   the[_ngcontent-%COMP%]   56px[_ngcontent-%COMP%]   Material[_ngcontent-%COMP%]   toolbar.\n[_ngcontent-%COMP%]   .weekday-filter[_ngcontent-%COMP%] { top: 56px; }\n}\n@media (max-width: 720px) {\n  .weekday-options[_ngcontent-%COMP%] { grid-template-columns: repeat(4, minmax(0, 1fr)); }\n  .rankings-page[_ngcontent-%COMP%] { padding: .5rem; }\n  header[_ngcontent-%COMP%] { align-items: flex-start; flex-direction: column; gap: .5rem; }\n  header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] { font-size: 1.5rem; }\n  header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin-bottom: .5rem; font-size: .9rem; }\n  .columns[_ngcontent-%COMP%] { grid-template-columns: minmax(0, 1fr); }\n  .game-info[_ngcontent-%COMP%] { flex-direction: column; gap: 0; }\n  .game-info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { max-width: 100%; }\n  .game-row[_ngcontent-%COMP%] { padding: .5rem; }\n  .ranking-row[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: 24px 1.25rem 32px minmax(0, 1fr) 48px;\n    gap: .25rem .375rem;\n  }\n  .ranking-row[_ngcontent-%COMP%]   .drag-handle[_ngcontent-%COMP%] { grid-column: 1; grid-row: 1 / 3; }\n  .ranking-row[_ngcontent-%COMP%]   .rank[_ngcontent-%COMP%] { grid-column: 2; grid-row: 1 / 3; }\n  .ranking-row[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] { grid-column: 3; grid-row: 1; }\n  .ranking-row[_ngcontent-%COMP%]   .game-info[_ngcontent-%COMP%] { grid-column: 4 / 6; grid-row: 1; }\n  .ranking-row[_ngcontent-%COMP%]   mat-select[_ngcontent-%COMP%] { grid-column: 4; grid-row: 2; min-height: 44px; display: flex; align-items: center; }\n  .ranking-row[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { grid-column: 5; grid-row: 2; }\n  .available-row[_ngcontent-%COMP%] { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; }\n  .add-button[_ngcontent-%COMP%] { min-height: 44px; padding: 0 .5rem; }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GameRankingsComponent, [{
        type: Component,
        args: [{ selector: 'app-game-rankings', standalone: true, imports: [
                    CommonModule,
                    FormsModule,
                    DragDropModule,
                    MatButtonModule,
                    MatIconModule,
                    MatSelectModule,
                    MatDialogModule
                ], template: "<section class=\"rankings-page\">\n  <header>\n    <div>\n      <h1>My Game Rankings</h1>\n      <p>Choose 2 or 4 tickets when adding games, then drag them into your preferred order.</p>\n    </div>\n    <button mat-flat-button color=\"primary\" (click)=\"save()\"\n      [disabled]=\"loading || saving || isDraftActive\">\n      {{ saving ? 'Saving\u2026' : 'Save rankings' }}\n    </button>\n  </header>\n\n  <div class=\"weekday-filter\" role=\"group\" aria-label=\"Filter available games by weekday\">\n    <span class=\"filter-label\">Available games by day</span>\n    <div class=\"weekday-options\">\n      <button mat-stroked-button [class.selected]=\"selectedWeekday === null\"\n        [attr.aria-pressed]=\"selectedWeekday === null\" (click)=\"selectedWeekday = null\">All</button>\n      <button *ngFor=\"let day of weekdays\" mat-stroked-button\n        [class.selected]=\"selectedWeekday === day\" [attr.aria-pressed]=\"selectedWeekday === day\"\n        (click)=\"selectedWeekday = day\">{{ day }}</button>\n    </div>\n  </div>\n\n  <div *ngIf=\"isDraftActive\" class=\"notice\" role=\"status\">\n    The draft has started, so rankings are now locked.\n  </div>\n\n  <div *ngIf=\"!loading\" class=\"columns\">\n    <div>\n      <h2>Ranked choices</h2>\n      <div cdkDropList [cdkDropListData]=\"rankedGames\" (cdkDropListDropped)=\"drop($event)\" class=\"ranking-list\">\n        <div *ngFor=\"let item of rankedGames; let index = index\" cdkDrag\n          [cdkDragDisabled]=\"isDraftActive\" class=\"game-row ranking-row\">\n          <mat-icon cdkDragHandle class=\"drag-handle\">drag_indicator</mat-icon>\n          <span class=\"rank\">{{ index + 1 }}</span>\n          <img [src]=\"'assets/' + item.game.opponent.logoUrl\" [alt]=\"item.game.opponent.name\" />\n          <div class=\"game-info\">\n            <strong>{{ item.game.opponent.name }}</strong>\n            <span>\n              {{ item.game.gameDateTime | date:'EEE, MMM d, y':'America/Chicago' }} \u00B7\n              {{ item.game.gameDateTime | date:'shortTime':'America/Chicago' }}\n            </span>\n          </div>\n          <mat-select [(value)]=\"item.quantity\" [disabled]=\"isDraftActive\" aria-label=\"Ticket quantity\">\n            <mat-option [value]=\"2\">2 tickets</mat-option>\n            <mat-option [value]=\"4\">4 tickets</mat-option>\n          </mat-select>\n          <button mat-icon-button (click)=\"remove(index)\" [disabled]=\"isDraftActive\" aria-label=\"Remove ranking\">\n            <mat-icon>close</mat-icon>\n          </button>\n        </div>\n      </div>\n      <p *ngIf=\"rankedGames.length === 0\" class=\"empty\">Add games to create your ranking.</p>\n    </div>\n\n    <div>\n      <h2>Available games</h2>\n      <p *ngIf=\"filteredAvailableGames.length === 0\" class=\"empty\" role=\"status\">\n        {{ selectedWeekday ? 'No available games on ' + selectedWeekday + '.' : 'No available games.' }}\n      </p>\n      <div *ngFor=\"let game of filteredAvailableGames\" class=\"game-row available-row\">\n        <img [src]=\"'assets/' + game.opponent.logoUrl\" [alt]=\"game.opponent.name\" />\n        <div class=\"game-info\">\n          <strong>{{ game.opponent.name }}</strong>\n          <span>\n            {{ game.gameDateTime | date:'EEE, MMM d, y':'America/Chicago' }} \u00B7\n            {{ game.gameDateTime | date:'shortTime':'America/Chicago' }}\n          </span>\n        </div>\n        <button mat-stroked-button color=\"primary\" class=\"add-button\"\n          (click)=\"add(game)\" [disabled]=\"isDraftActive\">\n          <mat-icon>add</mat-icon> Add\n        </button>\n      </div>\n    </div>\n  </div>\n</section>\n", styles: [".rankings-page { padding: .75rem; max-width: 1200px; margin: 0 auto; }\nheader { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 1rem; }\nheader h1 { margin: 0 0 .2rem; }\nh2 { margin: 0 0 .5rem; font-size: 1.25rem; }\nheader p { margin-top: 0; color: #666; }\n.notice { padding: 1rem; margin-bottom: 1rem; background: #fff3cd; }\n.weekday-filter {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  padding: .75rem;\n  margin-bottom: 1rem;\n  border-radius: 8px;\n  background: #fff8f0;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, .15);\n}\n.filter-label { display: block; margin-bottom: .5rem; font-size: .85rem; font-weight: 600; }\n.weekday-options { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: .375rem; }\n.weekday-options button { min-width: 0; min-height: 44px; padding: 0 .25rem; }\n.weekday-options button.selected { background: #1976d2; color: white; border-color: #1976d2; }\n.columns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; align-items: start; }\n.columns > div { min-width: 0; }\n.ranking-list { min-height: 4rem; }\n.ranking-list:empty { min-height: 0; }\n.game-row {\n  display: flex;\n  align-items: center;\n  gap: .5rem;\n  min-height: 48px;\n  padding: .35rem .5rem;\n  border-bottom: 1px solid rgba(0, 0, 0, .12);\n  background: rgba(255, 255, 255, .82);\n}\n.game-row:first-child { border-radius: 6px 6px 0 0; }\n.game-row:last-child { border-bottom: 0; border-radius: 0 0 6px 6px; }\n.game-row:only-child { border-radius: 6px; }\n.game-row img { width: 32px; height: 32px; flex: 0 0 32px; object-fit: contain; }\n.drag-handle { color: #777; cursor: grab; }\n.rank { font-weight: 700; width: 1.25rem; text-align: center; }\n.game-info { display: flex; flex: 1; min-width: 0; flex-wrap: wrap; align-items: baseline; gap: .25rem .5rem; }\n.game-info strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.game-info span { color: #666; font-size: .85rem; line-height: 1.4; }\n.empty { color: #666; }\nmat-select { width: 96px; flex: 0 0 96px; font-size: .9rem; }\n.game-row button { flex: 0 0 auto; }\n.add-button { height: 34px; padding: 0 .75rem; border-radius: 6px; }\n.cdk-drag-preview { box-shadow: 0 8px 20px rgba(0, 0, 0, .25); }\n.cdk-drag-placeholder { opacity: .25; }\n@media (max-width: 600px) {\n  // Mobile uses document scrolling, beneath the 56px Material toolbar.\n  .weekday-filter { top: 56px; }\n}\n@media (max-width: 720px) {\n  .weekday-options { grid-template-columns: repeat(4, minmax(0, 1fr)); }\n  .rankings-page { padding: .5rem; }\n  header { align-items: flex-start; flex-direction: column; gap: .5rem; }\n  header h1 { font-size: 1.5rem; }\n  header p { margin-bottom: .5rem; font-size: .9rem; }\n  .columns { grid-template-columns: minmax(0, 1fr); }\n  .game-info { flex-direction: column; gap: 0; }\n  .game-info strong { max-width: 100%; }\n  .game-row { padding: .5rem; }\n  .ranking-row {\n    display: grid;\n    grid-template-columns: 24px 1.25rem 32px minmax(0, 1fr) 48px;\n    gap: .25rem .375rem;\n  }\n  .ranking-row .drag-handle { grid-column: 1; grid-row: 1 / 3; }\n  .ranking-row .rank { grid-column: 2; grid-row: 1 / 3; }\n  .ranking-row img { grid-column: 3; grid-row: 1; }\n  .ranking-row .game-info { grid-column: 4 / 6; grid-row: 1; }\n  .ranking-row mat-select { grid-column: 4; grid-row: 2; min-height: 44px; display: flex; align-items: center; }\n  .ranking-row button { grid-column: 5; grid-row: 2; }\n  .available-row { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; }\n  .add-button { min-height: 44px; padding: 0 .5rem; }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(GameRankingsComponent, { className: "GameRankingsComponent", filePath: "src/app/pages/game-rankings/game-rankings.component.ts", lineNumber: 39 }); })();
