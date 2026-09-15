import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginDialogComponent } from '@components/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { FilterService } from '@services/filter.service';
import { FilterDialogComponent } from '@components/filter-dialog/filter-dialog.component';
import { SeasonService } from '@services/season.service';
import * as i0 from "@angular/core";
import * as i1 from "@services/draft.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/toolbar";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/button";
function HeaderComponent_div_7_span_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 11)(1, "mat-icon");
    i0.ɵɵtext(2, "person");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 12);
    i0.ɵɵtext(4, "Now:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.currentPick);
} }
function HeaderComponent_div_7_span_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 13)(1, "mat-icon");
    i0.ɵɵtext(2, "schedule");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 12);
    i0.ɵɵtext(4, "Next:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.nextPick);
} }
function HeaderComponent_div_7_span_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 14)(1, "mat-icon");
    i0.ɵɵtext(2, "history");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 12);
    i0.ɵɵtext(4, "Last:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.lastPick);
} }
function HeaderComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7);
    i0.ɵɵtemplate(1, HeaderComponent_div_7_span_1_Template, 7, 1, "span", 8)(2, HeaderComponent_div_7_span_2_Template, 7, 1, "span", 9)(3, HeaderComponent_div_7_span_3_Template, 7, 1, "span", 10);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.currentPick);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.nextPick);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.lastPick);
} }
function HeaderComponent_ng_container_9_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "button", 15);
    i0.ɵɵlistener("click", function HeaderComponent_ng_container_9_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openLogin()); });
    i0.ɵɵelementStart(2, "mat-icon");
    i0.ɵɵtext(3, "login");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4, " Login ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementContainerEnd();
} }
function HeaderComponent_ng_template_11_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 16)(1, "mat-icon");
    i0.ɵɵtext(2, "verified_user");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 17);
    i0.ɵɵlistener("click", function HeaderComponent_ng_template_11_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openFilterDialog()); });
    i0.ɵɵelementStart(5, "mat-icon");
    i0.ɵɵtext(6, "search");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "button", 18);
    i0.ɵɵlistener("click", function HeaderComponent_ng_template_11_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.logout()); });
    i0.ɵɵtext(8, "Logout");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.authService.currentUser == null ? null : ctx_r1.authService.currentUser.displayName, " ");
} }
export class HeaderComponent {
    draftService;
    sidenav;
    menuToggle = new EventEmitter();
    dialog = inject(MatDialog);
    authService = inject(AuthService);
    seasonId = inject(SeasonService).currentSeasonId;
    status = null;
    filterSvc = inject(FilterService);
    destroyRef = inject(DestroyRef);
    constructor(draftService) {
        this.draftService = draftService;
    }
    ngOnInit() {
        this.loadStatus();
    }
    toggleSidenav() {
        this.sidenav.toggle();
    }
    loadStatus() {
        this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
            this.status = status;
        });
    }
    get currentPick() {
        // The "current" pick should be the first in upcoming
        return this.status?.upcoming?.[0]?.displayName ?? 'N/A';
    }
    get nextPick() {
        // The "next" pick is the second in upcoming
        return this.status?.upcoming?.[1]?.displayName ?? 'N/A';
    }
    get lastPick() {
        const lastPick = this.status?.history.filter(h => h.claimedUtc)
            .sort((a, b) => new Date(b.claimedUtc).getTime() - new Date(a.claimedUtc).getTime())[0];
        const name = this.status?.users.find(u => u.firebaseUserId == lastPick?.firebaseUserId)?.displayName ?? 'N/A';
        return name;
        // return `${name} picked ${lastPick?.quantity} tix to ${lastPick?.team.name}`;
    }
    openLogin() {
        this.dialog.open(LoginDialogComponent, { width: '400px' });
    }
    logout() {
        this.authService.logout();
    }
    openFilterDialog() {
        const currentState = this.filterSvc.currentState; // grab snapshot
        const dialogRef = this.dialog.open(FilterDialogComponent, {
            width: '400px',
            data: { filters: currentState.filters }
        });
        dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
            if (result) {
                this.filterSvc.setFilters(result);
            }
        });
    }
    static ɵfac = function HeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HeaderComponent)(i0.ɵɵdirectiveInject(i1.DraftService)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: HeaderComponent, selectors: [["app-header"]], inputs: { sidenav: "sidenav" }, outputs: { menuToggle: "menuToggle" }, decls: 13, vars: 5, consts: [["loggedIn", ""], ["color", "primary", 1, "header-toolbar"], ["mat-icon-button", "", 1, "menu-btn", 3, "click"], [1, "title"], [1, "spacer"], ["class", "draft-status", 4, "ngIf"], [4, "ngIf", "ngIfElse"], [1, "draft-status"], ["class", "status-item current", 4, "ngIf"], ["class", "status-item next", 4, "ngIf"], ["class", "status-item last", 4, "ngIf"], [1, "status-item", "current"], [1, "label"], [1, "status-item", "next"], [1, "status-item", "last"], ["mat-raised-button", "", "color", "warn", 1, "login-btn", 3, "click"], [1, "user-label"], ["mat-icon-button", "", "matTooltip", "Search & Filter", 1, "search-btn", 3, "click"], ["mat-button", "", 1, "logout-btn", 3, "click"]], template: function HeaderComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "mat-toolbar", 1)(1, "button", 2);
            i0.ɵɵlistener("click", function HeaderComponent_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.menuToggle.emit()); });
            i0.ɵɵelementStart(2, "mat-icon");
            i0.ɵɵtext(3, "menu");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(4, "span", 3);
            i0.ɵɵtext(5, "Hopper");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(6, "span", 4);
            i0.ɵɵtemplate(7, HeaderComponent_div_7_Template, 4, 3, "div", 5);
            i0.ɵɵelement(8, "span", 4);
            i0.ɵɵtemplate(9, HeaderComponent_ng_container_9_Template, 5, 0, "ng-container", 6);
            i0.ɵɵpipe(10, "async");
            i0.ɵɵtemplate(11, HeaderComponent_ng_template_11_Template, 9, 1, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            const loggedIn_r5 = i0.ɵɵreference(12);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngIf", ctx.currentPick || ctx.nextPick || ctx.lastPick);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", !i0.ɵɵpipeBind1(10, 3, ctx.authService.currentUser$))("ngIfElse", loggedIn_r5);
        } }, dependencies: [CommonModule, i2.NgIf, i2.AsyncPipe, MatToolbarModule, i3.MatToolbar, MatIconModule, i4.MatIcon, MatButtonModule, i5.MatButton, i5.MatIconButton], styles: [".header-toolbar[_ngcontent-%COMP%] {\n  background-color: #1976d2; // Thunder blue\n  color: white;\n  padding: 0 1rem;\n\n  display: flex;\n  align-items: center;\n\n  .menu-btn {\n    margin-right: 0.5rem;\n  }\n\n  .title {\n    font-weight: 700;\n    font-size: 1.2rem;\n    margin-left: 0.25rem;\n  }\n\n  .spacer {\n    flex: 1 1 auto;\n  }\n\n  .draft-status {\n    display: flex;\n    justify-content: center;\n    gap: 2rem;\n    align-items: center;\n    font-size: 0.95rem;\n    font-weight: 500;\n\n    .status-item {\n      display: flex;\n      align-items: center;\n      gap: 0.35rem;\n\n      mat-icon {\n        font-size: 18px;\n      }\n\n      &.current {\n        color: #4caf50; // green\n      }\n\n      &.next {\n        color: #42a5f5; // blue\n      }\n\n      &.last {\n        color: #ff9800; // orange\n      }\n    }\n  }\n\n  .login-btn {\n    font-weight: 600;\n    background-color: #ff5722 !important; // bright orange\n    color: #fff !important;\n    mat-icon {\n      font-size: 18px;\n      margin-right: 4px;\n    }\n  }\n\n  .user-label {\n    display: flex;\n    align-items: center;\n    gap: 0.35rem;\n    margin-right: 1rem;\n    font-weight: 500;\n\n    mat-icon {\n      font-size: 18px;\n      color: #ffeb3b; // gold\n    }\n  }\n\n  .logout-btn {\n    color: #fff;\n    font-weight: 600;\n  }\n}\n\n\n\n@media (max-width: 600px) {\n  .header-toolbar[_ngcontent-%COMP%] {\n    .title {\n      font-size: 1rem;\n    }\n\n    .draft-status {\n      gap: 1rem;\n      font-size: 0.8rem;\n    }\n  }\n}\n\n\n\n\n\n@media (max-width: 480px) {\n  .header-toolbar[_ngcontent-%COMP%] {\n    .title {\n      display: none; // hide Hopper Draft title\n    }\n\n    .draft-status {\n      gap: 0.5rem;\n      font-size: 0.75rem;\n\n      .status-item {\n        .label {\n          display: none; // hide Now:/Next:/Last: text ONLY\n        }\n      }\n    }\n\n    .user-label {\n      display: none; // optional: hide username, keep icon\n    }\n  }\n}\n.search-btn[_ngcontent-%COMP%] {\n  display: none;\n\n  @media (max-width: 480px) {\n    display: inline-flex;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HeaderComponent, [{
        type: Component,
        args: [{ selector: 'app-header', standalone: true, imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule], template: "<mat-toolbar color=\"primary\" class=\"header-toolbar\">\n  <!-- Menu -->\n  <button mat-icon-button (click)=\"menuToggle.emit()\" class=\"menu-btn\">\n    <mat-icon>menu</mat-icon>\n  </button>\n\n  <!-- Title -->\n  <span class=\"title\">Hopper</span>\n\n  <!-- Spacer before draft status -->\n  <span class=\"spacer\"></span>\n\n  <!-- Draft Status (centered) -->\n  <div class=\"draft-status\" *ngIf=\"currentPick || nextPick || lastPick\">\n    <span *ngIf=\"currentPick\" class=\"status-item current\">\n      <mat-icon>person</mat-icon>\n      <span class=\"label\">Now:</span> <strong>{{ currentPick }}</strong>\n    </span>\n    <span *ngIf=\"nextPick\" class=\"status-item next\">\n      <mat-icon>schedule</mat-icon>\n      <span class=\"label\">Next:</span> <strong>{{ nextPick }}</strong>\n    </span>\n    <span *ngIf=\"lastPick\" class=\"status-item last\">\n      <mat-icon>history</mat-icon>\n      <span class=\"label\">Last:</span> <strong>{{ lastPick }}</strong>\n    </span>\n  </div>\n\n  <!-- Spacer after draft status -->\n  <span class=\"spacer\"></span>\n\n  <!-- Auth -->\n  <ng-container *ngIf=\"!(authService.currentUser$ | async); else loggedIn\">\n    <button mat-raised-button color=\"warn\" class=\"login-btn\" (click)=\"openLogin()\">\n      <mat-icon>login</mat-icon> Login\n    </button>\n  </ng-container>\n\n  <ng-template #loggedIn>\n    <span class=\"user-label\">\n      <mat-icon>verified_user</mat-icon>\n      {{ authService.currentUser?.displayName }}\n    </span>\n    <!-- Search button (small screens only) -->\n    <button mat-icon-button class=\"search-btn\" (click)=\"openFilterDialog()\" matTooltip=\"Search & Filter\">\n      <mat-icon>search</mat-icon>\n    </button>\n\n    <button mat-button class=\"logout-btn\" (click)=\"logout()\">Logout</button>\n  </ng-template>\n</mat-toolbar>\n", styles: [".header-toolbar {\n  background-color: #1976d2; // Thunder blue\n  color: white;\n  padding: 0 1rem;\n\n  display: flex;\n  align-items: center;\n\n  .menu-btn {\n    margin-right: 0.5rem;\n  }\n\n  .title {\n    font-weight: 700;\n    font-size: 1.2rem;\n    margin-left: 0.25rem;\n  }\n\n  .spacer {\n    flex: 1 1 auto;\n  }\n\n  .draft-status {\n    display: flex;\n    justify-content: center;\n    gap: 2rem;\n    align-items: center;\n    font-size: 0.95rem;\n    font-weight: 500;\n\n    .status-item {\n      display: flex;\n      align-items: center;\n      gap: 0.35rem;\n\n      mat-icon {\n        font-size: 18px;\n      }\n\n      &.current {\n        color: #4caf50; // green\n      }\n\n      &.next {\n        color: #42a5f5; // blue\n      }\n\n      &.last {\n        color: #ff9800; // orange\n      }\n    }\n  }\n\n  .login-btn {\n    font-weight: 600;\n    background-color: #ff5722 !important; // bright orange\n    color: #fff !important;\n    mat-icon {\n      font-size: 18px;\n      margin-right: 4px;\n    }\n  }\n\n  .user-label {\n    display: flex;\n    align-items: center;\n    gap: 0.35rem;\n    margin-right: 1rem;\n    font-weight: 500;\n\n    mat-icon {\n      font-size: 18px;\n      color: #ffeb3b; // gold\n    }\n  }\n\n  .logout-btn {\n    color: #fff;\n    font-weight: 600;\n  }\n}\n\n/* Medium screens: shrink fonts */\n@media (max-width: 600px) {\n  .header-toolbar {\n    .title {\n      font-size: 1rem;\n    }\n\n    .draft-status {\n      gap: 1rem;\n      font-size: 0.8rem;\n    }\n  }\n}\n\n/* Small screens: hide labels, shrink everything */\n/* Small screens: hide labels only */\n@media (max-width: 480px) {\n  .header-toolbar {\n    .title {\n      display: none; // hide Hopper Draft title\n    }\n\n    .draft-status {\n      gap: 0.5rem;\n      font-size: 0.75rem;\n\n      .status-item {\n        .label {\n          display: none; // hide Now:/Next:/Last: text ONLY\n        }\n      }\n    }\n\n    .user-label {\n      display: none; // optional: hide username, keep icon\n    }\n  }\n}\n.search-btn {\n  display: none;\n\n  @media (max-width: 480px) {\n    display: inline-flex;\n  }\n}"] }]
    }], () => [{ type: i1.DraftService }], { sidenav: [{
            type: Input
        }], menuToggle: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src/app/components/header/header.component.ts", lineNumber: 25 }); })();
