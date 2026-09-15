import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggle } from '@angular/material/slide-toggle';
import * as i0 from "@angular/core";
import * as i1 from "@services/filter.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "@angular/material/dialog";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/button-toggle";
import * as i7 from "@angular/material/form-field";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/icon";
function FilterDialogComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 11);
    i0.ɵɵlistener("click", function FilterDialogComponent_button_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clear()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "close");
    i0.ɵɵelementEnd()();
} }
function FilterDialogComponent_mat_button_toggle_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-button-toggle", 12);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", m_r3.num);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(m_r3.label);
} }
function FilterDialogComponent_mat_button_toggle_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-button-toggle", 12);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r4.num);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(d_r4.label);
} }
export class FilterDialogComponent {
    filterSvc;
    data;
    destroyRef = inject(DestroyRef);
    months = [
        { num: 10, label: 'Oct' },
        { num: 11, label: 'Nov' },
        { num: 12, label: 'Dec' },
        { num: 1, label: 'Jan' },
        { num: 2, label: 'Feb' },
        { num: 3, label: 'Mar' },
        { num: 4, label: 'Apr' },
    ];
    daysOfWeek = [
        { num: 0, label: 'Sun' },
        { num: 1, label: 'Mon' },
        { num: 2, label: 'Tue' },
        { num: 3, label: 'Wed' },
        { num: 4, label: 'Thu' },
        { num: 5, label: 'Fri' },
        { num: 6, label: 'Sat' },
    ];
    searchTerm = '';
    selectedMonths = [];
    selectedDays = [];
    showAvailableOnly = false;
    constructor(filterSvc, data) {
        this.filterSvc = filterSvc;
        this.data = data;
    }
    ngOnInit() {
        this.filterSvc.filterState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(state => {
            this.searchTerm = state.searchTerm;
            this.selectedMonths = state.filters?.months ?? [];
            this.selectedDays = state.filters?.daysOfWeek ?? [];
            this.showAvailableOnly = state.showAvailableOnly;
        });
    }
    onSearchChange(term) {
        this.filterSvc.setSearchTerm(term);
    }
    toggleAvailable() {
        this.filterSvc.toggleAvailable();
    }
    updateMonths(months) {
        this.filterSvc.setFilters({ months, daysOfWeek: this.selectedDays });
    }
    updateDays(days) {
        this.filterSvc.setFilters({ months: this.selectedMonths, daysOfWeek: days });
    }
    clear() {
        this.searchTerm = '';
        this.selectedMonths = [];
        this.selectedDays = [];
        this.showAvailableOnly = false;
        this.filterSvc.setSearchTerm('');
        this.filterSvc.setFilters({ months: [], daysOfWeek: [] });
    }
    static ɵfac = function FilterDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FilterDialogComponent)(i0.ɵɵdirectiveInject(i1.FilterService), i0.ɵɵdirectiveInject(MAT_DIALOG_DATA)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: FilterDialogComponent, selectors: [["app-filter-dialog"]], decls: 27, vars: 7, consts: [["mat-dialog-title", ""], [1, "filter-container"], ["appearance", "outline", 1, "filter-field"], ["matInput", "", 3, "ngModelChange", "ngModel"], ["mat-icon-button", "", "matSuffix", "", 3, "click", 4, "ngIf"], ["ngModel", "", "name", "showAvailableOnly", 3, "ngModelChange", "click", "ngModel"], ["multiple", "", "hideMultipleSelectionIndicator", "true", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["align", "end"], ["mat-button", "", "type", "button", 3, "click"], ["mat-button", "", "type", "button", "mat-dialog-close", ""], ["mat-icon-button", "", "matSuffix", "", 3, "click"], [3, "value"]], template: function FilterDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "h2", 0);
            i0.ɵɵtext(1, "Filter Games");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "mat-dialog-content", 1)(3, "h3");
            i0.ɵɵtext(4, "Search");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "mat-form-field", 2)(6, "mat-label");
            i0.ɵɵtext(7, "Search games");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "input", 3);
            i0.ɵɵtwoWayListener("ngModelChange", function FilterDialogComponent_Template_input_ngModelChange_8_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.searchTerm, $event) || (ctx.searchTerm = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function FilterDialogComponent_Template_input_ngModelChange_8_listener($event) { return ctx.onSearchChange($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(9, FilterDialogComponent_button_9_Template, 3, 0, "button", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "h3");
            i0.ɵɵtext(11, "Available");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-slide-toggle", 5);
            i0.ɵɵtwoWayListener("ngModelChange", function FilterDialogComponent_Template_mat_slide_toggle_ngModelChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.showAvailableOnly, $event) || (ctx.showAvailableOnly = $event); return $event; });
            i0.ɵɵlistener("click", function FilterDialogComponent_Template_mat_slide_toggle_click_12_listener() { return ctx.toggleAvailable(); });
            i0.ɵɵtext(13, "Only Available Games");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "h3");
            i0.ɵɵtext(15, "Months");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "mat-button-toggle-group", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function FilterDialogComponent_Template_mat_button_toggle_group_ngModelChange_16_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selectedMonths, $event) || (ctx.selectedMonths = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function FilterDialogComponent_Template_mat_button_toggle_group_ngModelChange_16_listener($event) { return ctx.updateMonths($event); });
            i0.ɵɵtemplate(17, FilterDialogComponent_mat_button_toggle_17_Template, 2, 2, "mat-button-toggle", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "h3");
            i0.ɵɵtext(19, "Days of Week");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "mat-button-toggle-group", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function FilterDialogComponent_Template_mat_button_toggle_group_ngModelChange_20_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selectedDays, $event) || (ctx.selectedDays = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function FilterDialogComponent_Template_mat_button_toggle_group_ngModelChange_20_listener($event) { return ctx.updateDays($event); });
            i0.ɵɵtemplate(21, FilterDialogComponent_mat_button_toggle_21_Template, 2, 2, "mat-button-toggle", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(22, "mat-dialog-actions", 8)(23, "button", 9);
            i0.ɵɵlistener("click", function FilterDialogComponent_Template_button_click_23_listener() { return ctx.clear(); });
            i0.ɵɵtext(24, "Clear");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "button", 10);
            i0.ɵɵtext(26, "Close");
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(8);
            i0.ɵɵtwoWayProperty("ngModel", ctx.searchTerm);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.searchTerm);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.showAvailableOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.selectedMonths);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.months);
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.selectedDays);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.daysOfWeek);
        } }, dependencies: [CommonModule, i2.NgForOf, i2.NgIf, FormsModule, i3.DefaultValueAccessor, i3.NgControlStatus, i3.NgModel, MatDialogModule, i4.MatDialogClose, i4.MatDialogTitle, i4.MatDialogActions, i4.MatDialogContent, MatButtonModule, i5.MatButton, i5.MatIconButton, MatButtonToggleModule, i6.MatButtonToggleGroup, i6.MatButtonToggle, MatFormFieldModule, i7.MatFormField, i7.MatLabel, i7.MatSuffix, MatInputModule, i8.MatInput, MatIconModule, i9.MatIcon, MatSlideToggle], styles: [".filter-field[_ngcontent-%COMP%] {\n        width: 100%;\n        margin-bottom: 1rem;\n    }\n\n    .filter-container[_ngcontent-%COMP%] {\n        padding: 1rem;\n    }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FilterDialogComponent, [{
        type: Component,
        args: [{ selector: 'app-filter-dialog', standalone: true, imports: [
                    CommonModule,
                    FormsModule,
                    MatDialogModule,
                    MatButtonModule,
                    MatButtonToggleModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatIconModule,
                    MatSlideToggle
                ], template: "<h2 mat-dialog-title>Filter Games</h2>\n\n<mat-dialog-content class=\"filter-container\">\n  <h3>Search</h3>\n  <mat-form-field appearance=\"outline\" class=\"filter-field\">\n    <mat-label>Search games</mat-label>\n    <input matInput [(ngModel)]=\"searchTerm\" (ngModelChange)=\"onSearchChange($event)\" />\n    <button *ngIf=\"searchTerm\" mat-icon-button matSuffix (click)=\"clear()\">\n      <mat-icon>close</mat-icon>\n    </button>\n  </mat-form-field>\n\n  <h3>Available</h3>\n  <mat-slide-toggle ngModel name=\"showAvailableOnly\" [(ngModel)]=\"showAvailableOnly\" (click)=\"toggleAvailable()\">Only Available Games</mat-slide-toggle>\n\n  <h3>Months</h3>\n  <mat-button-toggle-group multiple [(ngModel)]=\"selectedMonths\" (ngModelChange)=\"updateMonths($event)\" hideMultipleSelectionIndicator=\"true\">\n    <mat-button-toggle *ngFor=\"let m of months\" [value]=\"m.num\">{{ m.label }}</mat-button-toggle>\n  </mat-button-toggle-group>\n\n  <h3>Days of Week</h3>\n  <mat-button-toggle-group multiple [(ngModel)]=\"selectedDays\" (ngModelChange)=\"updateDays($event)\" hideMultipleSelectionIndicator=\"true\">\n    <mat-button-toggle *ngFor=\"let d of daysOfWeek\" [value]=\"d.num\">{{ d.label }}</mat-button-toggle>\n  </mat-button-toggle-group>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button mat-button type=\"button\" (click)=\"clear()\">Clear</button>\n  <button mat-button type=\"button\" mat-dialog-close>Close</button>\n</mat-dialog-actions>", styles: ["    .filter-field {\n        width: 100%;\n        margin-bottom: 1rem;\n    }\n\n    .filter-container {\n        padding: 1rem;\n    }\n"] }]
    }], () => [{ type: i1.FilterService }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(FilterDialogComponent, { className: "FilterDialogComponent", filePath: "src/app/components/filter-dialog/filter-dialog.component.ts", lineNumber: 32 }); })();
