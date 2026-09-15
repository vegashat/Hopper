import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/dialog";
export class RankingSuggestionDialogComponent {
    data;
    constructor(data) {
        this.data = data;
    }
    static ɵfac = function RankingSuggestionDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RankingSuggestionDialogComponent)(i0.ɵɵdirectiveInject(MAT_DIALOG_DATA)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RankingSuggestionDialogComponent, selectors: [["app-ranking-suggestion-dialog"]], decls: 20, vars: 12, consts: [["mat-dialog-title", ""], [1, "suggestion"], [3, "src", "alt"], ["align", "end"], ["mat-button", "", 3, "mat-dialog-close"], ["mat-flat-button", "", "color", "primary", 3, "mat-dialog-close"]], template: function RankingSuggestionDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "h2", 0);
            i0.ɵɵtext(1, "Ranked game available");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "mat-dialog-content")(3, "div", 1);
            i0.ɵɵelement(4, "img", 2);
            i0.ɵɵelementStart(5, "div")(6, "strong");
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "span");
            i0.ɵɵtext(9);
            i0.ɵɵpipe(10, "date");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "span");
            i0.ɵɵtext(12);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(13, "p");
            i0.ɵɵtext(14, "This is your highest-ranked choice that currently has enough tickets available.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "mat-dialog-actions", 3)(16, "button", 4);
            i0.ɵɵtext(17, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 5);
            i0.ɵɵtext(19);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("src", "assets/" + ctx.data.game.opponent.logoUrl, i0.ɵɵsanitizeUrl)("alt", ctx.data.game.opponent.name);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.data.game.opponent.name);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(10, 9, ctx.data.game.gameDateTime, "medium"));
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate2("", ctx.data.ranking.quantity, " tickets \u00B7 Ranked #", ctx.data.ranking.rankOrder, "");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("mat-dialog-close", false);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("mat-dialog-close", true);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" Select ", ctx.data.ranking.quantity, " tickets ");
        } }, dependencies: [CommonModule, i1.DatePipe, MatButtonModule, i2.MatButton, MatDialogModule, i3.MatDialogClose, i3.MatDialogTitle, i3.MatDialogActions, i3.MatDialogContent], styles: [".suggestion[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: .75rem 0;\n}\n\n.suggestion[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n  object-fit: contain;\n}\n\n.suggestion[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: .15rem;\n}\n\n.suggestion[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { font-size: 1.1rem; }\n.suggestion[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], p[_ngcontent-%COMP%] { color: #666; }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RankingSuggestionDialogComponent, [{
        type: Component,
        args: [{ selector: 'app-ranking-suggestion-dialog', standalone: true, imports: [CommonModule, MatButtonModule, MatDialogModule], template: "<h2 mat-dialog-title>Ranked game available</h2>\n\n<mat-dialog-content>\n  <div class=\"suggestion\">\n    <img [src]=\"'assets/' + data.game.opponent.logoUrl\" [alt]=\"data.game.opponent.name\" />\n    <div>\n      <strong>{{ data.game.opponent.name }}</strong>\n      <span>{{ data.game.gameDateTime | date:'medium' }}</span>\n      <span>{{ data.ranking.quantity }} tickets \u00B7 Ranked #{{ data.ranking.rankOrder }}</span>\n    </div>\n  </div>\n  <p>This is your highest-ranked choice that currently has enough tickets available.</p>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button mat-button [mat-dialog-close]=\"false\">Cancel</button>\n  <button mat-flat-button color=\"primary\" [mat-dialog-close]=\"true\">\n    Select {{ data.ranking.quantity }} tickets\n  </button>\n</mat-dialog-actions>\n", styles: [".suggestion {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: .75rem 0;\n}\n\n.suggestion img {\n  width: 52px;\n  height: 52px;\n  object-fit: contain;\n}\n\n.suggestion div {\n  display: flex;\n  flex-direction: column;\n  gap: .15rem;\n}\n\n.suggestion strong { font-size: 1.1rem; }\n.suggestion span, p { color: #666; }\n"] }]
    }], () => [{ type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RankingSuggestionDialogComponent, { className: "RankingSuggestionDialogComponent", filePath: "src/app/components/ranking-suggestion-dialog/ranking-suggestion-dialog.component.ts", lineNumber: 20 }); })();
