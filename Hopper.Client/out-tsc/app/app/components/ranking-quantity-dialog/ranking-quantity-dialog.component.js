import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/dialog";
export class RankingQuantityDialogComponent {
    game = inject(MAT_DIALOG_DATA);
    static ɵfac = function RankingQuantityDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RankingQuantityDialogComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RankingQuantityDialogComponent, selectors: [["app-ranking-quantity-dialog"]], decls: 17, vars: 13, consts: [["mat-dialog-title", ""], [1, "quantity-options"], ["mat-flat-button", "", "color", "primary", 3, "mat-dialog-close"], ["align", "end"], ["mat-button", "", "mat-dialog-close", ""]], template: function RankingQuantityDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "h2", 0);
            i0.ɵɵtext(1, "How many tickets?");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "mat-dialog-content")(3, "strong");
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6);
            i0.ɵɵpipe(7, "date");
            i0.ɵɵpipe(8, "date");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "div", 1)(10, "button", 2);
            i0.ɵɵtext(11, "2 tickets");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "button", 2);
            i0.ɵɵtext(13, "4 tickets");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(14, "mat-dialog-actions", 3)(15, "button", 4);
            i0.ɵɵtext(16, "Cancel");
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.game.opponent.name);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2(" ", i0.ɵɵpipeBind3(7, 5, ctx.game.gameDateTime, "EEE, MMM d, y", "America/Chicago"), " \u00B7 ", i0.ɵɵpipeBind3(8, 9, ctx.game.gameDateTime, "shortTime", "America/Chicago"), " ");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("mat-dialog-close", 2);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("mat-dialog-close", 4);
        } }, dependencies: [CommonModule, i1.DatePipe, MatButtonModule, i2.MatButton, MatDialogModule, i3.MatDialogClose, i3.MatDialogTitle, i3.MatDialogActions, i3.MatDialogContent], styles: [".quantity-options[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-top: 1rem; }\n    .quantity-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { flex: 1; min-height: 48px; }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RankingQuantityDialogComponent, [{
        type: Component,
        args: [{ selector: 'app-ranking-quantity-dialog', standalone: true, imports: [CommonModule, MatButtonModule, MatDialogModule], template: `
    <h2 mat-dialog-title>How many tickets?</h2>
    <mat-dialog-content>
      <strong>{{ game.opponent.name }}</strong>
      <p>
        {{ game.gameDateTime | date:'EEE, MMM d, y':'America/Chicago' }} ·
        {{ game.gameDateTime | date:'shortTime':'America/Chicago' }}
      </p>
      <div class="quantity-options">
        <button mat-flat-button color="primary" [mat-dialog-close]="2">2 tickets</button>
        <button mat-flat-button color="primary" [mat-dialog-close]="4">4 tickets</button>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `, styles: ["\n    .quantity-options { display: flex; gap: 1rem; margin-top: 1rem; }\n    .quantity-options button { flex: 1; min-height: 48px; }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RankingQuantityDialogComponent, { className: "RankingQuantityDialogComponent", filePath: "src/app/components/ranking-quantity-dialog/ranking-quantity-dialog.component.ts", lineNumber: 33 }); })();
