import { Component, DestroyRef, Input, Inject, Output, EventEmitter, Optional, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DraftService } from '@services/draft.service';
import { combineLatest } from 'rxjs';
import { SplitPickDialogComponent } from '@components/split-pick-dialog/split-pick-dialog.component';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import * as i0 from "@angular/core";
import * as i1 from "@services/selections.service";
import * as i2 from "@services/toast.service";
import * as i3 from "@services/games.service";
import * as i4 from "@services/auth.service";
import * as i5 from "@services/season.service";
import * as i6 from "@angular/common";
import * as i7 from "@angular/material/card";
import * as i8 from "@angular/material/button";
import * as i9 from "@angular/material/icon";
import * as i10 from "@angular/material/menu";
function GameCardComponent_div_15_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sel_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", sel_r1.displayName || sel_r1.firebaseUserId, " picked ", sel_r1.quantity, " ");
} }
function GameCardComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtemplate(1, GameCardComponent_div_15_div_1_Template, 2, 2, "div", 15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.game.selections);
} }
function GameCardComponent_mat_card_actions_18_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-card-actions")(1, "button", 16);
    i0.ɵɵlistener("click", function GameCardComponent_mat_card_actions_18_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.pick(2)); });
    i0.ɵɵtext(2, " Pick 2 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 17);
    i0.ɵɵtext(4, " Pick 4 ");
    i0.ɵɵelementStart(5, "mat-icon");
    i0.ɵɵtext(6, "arrow_drop_down");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "mat-menu", null, 0)(9, "button", 18);
    i0.ɵɵlistener("click", function GameCardComponent_mat_card_actions_18_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.pick(4)); });
    i0.ɵɵelementStart(10, "mat-icon");
    i0.ɵɵtext(11, "check");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span");
    i0.ɵɵtext(13, "Pick 4");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "button", 18);
    i0.ɵɵlistener("click", function GameCardComponent_mat_card_actions_18_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openSplitDialog(ctx_r1.game)); });
    i0.ɵɵelementStart(15, "mat-icon");
    i0.ɵɵtext(16, "call_split");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span");
    i0.ɵɵtext(18, "Split 4");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const pick4Menu_r4 = i0.ɵɵreference(8);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.game.remainingTickets < 2 || !ctx_r1.draftIsActive);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("matMenuTriggerFor", pick4Menu_r4)("disabled", ctx_r1.game.remainingTickets < 4 || !ctx_r1.draftIsActive || ctx_r1.CurrentPickerRemainingTickets < 4);
} }
function GameCardComponent_div_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19);
    i0.ɵɵtext(1, " Draft isn\u2019t active yet. Please wait for the admin to start. ");
    i0.ɵɵelementEnd();
} }
function GameCardComponent_div_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19);
    i0.ɵɵtext(1, " You only have two tickets remaining ");
    i0.ɵɵelementEnd();
} }
export class GameCardComponent {
    selectionsService;
    toastService;
    gamesService;
    authService;
    seasonService;
    data;
    game;
    gameUpdated = new EventEmitter();
    draftService = inject(DraftService);
    dialog = inject(MatDialog);
    destroyRef = inject(DestroyRef);
    participant;
    draftStatus;
    constructor(selectionsService, toastService, gamesService, authService, seasonService, data) {
        this.selectionsService = selectionsService;
        this.toastService = toastService;
        this.gamesService = gamesService;
        this.authService = authService;
        this.seasonService = seasonService;
        this.data = data;
        if (data?.game) {
            this.game = data.game;
        }
    }
    ngOnInit() {
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
    get draftIsActive() {
        if (this.draftStatus) {
            return this.draftStatus.isActive;
        }
        return false;
    }
    get canSelect() {
        const nextPick = this.draftStatus?.upcoming?.[0];
        return !!this.participant
            && !!nextPick
            && (this.participant.isAdmin || nextPick.firebaseUserId === this.participant.firebaseUserId);
    }
    get CurrentPickerRemainingTickets() {
        const nextPickUserId = this.draftStatus?.upcoming?.[0]?.firebaseUserId;
        if (!nextPickUserId)
            return 0;
        return this.draftStatus?.users?.find(u => u.firebaseUserId === nextPickUserId)?.remaining ?? 0;
    }
    pick(quantity, splitUserId = undefined) {
        if (!this.game)
            return;
        const nextPick = this.draftStatus?.upcoming?.[0];
        if (!nextPick) {
            this.toastService.error('No upcoming draft pick is available');
            return;
        }
        let selections = [{
                draftPickId: nextPick.draftPickId,
                firebaseUserId: nextPick.firebaseUserId,
                gameId: this.game.gameId,
                displayName: nextPick.displayName,
                quantity,
                pickedUtc: new Date().toISOString(),
            }];
        if (splitUserId) {
            const splitSelection = {
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
    openSplitDialog(game) {
        // Filter participants with tickets remaining > 0
        const dialogRef = this.dialog.open(SplitPickDialogComponent, {
            width: '95vw',
            data: { game: game, participant: this.participant },
        });
        dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
            if (result) {
                this.pick(2, result.splitUserId); // call pick with split target
            }
        });
    }
    static ɵfac = function GameCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GameCardComponent)(i0.ɵɵdirectiveInject(i1.SelectionsService), i0.ɵɵdirectiveInject(i2.ToastService), i0.ɵɵdirectiveInject(i3.GamesService), i0.ɵɵdirectiveInject(i4.AuthService), i0.ɵɵdirectiveInject(i5.SeasonService), i0.ɵɵdirectiveInject(MAT_DIALOG_DATA, 8)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: GameCardComponent, selectors: [["app-game-card"]], inputs: { game: "game" }, outputs: { gameUpdated: "gameUpdated" }, decls: 25, vars: 15, consts: [["pick4Menu", "matMenu"], [1, "ticket-card"], [1, "ticket-content"], [1, "team", "thunder"], ["src", "assets/thunder.png", "alt", "Thunder Logo"], [1, "team-name"], [1, "game-center"], [1, "vs-badge"], [1, "game-details"], ["class", "picks", 4, "ngIf"], [4, "ngIf"], ["class", "draft-warning", 4, "ngIf"], [1, "team", "opponent"], [3, "src", "alt"], [1, "picks"], [4, "ngFor", "ngForOf"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["mat-raised-button", "", "color", "accent", 3, "matMenuTriggerFor", "disabled"], ["mat-menu-item", "", 3, "click"], [1, "draft-warning"]], template: function GameCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "mat-card", 1)(1, "div", 2)(2, "div", 3);
            i0.ɵɵelement(3, "img", 4);
            i0.ɵɵelementStart(4, "span", 5);
            i0.ɵɵtext(5, "Thunder");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 6)(7, "div", 7);
            i0.ɵɵtext(8, "VS");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "div", 8)(10, "mat-card-title");
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-card-subtitle");
            i0.ɵɵtext(13);
            i0.ɵɵpipe(14, "date");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(15, GameCardComponent_div_15_Template, 2, 1, "div", 9);
            i0.ɵɵelementStart(16, "p");
            i0.ɵɵtext(17);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(18, GameCardComponent_mat_card_actions_18_Template, 19, 3, "mat-card-actions", 10)(19, GameCardComponent_div_19_Template, 2, 0, "div", 11)(20, GameCardComponent_div_20_Template, 2, 0, "div", 11);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(21, "div", 12);
            i0.ɵɵelement(22, "img", 13);
            i0.ɵɵelementStart(23, "span", 5);
            i0.ɵɵtext(24);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.game.opponent.name);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind3(14, 11, ctx.game.gameDateTime, "short", "America/Chicago"), " - ", ctx.game.arena, " ");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.game.selections.length > 0);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("Remaining tickets: ", ctx.game.remainingTickets, "");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.game.remainingTickets > 0 && ctx.canSelect);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.draftIsActive);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.draftIsActive && ctx.CurrentPickerRemainingTickets < 4 && ctx.game.remainingTickets >= 4);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("src", "assets/" + ctx.game.opponent.logoUrl, i0.ɵɵsanitizeUrl)("alt", ctx.game.opponent.name);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.game.opponent.name);
        } }, dependencies: [CommonModule, i6.NgForOf, i6.NgIf, i6.DatePipe, MatCardModule, i7.MatCard, i7.MatCardActions, i7.MatCardSubtitle, i7.MatCardTitle, MatButtonModule, i8.MatButton, MatIconModule, i9.MatIcon, MatMenuModule, i10.MatMenu, i10.MatMenuItem, i10.MatMenuTrigger], styles: [".ticket-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  padding: 12px;\n}\n\n.ticket-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  padding: 12px;\n}\n\n.ticket-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.team[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 120px;\n\n  img {\n    max-height: 80px;\n    object-fit: contain;\n  }\n\n  .team-name {\n    font-weight: bold;\n    margin-top: 6px;\n    text-align: center;\n  }\n}\n\n.game-center[_ngcontent-%COMP%] {\n  flex: 1;\n  text-align: center;\n  position: relative;\n\n  .vs-badge {\n    background: #ff9800;\n    color: white;\n    font-weight: bold;\n    font-size: 1rem;\n    padding: 6px 12px;\n    border-radius: 50%;\n    display: inline-block;\n    margin-bottom: 8px;\n    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  }\n\n  .game-details {\n    mat-card-title {\n      font-size: 1.2rem;\n      font-weight: bold;\n    }\n\n    mat-card-subtitle {\n      margin-top: 4px;\n      font-size: 0.9rem;\n      color: #555;\n    }\n\n    p {\n      margin: 10px 0;\n      font-weight: 500;\n    }\n\n    mat-card-actions {\n      display: flex;\n      justify-content: center;\n      gap: 10px;\n    }\n  }\n}\n\n.draft-warning[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #b71c1c;\n}\n\n.team[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 120px;\n\n  img {\n    max-height: 80px;\n    object-fit: contain;\n  }\n\n  .team-name {\n    font-weight: bold;\n    margin-top: 6px;\n    text-align: center;\n  }\n}\n\n.game-center[_ngcontent-%COMP%] {\n  flex: 1;\n  text-align: center;\n  position: relative;\n\n  .vs-badge {\n    background: #ff9800;\n    color: white;\n    font-weight: bold;\n    font-size: 1rem;\n    padding: 6px 12px;\n    border-radius: 50%;\n    display: inline-block;\n    margin-bottom: 8px;\n    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  }\n\n  .game-details {\n    mat-card-title {\n      font-size: 1.2rem;\n      font-weight: bold;\n    }\n\n    mat-card-subtitle {\n      margin-top: 4px;\n      font-size: 0.9rem;\n      color: #555;\n    }\n\n    p {\n      margin: 10px 0;\n      font-weight: 500;\n    }\n\n    mat-card-actions {\n      display: flex;\n      justify-content: center;\n      gap: 10px;\n    }\n  }\n}\n\n.draft-warning[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #b71c1c;\n}\n\n\n.team[_ngcontent-%COMP%] {\n  width: 120px;\n\n  img {\n    max-height: 80px;\n  }\n}\n\n\n\n@media (max-width: 600px) {\n  .team[_ngcontent-%COMP%] {\n    width: 90px;\n\n    img {\n      max-height: 60px;\n    }\n\n    .team-name {\n      font-size: 0.85rem;\n    }\n  }\n\n  .game-center[_ngcontent-%COMP%]   .game-details[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n}\n\n\n\n@media (max-width: 430px) {\n  .team[_ngcontent-%COMP%] {\n    width: 70px;\n\n    img {\n      max-height: 50px;\n    }\n\n    .team-name {\n      font-size: 0.75rem;\n    }\n  }\n\n  .game-center[_ngcontent-%COMP%] {\n    .vs-badge {\n      font-size: 0.8rem;\n      padding: 4px 8px;\n    }\n\n    .game-details {\n      mat-card-title {\n        font-size: 0.9rem;\n      }\n      mat-card-subtitle {\n        font-size: 0.75rem;\n      }\n      p {\n        font-size: 0.8rem;\n      }\n    }\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GameCardComponent, [{
        type: Component,
        args: [{ selector: 'app-game-card', standalone: true, imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule], template: "<mat-card class=\"ticket-card\">\n  <div class=\"ticket-content\">\n    <!-- Left: Thunder -->\n    <div class=\"team thunder\">\n      <img src=\"assets/thunder.png\" alt=\"Thunder Logo\" />\n      <span class=\"team-name\">Thunder</span>\n    </div>\n\n    <!-- Middle: VS + details -->\n    <div class=\"game-center\">\n      <div class=\"vs-badge\">VS</div>\n      <div class=\"game-details\">\n        <mat-card-title>{{ game.opponent.name }}</mat-card-title>\n        <mat-card-subtitle>\n          {{ game.gameDateTime | date:'short':'America/Chicago' }} - {{ game.arena }}\n        </mat-card-subtitle>\n\n        <!-- Who picked -->\n        <div *ngIf=\"game.selections.length > 0\" class=\"picks\">\n          <div *ngFor=\"let sel of game.selections\">\n            {{ sel.displayName || sel.firebaseUserId }} picked {{ sel.quantity }}\n          </div>\n        </div>\n\n        <p>Remaining tickets: {{ game.remainingTickets }}</p>\n\n        <!-- Only show buttons if tickets remain -->\n        <mat-card-actions *ngIf=\"game.remainingTickets > 0 && canSelect\">\n          <button mat-raised-button color=\"primary\" (click)=\"pick(2)\"\n            [disabled]=\"game.remainingTickets < 2 || !draftIsActive\">\n            Pick 2\n          </button>\n          <!-- Pick 4 with split option -->\n          <button mat-raised-button color=\"accent\" [matMenuTriggerFor]=\"pick4Menu\"\n            [disabled]=\"game.remainingTickets < 4 || !draftIsActive || CurrentPickerRemainingTickets < 4\">\n            Pick 4\n            <mat-icon>arrow_drop_down</mat-icon>\n          </button>\n\n          <mat-menu #pick4Menu=\"matMenu\">\n            <button mat-menu-item (click)=\"pick(4)\">\n              <mat-icon>check</mat-icon>\n              <span>Pick 4</span>\n            </button>\n            <button mat-menu-item (click)=\"openSplitDialog(game)\">\n              <mat-icon>call_split</mat-icon>\n              <span>Split 4</span>\n            </button>\n          </mat-menu>\n        </mat-card-actions>\n\n        <div *ngIf=\"!draftIsActive\" class=\"draft-warning\">\n          Draft isn\u2019t active yet. Please wait for the admin to start.\n        </div>\n        <div *ngIf=\"draftIsActive && CurrentPickerRemainingTickets < 4 && game.remainingTickets >= 4\" class=\"draft-warning\">\n          You only have two tickets remaining\n        </div>\n      </div>\n    </div>\n\n    <!-- Right: Opponent -->\n    <div class=\"team opponent\">\n      <img [src]=\"'assets/' + game.opponent.logoUrl\" [alt]=\"game.opponent.name\" />\n      <span class=\"team-name\">{{ game.opponent.name }}</span>\n    </div>\n  </div>\n</mat-card>", styles: [".ticket-card {\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  padding: 12px;\n}\n\n.ticket-card {\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  padding: 12px;\n}\n\n.ticket-content {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.team {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 120px;\n\n  img {\n    max-height: 80px;\n    object-fit: contain;\n  }\n\n  .team-name {\n    font-weight: bold;\n    margin-top: 6px;\n    text-align: center;\n  }\n}\n\n.game-center {\n  flex: 1;\n  text-align: center;\n  position: relative;\n\n  .vs-badge {\n    background: #ff9800;\n    color: white;\n    font-weight: bold;\n    font-size: 1rem;\n    padding: 6px 12px;\n    border-radius: 50%;\n    display: inline-block;\n    margin-bottom: 8px;\n    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  }\n\n  .game-details {\n    mat-card-title {\n      font-size: 1.2rem;\n      font-weight: bold;\n    }\n\n    mat-card-subtitle {\n      margin-top: 4px;\n      font-size: 0.9rem;\n      color: #555;\n    }\n\n    p {\n      margin: 10px 0;\n      font-weight: 500;\n    }\n\n    mat-card-actions {\n      display: flex;\n      justify-content: center;\n      gap: 10px;\n    }\n  }\n}\n\n.draft-warning {\n  margin-top: 8px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #b71c1c;\n}\n\n.team {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 120px;\n\n  img {\n    max-height: 80px;\n    object-fit: contain;\n  }\n\n  .team-name {\n    font-weight: bold;\n    margin-top: 6px;\n    text-align: center;\n  }\n}\n\n.game-center {\n  flex: 1;\n  text-align: center;\n  position: relative;\n\n  .vs-badge {\n    background: #ff9800;\n    color: white;\n    font-weight: bold;\n    font-size: 1rem;\n    padding: 6px 12px;\n    border-radius: 50%;\n    display: inline-block;\n    margin-bottom: 8px;\n    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  }\n\n  .game-details {\n    mat-card-title {\n      font-size: 1.2rem;\n      font-weight: bold;\n    }\n\n    mat-card-subtitle {\n      margin-top: 4px;\n      font-size: 0.9rem;\n      color: #555;\n    }\n\n    p {\n      margin: 10px 0;\n      font-weight: 500;\n    }\n\n    mat-card-actions {\n      display: flex;\n      justify-content: center;\n      gap: 10px;\n    }\n  }\n}\n\n.draft-warning {\n  margin-top: 8px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #b71c1c;\n}\n/* Default (desktop/tablet) */\n.team {\n  width: 120px;\n\n  img {\n    max-height: 80px;\n  }\n}\n\n/* Medium screens: shrink logos a bit */\n@media (max-width: 600px) {\n  .team {\n    width: 90px;\n\n    img {\n      max-height: 60px;\n    }\n\n    .team-name {\n      font-size: 0.85rem;\n    }\n  }\n\n  .game-center .game-details mat-card-title {\n    font-size: 1rem;\n  }\n}\n\n/* Small screens (430px and below: Pro Max Safari) */\n@media (max-width: 430px) {\n  .team {\n    width: 70px;\n\n    img {\n      max-height: 50px;\n    }\n\n    .team-name {\n      font-size: 0.75rem;\n    }\n  }\n\n  .game-center {\n    .vs-badge {\n      font-size: 0.8rem;\n      padding: 4px 8px;\n    }\n\n    .game-details {\n      mat-card-title {\n        font-size: 0.9rem;\n      }\n      mat-card-subtitle {\n        font-size: 0.75rem;\n      }\n      p {\n        font-size: 0.8rem;\n      }\n    }\n  }\n}"] }]
    }], () => [{ type: i1.SelectionsService }, { type: i2.ToastService }, { type: i3.GamesService }, { type: i4.AuthService }, { type: i5.SeasonService }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], { game: [{
            type: Input
        }], gameUpdated: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(GameCardComponent, { className: "GameCardComponent", filePath: "src/app/components/game-card/game-card.component.ts", lineNumber: 30 }); })();
