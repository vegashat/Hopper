import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as i0 from "@angular/core";
import * as i1 from "../../services/draft.service";
import * as i2 from "@angular/material/table";
import * as i3 from "@angular/material/card";
import * as i4 from "@angular/material/progress-bar";
function ParticipantsComponent_th_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, " Name ");
    i0.ɵɵelementEnd();
} }
function ParticipantsComponent_td_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r1.displayName, " ");
} }
function ParticipantsComponent_th_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, " Email ");
    i0.ɵɵelementEnd();
} }
function ParticipantsComponent_td_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r2.email, " ");
} }
function ParticipantsComponent_th_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, " Picked ");
    i0.ɵɵelementEnd();
} }
function ParticipantsComponent_td_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r3.picked, " ");
} }
function ParticipantsComponent_th_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, " Allotment ");
    i0.ɵɵelementEnd();
} }
function ParticipantsComponent_td_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r4.allotment, " ");
} }
function ParticipantsComponent_th_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, " Remaining ");
    i0.ɵɵelementEnd();
} }
function ParticipantsComponent_td_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r5.remaining, " ");
} }
function ParticipantsComponent_th_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, " Last Pick ");
    i0.ɵɵelementEnd();
} }
function ParticipantsComponent_td_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r6 = ctx.$implicit;
    const ctx_r6 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r6.getPicksSinceLastPick(p_r6.firebaseUserId), " Picks ago");
} }
function ParticipantsComponent_th_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, " Longest Wait ");
    i0.ɵɵelementEnd();
} }
function ParticipantsComponent_td_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r8 = ctx.$implicit;
    const ctx_r6 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r6.getBiggestGapForUser(p_r8.firebaseUserId), " Picks");
} }
function ParticipantsComponent_th_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, " Progress ");
    i0.ɵɵelementEnd();
} }
function ParticipantsComponent_td_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵelement(1, "mat-progress-bar", 15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r9 = ctx.$implicit;
    const ctx_r6 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r6.getProgress(p_r9));
} }
function ParticipantsComponent_tr_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 16);
} }
function ParticipantsComponent_tr_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 17);
} }
export class ParticipantsComponent {
    draftService;
    destroyRef = inject(DestroyRef);
    participants = [];
    status;
    displayedColumns = ['displayName', 'picked', 'allotment', 'remaining', 'lastPick', 'longestWait', 'progress'];
    constructor(draftService) {
        this.draftService = draftService;
    }
    ngOnInit() {
        this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
            if (status && status.users) {
                this.status = status;
                this.participants = status.users ?? [];
            }
        });
    }
    getPicksSinceLastPick(firebaseUserId) {
        if (!this.status?.history || this.status.history.length === 0)
            return 0;
        // Find the last pick made by this user
        const lastPick = [...this.status.history]
            .reverse()
            .find(p => p.firebaseUserId === firebaseUserId);
        if (!lastPick) {
            // User hasn't picked yet → all picks count
            return this.status.history.length;
        }
        // Total picks since their last pick
        const picksAfter = this.status.history.filter(p => p.pickOrder > lastPick.pickOrder);
        return picksAfter.length;
    }
    getBiggestGapForUser(firebaseUserId) {
        // Filter picks that belong to the user
        const userPicks = this.status?.history
            .filter(p => p.firebaseUserId === firebaseUserId)
            .sort((a, b) => a.pickOrder - b.pickOrder);
        if (userPicks) {
            if (userPicks?.findIndex(u => u.firebaseUserId == firebaseUserId) < 0) {
                return 0;
            }
            if (userPicks.length < 2) {
                // If only one (or zero) picks, gap is total length since that pick
                return (this.status?.history.length ?? 0) - (userPicks[0]?.pickOrder ?? 0);
            }
            let maxGap = 0;
            for (let i = 1; i < userPicks.length; i++) {
                const prev = userPicks[i - 1].pickOrder;
                const current = userPicks[i].pickOrder;
                const gap = current - prev - 1; // picks in between
                if (gap > maxGap) {
                    maxGap = gap;
                }
            }
            // Optionally, include "gap since last pick until now"
            const gapSinceLast = (this.status?.history.length ?? 0) - userPicks[userPicks.length - 1].pickOrder;
            if (gapSinceLast > maxGap) {
                maxGap = gapSinceLast;
            }
            if (maxGap < 0) {
                return this.getPicksSinceLastPick(firebaseUserId);
            }
            else {
                return maxGap;
            }
        }
        return 0;
    }
    getProgress(p) {
        return p.allotment > 0 ? (p.picked / p.allotment) * 100 : 0;
    }
    static ɵfac = function ParticipantsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ParticipantsComponent)(i0.ɵɵdirectiveInject(i1.DraftService)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ParticipantsComponent, selectors: [["app-participants"]], decls: 30, vars: 3, consts: [["mat-table", "", 1, "mat-elevation-z2", "full-width", 3, "dataSource"], ["matColumnDef", "displayName"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "email"], ["matColumnDef", "picked"], ["matColumnDef", "allotment"], ["matColumnDef", "remaining"], ["matColumnDef", "lastPick"], ["matColumnDef", "longestWait"], ["matColumnDef", "progress"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["mode", "determinate", 3, "value"], ["mat-header-row", ""], ["mat-row", ""]], template: function ParticipantsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "mat-card")(1, "h2");
            i0.ɵɵtext(2, "Participants");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "table", 0);
            i0.ɵɵelementContainerStart(4, 1);
            i0.ɵɵtemplate(5, ParticipantsComponent_th_5_Template, 2, 0, "th", 2)(6, ParticipantsComponent_td_6_Template, 2, 1, "td", 3);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(7, 4);
            i0.ɵɵtemplate(8, ParticipantsComponent_th_8_Template, 2, 0, "th", 2)(9, ParticipantsComponent_td_9_Template, 2, 1, "td", 3);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(10, 5);
            i0.ɵɵtemplate(11, ParticipantsComponent_th_11_Template, 2, 0, "th", 2)(12, ParticipantsComponent_td_12_Template, 2, 1, "td", 3);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(13, 6);
            i0.ɵɵtemplate(14, ParticipantsComponent_th_14_Template, 2, 0, "th", 2)(15, ParticipantsComponent_td_15_Template, 2, 1, "td", 3);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(16, 7);
            i0.ɵɵtemplate(17, ParticipantsComponent_th_17_Template, 2, 0, "th", 2)(18, ParticipantsComponent_td_18_Template, 2, 1, "td", 3);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(19, 8);
            i0.ɵɵtemplate(20, ParticipantsComponent_th_20_Template, 2, 0, "th", 2)(21, ParticipantsComponent_td_21_Template, 2, 1, "td", 3);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(22, 9);
            i0.ɵɵtemplate(23, ParticipantsComponent_th_23_Template, 2, 0, "th", 2)(24, ParticipantsComponent_td_24_Template, 2, 1, "td", 3);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(25, 10);
            i0.ɵɵtemplate(26, ParticipantsComponent_th_26_Template, 2, 0, "th", 2)(27, ParticipantsComponent_td_27_Template, 2, 1, "td", 3);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(28, ParticipantsComponent_tr_28_Template, 1, 0, "tr", 11)(29, ParticipantsComponent_tr_29_Template, 1, 0, "tr", 12);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("dataSource", ctx.participants);
            i0.ɵɵadvance(25);
            i0.ɵɵproperty("matHeaderRowDef", ctx.displayedColumns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.displayedColumns);
        } }, dependencies: [CommonModule, MatTableModule, i2.MatTable, i2.MatHeaderCellDef, i2.MatHeaderRowDef, i2.MatColumnDef, i2.MatCellDef, i2.MatRowDef, i2.MatHeaderCell, i2.MatCell, i2.MatHeaderRow, i2.MatRow, MatCardModule, i3.MatCard, MatProgressBarModule, i4.MatProgressBar], styles: ["mat-card[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\nmat-header-cell[_ngcontent-%COMP%], mat-cell[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n}\n\nmat-progress-bar[_ngcontent-%COMP%] {\n  height: 12px;\n  border-radius: 6px;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ParticipantsComponent, [{
        type: Component,
        args: [{ selector: 'app-participants', standalone: true, imports: [CommonModule, MatTableModule, MatCardModule, MatProgressBarModule], template: "<mat-card>\n  <h2>Participants</h2>\n\n  <table mat-table [dataSource]=\"participants\" class=\"mat-elevation-z2 full-width\">\n\n    <!-- Name -->\n    <ng-container matColumnDef=\"displayName\">\n      <th mat-header-cell *matHeaderCellDef> Name </th>\n      <td mat-cell *matCellDef=\"let p\"> {{ p.displayName }} </td>\n    </ng-container>\n\n    <!-- Email -->\n    <ng-container matColumnDef=\"email\">\n      <th mat-header-cell *matHeaderCellDef> Email </th>\n      <td mat-cell *matCellDef=\"let p\"> {{ p.email }} </td>\n    </ng-container>\n\n    <!-- Picked -->\n    <ng-container matColumnDef=\"picked\">\n      <th mat-header-cell *matHeaderCellDef> Picked </th>\n      <td mat-cell *matCellDef=\"let p\"> {{ p.picked }} </td>\n    </ng-container>\n\n    <!-- Allotment -->\n    <ng-container matColumnDef=\"allotment\">\n      <th mat-header-cell *matHeaderCellDef> Allotment </th>\n      <td mat-cell *matCellDef=\"let p\"> {{ p.allotment }} </td>\n    </ng-container>\n\n    <!-- Remaining -->\n    <ng-container matColumnDef=\"remaining\">\n      <th mat-header-cell *matHeaderCellDef> Remaining </th>\n      <td mat-cell *matCellDef=\"let p\"> {{ p.remaining }} </td>\n    </ng-container>\n\n    <!-- Last Pick -->\n    <ng-container matColumnDef=\"lastPick\">\n      <th mat-header-cell *matHeaderCellDef> Last Pick </th>\n      <td mat-cell *matCellDef=\"let p\"> {{ getPicksSinceLastPick(p.firebaseUserId) }} Picks ago</td>\n    </ng-container>\n\n    <!-- Longest Wait -->\n    <ng-container matColumnDef=\"longestWait\">\n      <th mat-header-cell *matHeaderCellDef> Longest Wait </th>\n      <td mat-cell *matCellDef=\"let p\"> {{ getBiggestGapForUser(p.firebaseUserId) }} Picks</td>\n    </ng-container>\n\n    <!-- Progress -->\n    <ng-container matColumnDef=\"progress\">\n      <th mat-header-cell *matHeaderCellDef> Progress </th>\n      <td mat-cell *matCellDef=\"let p\">\n        <mat-progress-bar mode=\"determinate\" [value]=\"getProgress(p)\"></mat-progress-bar>\n      </td>\n    </ng-container>\n\n    <!-- Header & Row declarations -->\n    <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\n    <tr mat-row *matRowDef=\"let row; columns: displayedColumns\"></tr>\n  </table>\n</mat-card>", styles: ["mat-card {\n  padding: 1rem;\n}\n\ntable {\n  width: 100%;\n}\n\nmat-header-cell, mat-cell {\n  padding: 0.5rem 1rem;\n}\n\nmat-progress-bar {\n  height: 12px;\n  border-radius: 6px;\n}"] }]
    }], () => [{ type: i1.DraftService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ParticipantsComponent, { className: "ParticipantsComponent", filePath: "src/app/pages/participants/participants.component.ts", lineNumber: 19 }); })();
