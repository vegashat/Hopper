import { Component, DestroyRef, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer, exhaustMap, catchError, of } from 'rxjs';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
function StevenCounterComponent_section_0_ng_container_3_p_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 12);
    i0.ɵɵtext(1, "Loading counter settings\u2026");
    i0.ɵɵelementEnd();
} }
function StevenCounterComponent_section_0_ng_container_3_p_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.loadError);
} }
function StevenCounterComponent_section_0_ng_container_3_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", p_r3.firebaseUserId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(p_r3.displayName);
} }
function StevenCounterComponent_section_0_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, StevenCounterComponent_section_0_ng_container_3_p_1_Template, 2, 0, "p", 4)(2, StevenCounterComponent_section_0_ng_container_3_p_2_Template, 2, 1, "p", 5);
    i0.ɵɵelementStart(3, "label");
    i0.ɵɵtext(4, "Steven's account ");
    i0.ɵɵelementStart(5, "select", 6);
    i0.ɵɵtwoWayListener("ngModelChange", function StevenCounterComponent_section_0_ng_container_3_Template_select_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.stevenId, $event) || (ctx_r1.stevenId = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementStart(6, "option", 7);
    i0.ɵɵtext(7, "Choose participant");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, StevenCounterComponent_section_0_ng_container_3_option_8_Template, 2, 2, "option", 8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "label")(10, "input", 9);
    i0.ɵɵtwoWayListener("ngModelChange", function StevenCounterComponent_section_0_ng_container_3_Template_input_ngModelChange_10_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.enabled, $event) || (ctx_r1.enabled = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵtext(11, " Show counter on draft screen");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 10);
    i0.ɵɵlistener("click", function StevenCounterComponent_section_0_ng_container_3_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.save()); });
    i0.ɵɵtext(13, "Save settings");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 11);
    i0.ɵɵlistener("click", function StevenCounterComponent_section_0_ng_container_3_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.reset()); });
    i0.ɵɵtext(15, "Reset counter");
    i0.ɵɵelementEnd();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.state && !ctx_r1.loadError);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.loadError);
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.stevenId);
    i0.ɵɵproperty("disabled", ctx_r1.busy || !ctx_r1.state);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngValue", null);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r1.participants);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.enabled);
    i0.ɵɵproperty("disabled", ctx_r1.busy || !ctx_r1.state);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.busy || !ctx_r1.state);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.busy || !ctx_r1.state);
} }
function StevenCounterComponent_section_0_p_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 15);
    i0.ɵɵtext(1, "Steven has been screwed ");
    i0.ɵɵelementStart(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4, " times.");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.state.total);
} }
function StevenCounterComponent_section_0_ng_container_5_label_1_option_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r6 = ctx.$implicit;
    i0.ɵɵproperty("value", p_r6.firebaseUserId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(p_r6.displayName);
} }
function StevenCounterComponent_section_0_ng_container_5_label_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label");
    i0.ɵɵtext(1, "Choose your target ");
    i0.ɵɵelementStart(2, "select", 16);
    i0.ɵɵtwoWayListener("ngModelChange", function StevenCounterComponent_section_0_ng_container_5_label_1_Template_select_ngModelChange_2_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(3); i0.ɵɵtwoWayBindingSet(ctx_r1.targetId, $event) || (ctx_r1.targetId = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementStart(3, "option", 7);
    i0.ɵɵtext(4, "Choose participant");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, StevenCounterComponent_section_0_ng_container_5_label_1_option_5_Template, 2, 2, "option", 8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.targetId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngValue", null);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r1.participants);
} }
function StevenCounterComponent_section_0_ng_container_5_p_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Give Steven a break! Try again in ", ctx_r1.remaining, "s.");
} }
function StevenCounterComponent_section_0_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, StevenCounterComponent_section_0_ng_container_5_label_1_Template, 6, 3, "label", 2);
    i0.ɵɵelementStart(2, "button", 10);
    i0.ɵɵlistener("click", function StevenCounterComponent_section_0_ng_container_5_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.click()); });
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, StevenCounterComponent_section_0_ng_container_5_p_4_Template, 2, 1, "p", 2);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.state == null ? null : ctx_r1.state.isSteven);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.busy || ctx_r1.remaining > 0 || (ctx_r1.state == null ? null : ctx_r1.state.isSteven) && !ctx_r1.targetId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", (ctx_r1.state == null ? null : ctx_r1.state.isSteven) ? "Screw " + ctx_r1.targetName : "Screw Steven", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.remaining > 0);
} }
function StevenCounterComponent_section_0_p_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 12);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.message);
} }
function StevenCounterComponent_section_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 1)(1, "h2");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, StevenCounterComponent_section_0_ng_container_3_Template, 16, 10, "ng-container", 2)(4, StevenCounterComponent_section_0_p_4_Template, 5, 1, "p", 3)(5, StevenCounterComponent_section_0_ng_container_5_Template, 5, 4, "ng-container", 2)(6, StevenCounterComponent_section_0_p_6_Template, 2, 1, "p", 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.admin ? "Steven counter settings" : "The Steven counter");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.admin);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.state);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.admin && (ctx_r1.state == null ? null : ctx_r1.state.enabled));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.message);
} }
export class StevenCounterComponent {
    admin = false;
    http = inject(HttpClient);
    destroyRef = inject(DestroyRef);
    url = `${environment.apiUrl}/steven-counter`;
    state = null;
    participants = [];
    stevenId = null;
    targetId = null;
    enabled = false;
    busy = false;
    remaining = 0;
    message = '';
    loadError = '';
    initialized = false;
    get targetName() {
        return this.participants.find(p => p.firebaseUserId === this.targetId)?.displayName || 'someone';
    }
    ngOnInit() {
        this.http.get(`${environment.apiUrl}/participants`)
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: p => this.participants = p,
            error: () => this.message = 'Unable to load participants.'
        });
        timer(0, 5000).pipe(exhaustMap(() => this.http.get(this.url).pipe(catchError((err) => {
            this.loadError = err.status === 401 || err.status === 403
                ? 'Please log in with an administrator account to load and save these settings.'
                : err.status === 404
                    ? 'The counter API is unavailable. Restart or deploy the updated API.'
                    : 'Unable to load counter settings. Check that the API is running and the latest database migration has been applied.';
            return of(null);
        }))), takeUntilDestroyed(this.destroyRef)).subscribe(state => {
            if (state) {
                this.loadError = "";
                this.state = state;
                if (!this.initialized) {
                    this.enabled = state.enabled;
                    this.stevenId = state.stevenId;
                    this.initialized = true;
                }
                this.updateCooldown();
            }
        });
        timer(0, 1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateCooldown());
    }
    updateCooldown() {
        const value = this.state?.nextClickUtc;
        const utc = value && /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : value + 'Z';
        this.remaining = value ? Math.max(0, Math.ceil((Date.parse(utc) - Date.now()) / 1000)) : 0;
    }
    mutate(path, body, put = false) {
        if (this.busy)
            return;
        this.busy = true;
        this.message = '';
        const request = put ? this.http.put(this.url, body) : this.http.post(this.url + path, body);
        request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => {
                this.busy = false;
                this.message = result?.message || 'Saved.';
                if (path === '/click' && this.state) {
                    this.state.nextClickUtc = new Date(Date.now() + 30000).toISOString();
                    this.updateCooldown();
                }
                this.http.get(this.url).pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({ next: state => { this.state = state; this.updateCooldown(); }, error: () => { } });
            },
            error: err => {
                this.busy = false;
                this.message = err.error?.message || 'Unable to update counter.';
            }
        });
    }
    click() { this.mutate('/click', { targetId: this.targetId }); }
    save() { this.mutate('', { enabled: this.enabled, stevenId: this.stevenId }, true); }
    reset() {
        if (window.confirm('Reset Steven’s counter to zero?'))
            this.mutate('/reset', {});
    }
    static ɵfac = function StevenCounterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StevenCounterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StevenCounterComponent, selectors: [["app-steven-counter"]], inputs: { admin: "admin" }, decls: 1, vars: 1, consts: [["class", "counter", 4, "ngIf"], [1, "counter"], [4, "ngIf"], ["class", "total", 4, "ngIf"], ["role", "status", 4, "ngIf"], ["role", "alert", 4, "ngIf"], [3, "ngModelChange", "ngModel", "disabled"], [3, "ngValue"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["mat-button", "", 3, "click", "disabled"], ["role", "status"], ["role", "alert"], [3, "value"], [1, "total"], [3, "ngModelChange", "ngModel"]], template: function StevenCounterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StevenCounterComponent_section_0_Template, 7, 5, "section", 0);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.admin || (ctx.state == null ? null : ctx.state.enabled));
        } }, dependencies: [CommonModule, i1.NgForOf, i1.NgIf, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel, MatButtonModule, i3.MatButton], styles: [".counter[_ngcontent-%COMP%] { padding: 1rem; margin-bottom: 1rem; border-radius: 12px; background: #fff8f0; }\n    h2[_ngcontent-%COMP%] { margin-top: 0; }\n    label[_ngcontent-%COMP%] { display: block; margin: .75rem 0; }\n    select[_ngcontent-%COMP%] { display: block; max-width: 100%; min-height: 44px; margin-top: .25rem; font: inherit; }\n    small[_ngcontent-%COMP%] { display: block; margin-top: .75rem; }\n    .total[_ngcontent-%COMP%] { font-size: 1.1rem; }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StevenCounterComponent, [{
        type: Component,
        args: [{ selector: 'app-steven-counter', standalone: true, imports: [CommonModule, FormsModule, MatButtonModule], template: `
    <section *ngIf="admin || state?.enabled" class="counter">
      <h2>{{ admin ? 'Steven counter settings' : 'The Steven counter' }}</h2>
      <ng-container *ngIf="admin">
        <!-- <p>Just for laughs. This does not affect draft order or picks.</p> -->
        <p *ngIf="!state && !loadError" role="status">Loading counter settings…</p>
        <p *ngIf="loadError" role="alert">{{ loadError }}</p>
        <label>Steven's account
          <select [(ngModel)]="stevenId" [disabled]="busy || !state">
            <option [ngValue]="null">Choose participant</option>
            <option *ngFor="let p of participants" [value]="p.firebaseUserId">{{ p.displayName }}</option>
          </select>
        </label>
        <label><input type="checkbox" [(ngModel)]="enabled" [disabled]="busy || !state" /> Show counter on draft screen</label>
        <button mat-raised-button color="primary" (click)="save()" [disabled]="busy || !state">Save settings</button>
        <button mat-button (click)="reset()" [disabled]="busy || !state">Reset counter</button>
      </ng-container>
      <p *ngIf="state" class="total">Steven has been screwed <strong>{{ state.total }}</strong> times.</p>
      <ng-container *ngIf="!admin && state?.enabled">
        <label *ngIf="state?.isSteven">Choose your target
          <select [(ngModel)]="targetId">
            <option [ngValue]="null">Choose participant</option>
            <option *ngFor="let p of participants" [value]="p.firebaseUserId">{{ p.displayName }}</option>
          </select>
        </label>
        <button mat-raised-button color="primary" (click)="click()"
          [disabled]="busy || remaining > 0 || (state?.isSteven && !targetId)">
          {{ state?.isSteven ? 'Screw ' + targetName : 'Screw Steven' }}
        </button>
        <p *ngIf="remaining > 0">Give Steven a break! Try again in {{ remaining }}s.</p>
        <!-- <small>Just for laughs. Your draft picks are safe.</small> -->
      </ng-container>
      <p role="status" *ngIf="message">{{ message }}</p>
    </section>
  `, styles: ["\n    .counter { padding: 1rem; margin-bottom: 1rem; border-radius: 12px; background: #fff8f0; }\n    h2 { margin-top: 0; }\n    label { display: block; margin: .75rem 0; }\n    select { display: block; max-width: 100%; min-height: 44px; margin-top: .25rem; font: inherit; }\n    small { display: block; margin-top: .75rem; }\n    .total { font-size: 1.1rem; }\n  "] }]
    }], null, { admin: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StevenCounterComponent, { className: "StevenCounterComponent", filePath: "src/app/components/steven-counter/steven-counter.component.ts", lineNumber: 67 }); })();
