import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@services/auth.service';
import { DraftService } from '@services/draft.service';
import { GamesService } from '@services/games.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
function AllotmentEditorComponent_ng_container_0_small_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 5);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.error);
} }
function AllotmentEditorComponent_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "input", 2);
    i0.ɵɵtwoWayListener("ngModelChange", function AllotmentEditorComponent_ng_container_0_Template_input_ngModelChange_1_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.value, $event) || (ctx_r1.value = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 3);
    i0.ɵɵlistener("click", function AllotmentEditorComponent_ng_container_0_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.save()); });
    i0.ɵɵtext(3, "Save");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 3);
    i0.ɵɵlistener("click", function AllotmentEditorComponent_ng_container_0_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.editing = false); });
    i0.ɵɵtext(5, "Cancel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "small");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, AllotmentEditorComponent_ng_container_0_small_8_Template, 2, 1, "small", 4);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.value);
    i0.ɵɵproperty("min", ctx_r1.user.picked)("max", ctx_r1.maximum)("disabled", ctx_r1.saving);
    i0.ɵɵattribute("aria-label", "Ticket allotment for " + ctx_r1.user.displayName);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.saving || !ctx_r1.valid);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.saving);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate3("Min ", ctx_r1.user.picked, ", max ", ctx_r1.maximum, ". Total limit: ", ctx_r1.capacity, " (games \u00D7 4).");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.error);
} }
function AllotmentEditorComponent_ng_template_1_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 7);
    i0.ɵɵlistener("click", function AllotmentEditorComponent_ng_template_1_button_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.begin()); });
    i0.ɵɵtext(1, "Edit");
    i0.ɵɵelementEnd();
} }
function AllotmentEditorComponent_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
    i0.ɵɵtemplate(1, AllotmentEditorComponent_ng_template_1_button_1_Template, 2, 0, "button", 6);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.user.allotment, " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.auth.currentUser == null ? null : ctx_r1.auth.currentUser.isAdmin);
} }
export class AllotmentEditorComponent {
    user;
    status;
    auth = inject(AuthService);
    drafts = inject(DraftService);
    games = inject(GamesService);
    editing = false;
    saving = false;
    value = null;
    capacity = null;
    error = '';
    get maximum() {
        return Math.max(0, (this.capacity ?? 0) - this.status.users
            .filter(user => user.firebaseUserId !== this.user.firebaseUserId)
            .reduce((sum, user) => sum + user.allotment, 0));
    }
    get valid() {
        return this.capacity !== null && this.value !== null && Number.isInteger(this.value)
            && this.value >= this.user.picked && this.value >= 0 && this.value <= this.maximum;
    }
    begin() {
        this.value = this.user.allotment;
        this.error = '';
        this.capacity = null;
        this.editing = true;
        this.games.getSeasonGames(this.status.seasonId).subscribe({
            next: games => this.capacity = games.length * 4,
            error: () => this.error = 'Unable to load the ticket limit. Cancel and try again.'
        });
    }
    save() {
        if (!this.valid || this.saving)
            return;
        this.saving = true;
        this.error = '';
        this.drafts.updateAllotment(this.status.seasonId, this.user.firebaseUserId, this.value).subscribe({
            next: () => { this.saving = false; this.editing = false; },
            error: err => {
                this.saving = false;
                this.error = err.error?.message || 'Unable to save allotment. Please try again.';
            }
        });
    }
    static ɵfac = function AllotmentEditorComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AllotmentEditorComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AllotmentEditorComponent, selectors: [["app-allotment-editor"]], inputs: { user: "user", status: "status" }, decls: 3, vars: 2, consts: [["display", ""], [4, "ngIf", "ngIfElse"], ["type", "number", "step", "1", 3, "ngModelChange", "ngModel", "min", "max", "disabled"], ["mat-button", "", 3, "click", "disabled"], ["role", "alert", 4, "ngIf"], ["role", "alert"], ["mat-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "click"]], template: function AllotmentEditorComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, AllotmentEditorComponent_ng_container_0_Template, 9, 11, "ng-container", 1)(1, AllotmentEditorComponent_ng_template_1_Template, 2, 2, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
        } if (rf & 2) {
            const display_r4 = i0.ɵɵreference(2);
            i0.ɵɵproperty("ngIf", ctx.editing)("ngIfElse", display_r4);
        } }, dependencies: [CommonModule, i1.NgIf, FormsModule, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.NgControlStatus, i2.MinValidator, i2.MaxValidator, i2.NgModel, MatButtonModule, i3.MatButton], styles: ["input[_ngcontent-%COMP%] { width: 5rem; } small[_ngcontent-%COMP%] { display: block; }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AllotmentEditorComponent, [{
        type: Component,
        args: [{ selector: 'app-allotment-editor', standalone: true, imports: [CommonModule, FormsModule, MatButtonModule], template: `
    <ng-container *ngIf="editing; else display">
      <input type="number" [(ngModel)]="value" [min]="user.picked" [max]="maximum" step="1"
        [disabled]="saving" [attr.aria-label]="'Ticket allotment for ' + user.displayName" />
      <button mat-button (click)="save()" [disabled]="saving || !valid">Save</button>
      <button mat-button (click)="editing = false" [disabled]="saving">Cancel</button>
      <small>Min {{ user.picked }}, max {{ maximum }}. Total limit: {{ capacity }} (games × 4).</small>
      <small *ngIf="error" role="alert">{{ error }}</small>
    </ng-container>
    <ng-template #display>
      {{ user.allotment }}
      <button mat-button *ngIf="auth.currentUser?.isAdmin" (click)="begin()">Edit</button>
    </ng-template>
  `, styles: ["input { width: 5rem; } small { display: block; }"] }]
    }], null, { user: [{
            type: Input,
            args: [{ required: true }]
        }], status: [{
            type: Input,
            args: [{ required: true }]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AllotmentEditorComponent, { className: "AllotmentEditorComponent", filePath: "src/app/components/allotment-editor/allotment-editor.component.ts", lineNumber: 30 }); })();
