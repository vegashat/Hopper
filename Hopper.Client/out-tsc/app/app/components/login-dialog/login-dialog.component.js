import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@angular/common/http";
import * as i3 from "@services/auth.service";
import * as i4 from "@services/season.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/form-field";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/button";
import * as i10 from "@angular/forms";
function LoginDialogComponent_mat_option_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", p_r1.firebaseUserId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", p_r1.displayName, " (", p_r1.allottedTickets, " tickets) ");
} }
function LoginDialogComponent_mat_form_field_12_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-form-field", 2)(1, "mat-label");
    i0.ɵɵtext(2, "Confirm new PIN");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 15);
    i0.ɵɵtwoWayListener("ngModelChange", function LoginDialogComponent_mat_form_field_12_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.confirmPin, $event) || (ctx_r2.confirmPin = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.confirmPin);
    i0.ɵɵproperty("disabled", ctx_r2.loading);
} }
function LoginDialogComponent_p_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "You can reset your PIN yourself once. After that, ask the administrator.");
    i0.ɵɵelementEnd();
} }
function LoginDialogComponent_p_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Your self-service reset has been used. Ask the administrator for another reset.");
    i0.ɵɵelementEnd();
} }
function LoginDialogComponent_button_15_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 16);
    i0.ɵɵlistener("click", function LoginDialogComponent_button_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.beginReset()); });
    i0.ɵɵtext(1, "Forgot PIN?");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r2.loading || !ctx_r2.selectedUser || ctx_r2.resetUsed);
} }
function LoginDialogComponent_p_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.message);
} }
function LoginDialogComponent_div_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.error);
} }
function LoginDialogComponent_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 16);
    i0.ɵɵlistener("click", function LoginDialogComponent_button_19_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); ctx_r2.resetting = false; ctx_r2.pin = ""; ctx_r2.confirmPin = ""; return i0.ɵɵresetView(ctx_r2.error = null); });
    i0.ɵɵtext(1, "Back to login");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r2.loading);
} }
export class LoginDialogComponent {
    dialogRef;
    http;
    auth;
    season;
    data;
    participants = [];
    selectedUser = null;
    pin = '';
    loading = false;
    resetting = false;
    confirmPin = '';
    message = null;
    error = null;
    constructor(dialogRef, http, auth, season, data) {
        this.dialogRef = dialogRef;
        this.http = http;
        this.auth = auth;
        this.season = season;
        this.data = data;
    }
    ngOnInit() {
        this.http.get(`${environment.apiUrl}/participants`, {
            params: { seasonId: this.season.currentSeasonId }
        }).subscribe({
            next: (users) => (this.participants = users),
            error: () => (this.error = 'Failed to load participants')
        });
    }
    beginReset() {
        this.resetting = true;
        this.pin = '';
        this.confirmPin = '';
        this.error = null;
        this.message = null;
    }
    resetPin() {
        if (!this.selectedUser || !this.pin || this.pin !== this.confirmPin) {
            this.error = 'Select a participant and enter matching new PINs.';
            return;
        }
        this.loading = true;
        this.http.post(`${environment.apiUrl}/participants/reset-pin`, {
            firebaseUserId: this.selectedUser, pin: this.pin
        }).subscribe({
            next: () => {
                const user = this.participants.find(p => p.firebaseUserId === this.selectedUser);
                if (user)
                    user.pinResetUsed = true;
                this.loading = false;
                this.resetting = false;
                this.error = null;
                this.pin = '';
                this.confirmPin = '';
                this.message = 'PIN reset. Log in with your new PIN. Future resets require the administrator.';
            },
            error: err => {
                this.loading = false;
                this.error = err.error?.message || 'Unable to reset PIN. Please ask the administrator.';
            }
        });
    }
    get resetUsed() {
        return !!this.participants.find(p => p.firebaseUserId === this.selectedUser)?.pinResetUsed;
    }
    login() {
        if (!this.selectedUser || !this.pin) {
            this.error = 'Please select a user and enter a PIN.';
            return;
        }
        var user = this.participants.filter(p => p.firebaseUserId == this.selectedUser)[0];
        this.loading = true;
        this.auth.login(user, this.pin).subscribe({
            next: (res) => {
                this.loading = false;
                if (res.success) {
                    this.dialogRef.close(true);
                }
                else {
                    this.error = res.message;
                }
            },
            error: () => {
                this.loading = false;
                this.error = 'Login failed';
            }
        });
    }
    cancel() {
        this.dialogRef.close(false);
    }
    static ɵfac = function LoginDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoginDialogComponent)(i0.ɵɵdirectiveInject(i1.MatDialogRef), i0.ɵɵdirectiveInject(i2.HttpClient), i0.ɵɵdirectiveInject(i3.AuthService), i0.ɵɵdirectiveInject(i4.SeasonService), i0.ɵɵdirectiveInject(MAT_DIALOG_DATA)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoginDialogComponent, selectors: [["app-login-dialog"]], decls: 24, vars: 18, consts: [["mat-dialog-title", ""], ["mat-dialog-content", ""], ["appearance", "fill", 1, "full-width"], ["name", "participant", 3, "ngModelChange", "selectionChange", "disabled", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["matInput", "", "type", "password", "name", "current-password", 3, "ngModelChange", "ngModel", "disabled", "autocomplete"], ["appearance", "fill", "class", "full-width", 4, "ngIf"], [4, "ngIf"], ["mat-button", "", 3, "disabled", "click", 4, "ngIf"], ["role", "status", 4, "ngIf"], ["class", "error", "role", "alert", 4, "ngIf"], ["mat-dialog-actions", "", "align", "end"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], [3, "value"], ["matInput", "", "type", "password", "autocomplete", "new-password", 3, "ngModelChange", "ngModel", "disabled"], ["mat-button", "", 3, "click", "disabled"], ["role", "status"], ["role", "alert", 1, "error"]], template: function LoginDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "h2", 0);
            i0.ɵɵtext(1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "div", 1)(3, "mat-form-field", 2)(4, "mat-label");
            i0.ɵɵtext(5, "Select Participant");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "mat-select", 3);
            i0.ɵɵtwoWayListener("ngModelChange", function LoginDialogComponent_Template_mat_select_ngModelChange_6_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selectedUser, $event) || (ctx.selectedUser = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function LoginDialogComponent_Template_mat_select_selectionChange_6_listener() { ctx.pin = ""; ctx.confirmPin = ""; ctx.error = null; return ctx.message = null; });
            i0.ɵɵtemplate(7, LoginDialogComponent_mat_option_7_Template, 2, 3, "mat-option", 4);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(8, "mat-form-field", 2)(9, "mat-label");
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "input", 5);
            i0.ɵɵtwoWayListener("ngModelChange", function LoginDialogComponent_Template_input_ngModelChange_11_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.pin, $event) || (ctx.pin = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(12, LoginDialogComponent_mat_form_field_12_Template, 4, 2, "mat-form-field", 6)(13, LoginDialogComponent_p_13_Template, 2, 0, "p", 7)(14, LoginDialogComponent_p_14_Template, 2, 0, "p", 7)(15, LoginDialogComponent_button_15_Template, 2, 1, "button", 8)(16, LoginDialogComponent_p_16_Template, 2, 1, "p", 9)(17, LoginDialogComponent_div_17_Template, 2, 1, "div", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div", 11);
            i0.ɵɵtemplate(19, LoginDialogComponent_button_19_Template, 2, 1, "button", 8);
            i0.ɵɵelementStart(20, "button", 12);
            i0.ɵɵlistener("click", function LoginDialogComponent_Template_button_click_20_listener() { return ctx.cancel(); });
            i0.ɵɵtext(21, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "button", 13);
            i0.ɵɵlistener("click", function LoginDialogComponent_Template_button_click_22_listener() { return ctx.resetting ? ctx.resetPin() : ctx.login(); });
            i0.ɵɵtext(23);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.resetting ? "Reset PIN" : "Login");
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("disabled", ctx.loading);
            i0.ɵɵtwoWayProperty("ngModel", ctx.selectedUser);
            i0.ɵɵattribute("autocomplete", "off");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.participants);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.resetting ? "New PIN" : "PIN");
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.pin);
            i0.ɵɵproperty("disabled", ctx.loading)("autocomplete", ctx.resetting ? "new-password" : "current-password");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.resetting);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.resetting);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.selectedUser && ctx.resetUsed);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.resetting);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.message);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.error);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.resetting);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("disabled", ctx.loading || ctx.resetting && ctx.resetUsed);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.resetting ? "Reset PIN" : "Login", " ");
        } }, dependencies: [CommonModule, i5.NgForOf, i5.NgIf, MatDialogModule, i1.MatDialogTitle, i1.MatDialogActions, i1.MatDialogContent, MatFormFieldModule, i6.MatFormField, i6.MatLabel, MatSelectModule, i7.MatSelect, i7.MatOption, MatInputModule, i8.MatInput, MatButtonModule, i9.MatButton, FormsModule, i10.DefaultValueAccessor, i10.NgControlStatus, i10.NgModel], styles: [".full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.error[_ngcontent-%COMP%] {\n  color: red;\n  margin-top: 0.5rem;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoginDialogComponent, [{
        type: Component,
        args: [{ selector: 'app-login-dialog', standalone: true, imports: [
                    CommonModule,
                    MatDialogModule,
                    MatFormFieldModule,
                    MatSelectModule,
                    MatInputModule,
                    MatButtonModule,
                    FormsModule
                ], template: "<h2 mat-dialog-title>{{ resetting ? 'Reset PIN' : 'Login' }}</h2>\n<div mat-dialog-content>\n  <mat-form-field appearance=\"fill\" class=\"full-width\">\n    <mat-label>Select Participant</mat-label>\n    <mat-select [disabled]=\"loading\" [(ngModel)]=\"selectedUser\" (selectionChange)=\"pin = ''; confirmPin = ''; error = null; message = null\" name=\"participant\" [attr.autocomplete]=\"'off'\">\n      <mat-option *ngFor=\"let p of participants\" [value]=\"p.firebaseUserId\">\n        {{ p.displayName }} ({{ p.allottedTickets }} tickets)\n      </mat-option>\n    </mat-select>\n  </mat-form-field>\n\n  <mat-form-field appearance=\"fill\" class=\"full-width\">\n    <mat-label>{{ resetting ? 'New PIN' : 'PIN' }}</mat-label>\n    <input matInput [(ngModel)]=\"pin\" type=\"password\" name=\"current-password\"\n      [disabled]=\"loading\" [autocomplete]=\"resetting ? 'new-password' : 'current-password'\" />\n  </mat-form-field>\n\n  <mat-form-field *ngIf=\"resetting\" appearance=\"fill\" class=\"full-width\">\n    <mat-label>Confirm new PIN</mat-label>\n    <input matInput [(ngModel)]=\"confirmPin\" type=\"password\" autocomplete=\"new-password\" [disabled]=\"loading\" />\n  </mat-form-field>\n  <p *ngIf=\"resetting\">You can reset your PIN yourself once. After that, ask the administrator.</p>\n  <p *ngIf=\"selectedUser && resetUsed\">Your self-service reset has been used. Ask the administrator for another reset.</p>\n  <button *ngIf=\"!resetting\" mat-button (click)=\"beginReset()\" [disabled]=\"loading || !selectedUser || resetUsed\">Forgot PIN?</button>\n  <p *ngIf=\"message\" role=\"status\">{{ message }}</p>\n  <div *ngIf=\"error\" class=\"error\" role=\"alert\">{{ error }}</div>\n</div>\n\n<div mat-dialog-actions align=\"end\">\n  <button *ngIf=\"resetting\" mat-button [disabled]=\"loading\"\n    (click)=\"resetting = false; pin = ''; confirmPin = ''; error = null\">Back to login</button>\n  <button mat-button (click)=\"cancel()\">Cancel</button>\n  <button mat-raised-button color=\"primary\" (click)=\"resetting ? resetPin() : login()\" [disabled]=\"loading || (resetting && resetUsed)\">\n    {{ resetting ? 'Reset PIN' : 'Login' }}\n  </button>\n</div>\n", styles: [".full-width {\n  width: 100%;\n}\n\n.error {\n  color: red;\n  margin-top: 0.5rem;\n}"] }]
    }], () => [{ type: i1.MatDialogRef }, { type: i2.HttpClient }, { type: i3.AuthService }, { type: i4.SeasonService }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoginDialogComponent, { className: "LoginDialogComponent", filePath: "src/app/components/login-dialog/login-dialog.component.ts", lineNumber: 30 }); })();
