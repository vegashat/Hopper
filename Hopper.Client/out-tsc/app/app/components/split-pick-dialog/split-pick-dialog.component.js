// split-pick-dialog.component.ts
import { Component, DestroyRef, inject, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { DraftService } from '@services/draft.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@angular/material/form-field";
import * as i3 from "@angular/material/select";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
function SplitPickDialogComponent_mat_option_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const user_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", user_r1.firebaseUserId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", user_r1.displayName, " (", user_r1.remaining, " left) ");
} }
export class SplitPickDialogComponent {
    dialogRef;
    data;
    selectedUserId = null;
    pickingUserId = null;
    game = null;
    draftService = inject(DraftService);
    users = [];
    destroyRef = inject(DestroyRef);
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        if (data) {
            this.pickingUserId = data.participant.firebaseUserId;
            this.game = data.game;
        }
    }
    ngOnInit() {
        this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
            if (status && status.users) {
                this.users = status.users.filter(p => p.remaining > 0 && p.firebaseUserId !== this.pickingUserId);
            }
        });
    }
    confirm() {
        if (this.selectedUserId) {
            this.dialogRef.close({ splitUserId: this.selectedUserId, splitQuantity: 2 });
        }
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static ɵfac = function SplitPickDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SplitPickDialogComponent)(i0.ɵɵdirectiveInject(i1.MatDialogRef), i0.ɵɵdirectiveInject(MAT_DIALOG_DATA)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SplitPickDialogComponent, selectors: [["app-split-pick-dialog"]], decls: 18, vars: 11, consts: [["mat-dialog-title", ""], [1, "team-logo", 3, "src", "alt"], [1, "game-info"], ["appearance", "outline", 1, "user-select"], [3, "valueChange", "value"], [3, "value", 4, "ngFor", "ngForOf"], ["mat-stroked-button", "", 3, "click"], ["mat-flat-button", "", "color", "primary", 3, "click", "disabled"], [3, "value"]], template: function SplitPickDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "h2", 0);
            i0.ɵɵelement(1, "img", 1);
            i0.ɵɵelementStart(2, "span");
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(4, "mat-dialog-content")(5, "div", 2);
            i0.ɵɵtext(6);
            i0.ɵɵpipe(7, "date");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "mat-form-field", 3)(9, "mat-label");
            i0.ɵɵtext(10, "Select a user to split with");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "mat-select", 4);
            i0.ɵɵtwoWayListener("valueChange", function SplitPickDialogComponent_Template_mat_select_valueChange_11_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selectedUserId, $event) || (ctx.selectedUserId = $event); return $event; });
            i0.ɵɵtemplate(12, SplitPickDialogComponent_mat_option_12_Template, 2, 3, "mat-option", 5);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(13, "mat-dialog-actions")(14, "button", 6);
            i0.ɵɵlistener("click", function SplitPickDialogComponent_Template_button_click_14_listener() { return ctx.cancel(); });
            i0.ɵɵtext(15, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "button", 7);
            i0.ɵɵlistener("click", function SplitPickDialogComponent_Template_button_click_16_listener() { return ctx.confirm(); });
            i0.ɵɵtext(17, " Confirm ");
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵpropertyInterpolate("alt", ctx.data.game.opponent.name);
            i0.ɵɵproperty("src", "assets/" + ctx.data.game.opponent.logoUrl, i0.ɵɵsanitizeUrl);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.data.game.opponent.name);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind2(7, 8, ctx.data.game.gameDateTime, "fullDate"), " at ", ctx.data.game.arena, " ");
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("value", ctx.selectedUserId);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.users);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", !ctx.selectedUserId);
        } }, dependencies: [MatInputModule, i2.MatFormField, i2.MatLabel, MatSelectModule, i3.MatSelect, i3.MatOption, CommonModule, i4.NgForOf, i4.DatePipe, FormsModule, MatDialogContent, MatDialogActions, MatButtonModule, i5.MatButton], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SplitPickDialogComponent, [{
        type: Component,
        args: [{ selector: 'app-split-pick-dialog', imports: [MatInputModule, MatSelectModule, CommonModule, FormsModule, MatDialogContent, MatDialogActions, MatButtonModule], template: "<h2 mat-dialog-title>\n  <img [src]=\"'assets/' + data.game.opponent.logoUrl\" \n       alt=\"{{ data.game.opponent.name }}\" \n       class=\"team-logo\" />\n  <span>{{ data.game.opponent.name }}</span>\n</h2>\n\n<mat-dialog-content>\n  <div class=\"game-info\">\n    {{ data.game.gameDateTime | date:'fullDate' }} at {{ data.game.arena }}\n  </div>\n\n  <mat-form-field appearance=\"outline\" class=\"user-select\">\n    <mat-label>Select a user to split with</mat-label>\n    <mat-select [(value)]=\"selectedUserId\">\n      <mat-option *ngFor=\"let user of users\" [value]=\"user.firebaseUserId\">\n        {{ user.displayName }} ({{ user.remaining }} left)\n      </mat-option>\n    </mat-select>\n  </mat-form-field>\n</mat-dialog-content>\n\n<mat-dialog-actions>\n  <button mat-stroked-button (click)=\"cancel()\">Cancel</button>\n  <button mat-flat-button color=\"primary\" [disabled]=\"!selectedUserId\" (click)=\"confirm()\">\n    Confirm\n  </button>\n</mat-dialog-actions>" }]
    }], () => [{ type: i1.MatDialogRef }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SplitPickDialogComponent, { className: "SplitPickDialogComponent", filePath: "src/app/components/split-pick-dialog/split-pick-dialog.component.ts", lineNumber: 21 }); })();
