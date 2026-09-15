// src/app/pages/progress.component.ts
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { SeasonService } from '@services/season.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/draft.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/card";
import * as i4 from "@angular/material/list";
function ProgressComponent_div_0_p_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Draft is ACTIVE");
    i0.ɵɵelementEnd();
} }
function ProgressComponent_div_0_ng_template_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Draft is not active.");
    i0.ɵɵelementEnd();
} }
function ProgressComponent_div_0_mat_list_item_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-list-item");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const up_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", up_r1.pickOrder, " - ", up_r1.displayName, " ");
} }
function ProgressComponent_div_0_mat_list_item_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-list-item");
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const h_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3(" ", h_r2.pickOrder, " - ", h_r2.firebaseUserId, " (", i0.ɵɵpipeBind2(2, 3, h_r2.claimedUtc, "short"), ") ");
} }
function ProgressComponent_div_0_mat_list_item_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-list-item");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate4(" ", u_r3.displayName, " \u2013 Picked: ", u_r3.picked, " / Allotment: ", u_r3.allotment, " (Remaining: ", u_r3.remaining, ") ");
} }
function ProgressComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "mat-card")(2, "mat-card-title");
    i0.ɵɵtext(3, "Draft Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "mat-card-content")(5, "p");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, ProgressComponent_div_0_p_7_Template, 2, 0, "p", 2)(8, ProgressComponent_div_0_ng_template_8_Template, 2, 0, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
    i0.ɵɵelementStart(10, "p");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "mat-card", 3)(13, "mat-card-title");
    i0.ɵɵtext(14, "Upcoming Picks");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "mat-list");
    i0.ɵɵtemplate(16, ProgressComponent_div_0_mat_list_item_16_Template, 2, 2, "mat-list-item", 4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "mat-card", 3)(18, "mat-card-title");
    i0.ɵɵtext(19, "History");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "mat-list");
    i0.ɵɵtemplate(21, ProgressComponent_div_0_mat_list_item_21_Template, 3, 6, "mat-list-item", 4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "mat-card", 3)(23, "mat-card-title");
    i0.ɵɵtext(24, "User Progress");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "mat-list");
    i0.ɵɵtemplate(26, ProgressComponent_div_0_mat_list_item_26_Template, 2, 4, "mat-list-item", 4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const inactive_r4 = i0.ɵɵreference(9);
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("Season ID: ", ctx_r4.status.seasonId, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r4.status.isActive)("ngIfElse", inactive_r4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("Total Tickets Remaining: ", ctx_r4.status.totalTicketsRemaining, "");
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r4.status.upcoming);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r4.status.history);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r4.status.users);
} }
export class ProgressComponent {
    draftService;
    status;
    seasonId = inject(SeasonService).currentSeasonId;
    destroyRef = inject(DestroyRef);
    constructor(draftService) {
        this.draftService = draftService;
    }
    ngOnInit() {
        this.load();
    }
    load() {
        this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
            this.status = status ?? undefined;
        });
    }
    static ɵfac = function ProgressComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ProgressComponent)(i0.ɵɵdirectiveInject(i1.DraftService)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ProgressComponent, selectors: [["app-progress"]], decls: 1, vars: 1, consts: [["inactive", ""], [4, "ngIf"], [4, "ngIf", "ngIfElse"], [1, "section"], [4, "ngFor", "ngForOf"]], template: function ProgressComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ProgressComponent_div_0_Template, 27, 7, "div", 1);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.status);
        } }, dependencies: [CommonModule, i2.NgForOf, i2.NgIf, i2.DatePipe, MatCardModule, i3.MatCard, i3.MatCardContent, i3.MatCardTitle, MatListModule, i4.MatList, i4.MatListItem], styles: ["\n\n.section[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\nmat-card-title[_ngcontent-%COMP%] {\n  font-weight: bold;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ProgressComponent, [{
        type: Component,
        args: [{ selector: 'app-progress', standalone: true, imports: [CommonModule, MatCardModule, MatListModule], template: "<!-- src/app/pages/progress.component.html -->\n<div *ngIf=\"status\">\n  <mat-card>\n    <mat-card-title>Draft Status</mat-card-title>\n    <mat-card-content>\n      <p>Season ID: {{ status.seasonId }}</p>\n      <p *ngIf=\"status.isActive; else inactive\">Draft is ACTIVE</p>\n      <ng-template #inactive><p>Draft is not active.</p></ng-template>\n      <p>Total Tickets Remaining: {{ status.totalTicketsRemaining }}</p>\n    </mat-card-content>\n  </mat-card>\n\n  <mat-card class=\"section\">\n    <mat-card-title>Upcoming Picks</mat-card-title>\n    <mat-list>\n      <mat-list-item *ngFor=\"let up of status.upcoming\">\n        {{ up.pickOrder }} - {{ up.displayName }}\n      </mat-list-item>\n    </mat-list>\n  </mat-card>\n\n  <mat-card class=\"section\">\n    <mat-card-title>History</mat-card-title>\n    <mat-list>\n      <mat-list-item *ngFor=\"let h of status.history\">\n        {{ h.pickOrder }} - {{ h.firebaseUserId }} ({{ h.claimedUtc | date:'short' }})\n      </mat-list-item>\n    </mat-list>\n  </mat-card>\n\n  <mat-card class=\"section\">\n    <mat-card-title>User Progress</mat-card-title>\n    <mat-list>\n      <mat-list-item *ngFor=\"let u of status.users\">\n        {{ u.displayName }} \u2013 Picked: {{ u.picked }} / Allotment: {{ u.allotment }} (Remaining: {{ u.remaining }})\n      </mat-list-item>\n    </mat-list>\n  </mat-card>\n</div>", styles: ["/* src/app/pages/progress.component.scss */\n.section {\n  margin-top: 1rem;\n}\n\nmat-card-title {\n  font-weight: bold;\n}"] }]
    }], () => [{ type: i1.DraftService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ProgressComponent, { className: "ProgressComponent", filePath: "src/app/pages/progress/progress.component.ts", lineNumber: 18 }); })();
