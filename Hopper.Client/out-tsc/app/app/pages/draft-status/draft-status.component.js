import { AllotmentEditorComponent } from '../../components/allotment-editor/allotment-editor.component';
import { StevenCounterComponent } from '../../components/steven-counter/steven-counter.component';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import * as i0 from "@angular/core";
import * as i1 from "@services/draft.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/card";
import * as i4 from "@angular/material/table";
import * as i5 from "@angular/material/list";
function DraftStatusComponent_mat_list_item_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-list-item")(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r1 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("#", pick_r1.pickOrder, "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" - ", pick_r1.displayName || pick_r1.firebaseUserId, " ");
} }
function DraftStatusComponent_mat_list_item_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-list-item")(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementStart(4, "span", 11);
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const pick_r2 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("#", pick_r2.pickOrder, "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" - ", pick_r2.firebaseUserId || pick_r2.firebaseUserId, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("(", i0.ɵɵpipeBind2(6, 3, pick_r2.claimedUtc, "short"), ")");
} }
function DraftStatusComponent_th_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 12);
    i0.ɵɵtext(1, "Name");
    i0.ɵɵelementEnd();
} }
function DraftStatusComponent_td_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r3.displayName);
} }
function DraftStatusComponent_th_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 12);
    i0.ɵɵtext(1, "Allotment");
    i0.ɵɵelementEnd();
} }
function DraftStatusComponent_td_21_app_allotment_editor_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-allotment-editor", 15);
} if (rf & 2) {
    const u_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵproperty("user", u_r4)("status", ctx_r4.status);
} }
function DraftStatusComponent_td_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 13);
    i0.ɵɵtemplate(1, DraftStatusComponent_td_21_app_allotment_editor_1_Template, 1, 2, "app-allotment-editor", 14);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r4.status);
} }
function DraftStatusComponent_th_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 12);
    i0.ɵɵtext(1, "Picked");
    i0.ɵɵelementEnd();
} }
function DraftStatusComponent_td_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r6.picked);
} }
function DraftStatusComponent_th_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 12);
    i0.ɵɵtext(1, "Remaining");
    i0.ɵɵelementEnd();
} }
function DraftStatusComponent_td_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r7.remaining);
} }
function DraftStatusComponent_tr_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 16);
} }
function DraftStatusComponent_tr_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 17);
} }
export class DraftStatusComponent {
    draftService;
    destroyRef = inject(DestroyRef);
    status = null;
    displayedColumns = ['displayName', 'allotment', 'picked', 'remaining'];
    constructor(draftService) {
        this.draftService = draftService;
    }
    ngOnInit() {
        this.loadStatus();
    }
    loadStatus() {
        this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
            this.status = status;
        });
    }
    get upcoming() {
        return this.status?.upcoming ?? [];
    }
    get history() {
        return this.status?.history ?? [];
    }
    get users() {
        return this.status?.users ?? [];
    }
    static ɵfac = function DraftStatusComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DraftStatusComponent)(i0.ɵɵdirectiveInject(i1.DraftService)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DraftStatusComponent, selectors: [["app-draft-status"]], decls: 30, vars: 5, consts: [[1, "draft-status"], [4, "ngFor", "ngForOf"], ["mat-table", "", 1, "mat-elevation-z1", 3, "dataSource"], ["matColumnDef", "displayName"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "allotment"], ["matColumnDef", "picked"], ["matColumnDef", "remaining"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [1, "time"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "user", "status", 4, "ngIf"], [3, "user", "status"], ["mat-header-row", ""], ["mat-row", ""]], template: function DraftStatusComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "app-steven-counter");
            i0.ɵɵelementStart(1, "div", 0)(2, "mat-card")(3, "mat-card-title");
            i0.ɵɵtext(4, "Upcoming Picks");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "mat-list");
            i0.ɵɵtemplate(6, DraftStatusComponent_mat_list_item_6_Template, 4, 2, "mat-list-item", 1);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "mat-card")(8, "mat-card-title");
            i0.ɵɵtext(9, "Pick History");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "mat-list");
            i0.ɵɵtemplate(11, DraftStatusComponent_mat_list_item_11_Template, 7, 6, "mat-list-item", 1);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "mat-card")(13, "mat-card-title");
            i0.ɵɵtext(14, "Participants Progress");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "table", 2);
            i0.ɵɵelementContainerStart(16, 3);
            i0.ɵɵtemplate(17, DraftStatusComponent_th_17_Template, 2, 0, "th", 4)(18, DraftStatusComponent_td_18_Template, 2, 1, "td", 5);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(19, 6);
            i0.ɵɵtemplate(20, DraftStatusComponent_th_20_Template, 2, 0, "th", 4)(21, DraftStatusComponent_td_21_Template, 2, 1, "td", 5);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(22, 7);
            i0.ɵɵtemplate(23, DraftStatusComponent_th_23_Template, 2, 0, "th", 4)(24, DraftStatusComponent_td_24_Template, 2, 1, "td", 5);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(25, 8);
            i0.ɵɵtemplate(26, DraftStatusComponent_th_26_Template, 2, 0, "th", 4)(27, DraftStatusComponent_td_27_Template, 2, 1, "td", 5);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(28, DraftStatusComponent_tr_28_Template, 1, 0, "tr", 9)(29, DraftStatusComponent_tr_29_Template, 1, 0, "tr", 10);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngForOf", ctx.upcoming);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.history);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("dataSource", ctx.users);
            i0.ɵɵadvance(13);
            i0.ɵɵproperty("matHeaderRowDef", ctx.displayedColumns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.displayedColumns);
        } }, dependencies: [AllotmentEditorComponent, StevenCounterComponent, CommonModule, i2.NgForOf, i2.NgIf, i2.DatePipe, MatCardModule, i3.MatCard, i3.MatCardTitle, MatTableModule, i4.MatTable, i4.MatHeaderCellDef, i4.MatHeaderRowDef, i4.MatColumnDef, i4.MatCellDef, i4.MatRowDef, i4.MatHeaderCell, i4.MatCell, i4.MatHeaderRow, i4.MatRow, MatListModule, i5.MatList, i5.MatListItem, MatDividerModule], styles: [".draft-status[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: 1fr;\n}\n\nmat-card[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.time[_ngcontent-%COMP%] {\n  margin-left: auto;\n  font-size: 0.8rem;\n  opacity: 0.7;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DraftStatusComponent, [{
        type: Component,
        args: [{ selector: 'app-draft-status', standalone: true, imports: [AllotmentEditorComponent, StevenCounterComponent, CommonModule, MatCardModule, MatTableModule, MatListModule, MatDividerModule], template: "<app-steven-counter></app-steven-counter>\n<div class=\"draft-status\">\n  <mat-card>\n    <mat-card-title>Upcoming Picks</mat-card-title>\n    <mat-list>\n      <mat-list-item *ngFor=\"let pick of upcoming\">\n        <strong>#{{ pick.pickOrder }}</strong> - {{ pick.displayName || pick.firebaseUserId }}\n      </mat-list-item>\n    </mat-list>\n  </mat-card>\n\n  <mat-card>\n    <mat-card-title>Pick History</mat-card-title>\n    <mat-list>\n      <mat-list-item *ngFor=\"let pick of history\">\n        <strong>#{{ pick.pickOrder }}</strong> - {{ pick.firebaseUserId || pick.firebaseUserId }}\n        <span class=\"time\">({{ pick.claimedUtc | date: 'short' }})</span>\n      </mat-list-item>\n    </mat-list>\n  </mat-card>\n\n  <mat-card>\n    <mat-card-title>Participants Progress</mat-card-title>\n    <table mat-table [dataSource]=\"users\" class=\"mat-elevation-z1\">\n      <ng-container matColumnDef=\"displayName\">\n        <th mat-header-cell *matHeaderCellDef>Name</th>\n        <td mat-cell *matCellDef=\"let u\">{{ u.displayName }}</td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"allotment\">\n        <th mat-header-cell *matHeaderCellDef>Allotment</th>\n        <td mat-cell *matCellDef=\"let u\"><app-allotment-editor *ngIf=\"status\" [user]=\"u\" [status]=\"status\"></app-allotment-editor></td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"picked\">\n        <th mat-header-cell *matHeaderCellDef>Picked</th>\n        <td mat-cell *matCellDef=\"let u\">{{ u.picked }}</td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"remaining\">\n        <th mat-header-cell *matHeaderCellDef>Remaining</th>\n        <td mat-cell *matCellDef=\"let u\">{{ u.remaining }}</td>\n      </ng-container>\n\n      <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\n      <tr mat-row *matRowDef=\"let row; columns: displayedColumns\"></tr>\n    </table>\n  </mat-card>\n</div>", styles: [".draft-status {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: 1fr;\n}\n\nmat-card {\n  padding: 1rem;\n}\n\ntable {\n  width: 100%;\n}\n\n.time {\n  margin-left: auto;\n  font-size: 0.8rem;\n  opacity: 0.7;\n}"] }]
    }], () => [{ type: i1.DraftService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DraftStatusComponent, { className: "DraftStatusComponent", filePath: "src/app/pages/draft-status/draft-status.component.ts", lineNumber: 21 }); })();
