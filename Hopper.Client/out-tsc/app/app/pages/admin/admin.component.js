import { AllotmentEditorComponent } from '../../components/allotment-editor/allotment-editor.component';
import { StevenCounterComponent } from '../../components/steven-counter/steven-counter.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ToastService } from '@services/toast.service';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DraftService } from '@services/draft.service';
import { GamesService } from '@services/games.service';
import { SeasonService } from '@services/season.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/tabs";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/table";
import * as i5 from "@angular/material/icon";
import * as i6 from "@angular/material/card";
const _c0 = () => ["pickOrder", "displayName"];
const _c1 = () => ["pickOrder", "displayName", "claimedUtc"];
const _c2 = () => ["displayName", "allotment", "picked", "remaining"];
function AdminComponent_div_17_mat_card_5_th_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Order");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_5_td_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(pick_r1.pickOrder);
} }
function AdminComponent_div_17_mat_card_5_th_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "User");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_5_td_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(pick_r2.displayName || "-");
} }
function AdminComponent_div_17_mat_card_5_tr_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 32);
} }
function AdminComponent_div_17_mat_card_5_tr_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 33);
} }
function AdminComponent_div_17_mat_card_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card")(1, "mat-card-title");
    i0.ɵɵtext(2, "Upcoming Picks");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "table", 27);
    i0.ɵɵelementContainerStart(4, 28);
    i0.ɵɵtemplate(5, AdminComponent_div_17_mat_card_5_th_5_Template, 2, 0, "th", 12)(6, AdminComponent_div_17_mat_card_5_td_6_Template, 2, 1, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(7, 29);
    i0.ɵɵtemplate(8, AdminComponent_div_17_mat_card_5_th_8_Template, 2, 0, "th", 12)(9, AdminComponent_div_17_mat_card_5_td_9_Template, 2, 1, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(10, AdminComponent_div_17_mat_card_5_tr_10_Template, 1, 0, "tr", 18)(11, AdminComponent_div_17_mat_card_5_tr_11_Template, 1, 0, "tr", 19);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("dataSource", ctx_r2.status.upcoming);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("matHeaderRowDef", i0.ɵɵpureFunction0(3, _c0));
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", i0.ɵɵpureFunction0(4, _c0));
} }
function AdminComponent_div_17_mat_card_6_th_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Order");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_6_td_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(pick_r4.pickOrder);
} }
function AdminComponent_div_17_mat_card_6_th_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "User");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_6_td_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(pick_r5.displayName || "-");
} }
function AdminComponent_div_17_mat_card_6_th_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Claimed");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_6_td_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const pick_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, pick_r6.claimedUtc, "short"));
} }
function AdminComponent_div_17_mat_card_6_tr_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 32);
} }
function AdminComponent_div_17_mat_card_6_tr_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 33);
} }
function AdminComponent_div_17_mat_card_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card")(1, "mat-card-title");
    i0.ɵɵtext(2, "History");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "table", 27);
    i0.ɵɵelementContainerStart(4, 28);
    i0.ɵɵtemplate(5, AdminComponent_div_17_mat_card_6_th_5_Template, 2, 0, "th", 12)(6, AdminComponent_div_17_mat_card_6_td_6_Template, 2, 1, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(7, 29);
    i0.ɵɵtemplate(8, AdminComponent_div_17_mat_card_6_th_8_Template, 2, 0, "th", 12)(9, AdminComponent_div_17_mat_card_6_td_9_Template, 2, 1, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(10, 34);
    i0.ɵɵtemplate(11, AdminComponent_div_17_mat_card_6_th_11_Template, 2, 0, "th", 12)(12, AdminComponent_div_17_mat_card_6_td_12_Template, 3, 4, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(13, AdminComponent_div_17_mat_card_6_tr_13_Template, 1, 0, "tr", 18)(14, AdminComponent_div_17_mat_card_6_tr_14_Template, 1, 0, "tr", 19);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("dataSource", ctx_r2.status.history);
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("matHeaderRowDef", i0.ɵɵpureFunction0(3, _c1));
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", i0.ɵɵpureFunction0(4, _c1));
} }
function AdminComponent_div_17_mat_card_7_th_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "User");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_7_td_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r7.displayName);
} }
function AdminComponent_div_17_mat_card_7_th_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Allotment");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_7_td_9_app_allotment_editor_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-allotment-editor", 39);
} if (rf & 2) {
    const u_r8 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("user", u_r8)("status", ctx_r2.status);
} }
function AdminComponent_div_17_mat_card_7_td_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtemplate(1, AdminComponent_div_17_mat_card_7_td_9_app_allotment_editor_1_Template, 1, 2, "app-allotment-editor", 38);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.status);
} }
function AdminComponent_div_17_mat_card_7_th_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Picked");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_7_td_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r9.picked);
} }
function AdminComponent_div_17_mat_card_7_th_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Remaining");
    i0.ɵɵelementEnd();
} }
function AdminComponent_div_17_mat_card_7_td_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r10 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r10.remaining);
} }
function AdminComponent_div_17_mat_card_7_tr_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 32);
} }
function AdminComponent_div_17_mat_card_7_tr_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 33);
} }
function AdminComponent_div_17_mat_card_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-card")(1, "mat-card-title");
    i0.ɵɵtext(2, "Users");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "table", 27);
    i0.ɵɵelementContainerStart(4, 29);
    i0.ɵɵtemplate(5, AdminComponent_div_17_mat_card_7_th_5_Template, 2, 0, "th", 12)(6, AdminComponent_div_17_mat_card_7_td_6_Template, 2, 1, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(7, 35);
    i0.ɵɵtemplate(8, AdminComponent_div_17_mat_card_7_th_8_Template, 2, 0, "th", 12)(9, AdminComponent_div_17_mat_card_7_td_9_Template, 2, 1, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(10, 36);
    i0.ɵɵtemplate(11, AdminComponent_div_17_mat_card_7_th_11_Template, 2, 0, "th", 12)(12, AdminComponent_div_17_mat_card_7_td_12_Template, 2, 1, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(13, 37);
    i0.ɵɵtemplate(14, AdminComponent_div_17_mat_card_7_th_14_Template, 2, 0, "th", 12)(15, AdminComponent_div_17_mat_card_7_td_15_Template, 2, 1, "td", 13);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(16, AdminComponent_div_17_mat_card_7_tr_16_Template, 1, 0, "tr", 18)(17, AdminComponent_div_17_mat_card_7_tr_17_Template, 1, 0, "tr", 19);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("dataSource", ctx_r2.status.users);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("matHeaderRowDef", i0.ɵɵpureFunction0(3, _c2));
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", i0.ɵɵpureFunction0(4, _c2));
} }
function AdminComponent_div_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 25)(1, "h3");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, AdminComponent_div_17_mat_card_5_Template, 12, 5, "mat-card", 26)(6, AdminComponent_div_17_mat_card_6_Template, 15, 5, "mat-card", 26)(7, AdminComponent_div_17_mat_card_7_Template, 18, 5, "mat-card", 26);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Status: ", ctx_r2.status.isActive ? "Active" : "Inactive", "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Total Tickets Remaining: ", ctx_r2.status.totalTicketsRemaining, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.status.upcoming == null ? null : ctx_r2.status.upcoming.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.status.history == null ? null : ctx_r2.status.history.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.status.users == null ? null : ctx_r2.status.users.length);
} }
function AdminComponent_th_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, " Opponent ");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const game_r11 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", game_r11.opponent, " ");
} }
function AdminComponent_th_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, " Date ");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const game_r12 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(2, 1, game_r12.gameDateTime, "medium"), " ");
} }
function AdminComponent_th_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, " Arena ");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const game_r13 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", game_r13.arena, " ");
} }
function AdminComponent_th_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, " Tickets ");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const game_r14 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", game_r14.remainingTickets, " ");
} }
function AdminComponent_th_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, " Actions ");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31)(1, "button", 40)(2, "mat-icon");
    i0.ɵɵtext(3, "edit");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "button", 41)(5, "mat-icon");
    i0.ɵɵtext(6, "delete");
    i0.ɵɵelementEnd()()();
} }
function AdminComponent_tr_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 32);
} }
function AdminComponent_tr_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 33);
} }
function AdminComponent_th_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, " Name ");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r15 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r15.displayName, " ");
} }
function AdminComponent_th_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, " Email ");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r16 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r16.email, " ");
} }
function AdminComponent_th_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, " Admin ");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r17 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r17.isAdmin ? "Yes" : "No", " ");
} }
function AdminComponent_th_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "PIN recovery");
    i0.ɵɵelementEnd();
} }
function AdminComponent_td_55_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 31)(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 42);
    i0.ɵɵlistener("click", function AdminComponent_td_55_Template_button_click_3_listener() { const p_r19 = i0.ɵɵrestoreView(_r18).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.resetPin(p_r19)); });
    i0.ɵɵtext(4, "Reset PIN");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const p_r19 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(p_r19.pinResetUsed ? "Self-service used" : "Self-service available");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.resettingUser !== null);
} }
function AdminComponent_tr_56_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 32);
} }
function AdminComponent_tr_57_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 33);
} }
export class AdminComponent {
    seasonService = inject(SeasonService);
    seasonId = this.seasonService.currentSeasonId;
    status;
    draftService = inject(DraftService);
    gameService = inject(GamesService);
    destroyRef = inject(DestroyRef);
    http = inject(HttpClient);
    toast = inject(ToastService);
    resettingUser = null;
    resetPin(participant) {
        if (!window.confirm('Reset PIN for ' + participant.displayName + '? Their sessions will end and they must choose a new PIN at their next login.'))
            return;
        this.resettingUser = participant.firebaseUserId;
        this.http.post(`${environment.apiUrl}/participants/${encodeURIComponent(participant.firebaseUserId)}/reset-pin`, {})
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                participant.pinResetUsed = true;
                this.resettingUser = null;
                this.toast.success('PIN cleared. Participant can choose a new PIN at login.');
            },
            error: () => {
                this.resettingUser = null;
                this.toast.error('Unable to reset PIN.');
            }
        });
    }
    constructor() { }
    ngOnInit() {
        this.loadStatus();
        this.http.get(`${environment.apiUrl}/participants`)
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: participants => this.participants = participants,
            error: () => this.toast.error('Unable to load participants.')
        });
    }
    games = [
        { gameId: 1, opponent: 'Charlotte Hornets', gameDateTime: new Date(), arena: 'Paycom', remainingTickets: 2 },
        { gameId: 2, opponent: 'Denver Nuggets', gameDateTime: new Date(), arena: 'Paycom', remainingTickets: 4 },
    ];
    participants = [];
    displayedGameColumns = ['opponent', 'date', 'arena', 'tickets', 'actions'];
    displayedParticipantColumns = ['name', 'isAdmin', 'pinReset'];
    loadStatus() {
        this.draftService.draftStatus$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
            this.status = status ?? undefined;
        });
    }
    startDraft() {
        this.draftService.startDraft(this.seasonId).subscribe({
            next: (draft) => {
                this.draftService.loadStatus(this.seasonId);
                this.gameService.loadSeasonGames(this.seasonId);
                console.log('Draft started:', draft);
            },
            error: (err) => console.error('Failed to start draft', err),
        });
    }
    resetDraft() {
        this.draftService.resetDraft(this.seasonId).subscribe({
            next: () => {
                this.draftService.loadStatus(this.seasonId);
                this.gameService.loadSeasonGames(this.seasonId);
                console.log('Draft reset');
            },
            error: (err) => console.error('Failed to reset draft', err),
        });
    }
    static ɵfac = function AdminComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AdminComponent, selectors: [["app-admin"]], decls: 58, vars: 10, consts: [["label", "Fun"], [3, "admin"], ["label", "Draft"], [1, "draft-controls"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["mat-raised-button", "", "color", "warn", 3, "click", "disabled"], ["class", "draft-status", 4, "ngIf"], ["label", "Games"], [1, "tab-actions"], ["mat-raised-button", "", "color", "primary"], ["mat-table", "", 1, "mat-elevation-z2", "full-width-table", 3, "dataSource"], ["matColumnDef", "opponent"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "date"], ["matColumnDef", "arena"], ["matColumnDef", "tickets"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["label", "Participants"], ["matColumnDef", "name"], ["matColumnDef", "email"], ["matColumnDef", "isAdmin"], ["matColumnDef", "pinReset"], [1, "draft-status"], [4, "ngIf"], ["mat-table", "", 1, "mat-elevation-z1", 3, "dataSource"], ["matColumnDef", "pickOrder"], ["matColumnDef", "displayName"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""], ["matColumnDef", "claimedUtc"], ["matColumnDef", "allotment"], ["matColumnDef", "picked"], ["matColumnDef", "remaining"], [3, "user", "status", 4, "ngIf"], [3, "user", "status"], ["mat-icon-button", "", "color", "accent"], ["mat-icon-button", "", "color", "warn"], ["mat-button", "", 3, "click", "disabled"]], template: function AdminComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "mat-card")(1, "mat-card-title");
            i0.ɵɵtext(2, "Admin Panel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "mat-card-content")(4, "mat-tab-group")(5, "mat-tab", 0);
            i0.ɵɵelement(6, "app-steven-counter", 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "mat-tab", 2)(8, "div", 3)(9, "button", 4);
            i0.ɵɵlistener("click", function AdminComponent_Template_button_click_9_listener() { return ctx.startDraft(); });
            i0.ɵɵelementStart(10, "mat-icon");
            i0.ɵɵtext(11, "play_arrow");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(12, " Start Draft ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "button", 5);
            i0.ɵɵlistener("click", function AdminComponent_Template_button_click_13_listener() { return ctx.resetDraft(); });
            i0.ɵɵelementStart(14, "mat-icon");
            i0.ɵɵtext(15, "restart_alt");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(16, " Reset Draft ");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(17, AdminComponent_div_17_Template, 8, 5, "div", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "mat-tab", 7)(19, "div", 8)(20, "button", 9)(21, "mat-icon");
            i0.ɵɵtext(22, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(23, " Add Game ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "table", 10);
            i0.ɵɵelementContainerStart(25, 11);
            i0.ɵɵtemplate(26, AdminComponent_th_26_Template, 2, 0, "th", 12)(27, AdminComponent_td_27_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(28, 14);
            i0.ɵɵtemplate(29, AdminComponent_th_29_Template, 2, 0, "th", 12)(30, AdminComponent_td_30_Template, 3, 4, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(31, 15);
            i0.ɵɵtemplate(32, AdminComponent_th_32_Template, 2, 0, "th", 12)(33, AdminComponent_td_33_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(34, 16);
            i0.ɵɵtemplate(35, AdminComponent_th_35_Template, 2, 0, "th", 12)(36, AdminComponent_td_36_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(37, 17);
            i0.ɵɵtemplate(38, AdminComponent_th_38_Template, 2, 0, "th", 12)(39, AdminComponent_td_39_Template, 7, 0, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(40, AdminComponent_tr_40_Template, 1, 0, "tr", 18)(41, AdminComponent_tr_41_Template, 1, 0, "tr", 19);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(42, "mat-tab", 20)(43, "table", 10);
            i0.ɵɵelementContainerStart(44, 21);
            i0.ɵɵtemplate(45, AdminComponent_th_45_Template, 2, 0, "th", 12)(46, AdminComponent_td_46_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(47, 22);
            i0.ɵɵtemplate(48, AdminComponent_th_48_Template, 2, 0, "th", 12)(49, AdminComponent_td_49_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(50, 23);
            i0.ɵɵtemplate(51, AdminComponent_th_51_Template, 2, 0, "th", 12)(52, AdminComponent_td_52_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(53, 24);
            i0.ɵɵtemplate(54, AdminComponent_th_54_Template, 2, 0, "th", 12)(55, AdminComponent_td_55_Template, 5, 2, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(56, AdminComponent_tr_56_Template, 1, 0, "tr", 18)(57, AdminComponent_tr_57_Template, 1, 0, "tr", 19);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("admin", true);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("disabled", ctx.status == null ? null : ctx.status.isActive);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", !(ctx.status == null ? null : ctx.status.isActive));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.status);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("dataSource", ctx.games);
            i0.ɵɵadvance(16);
            i0.ɵɵproperty("matHeaderRowDef", ctx.displayedGameColumns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.displayedGameColumns);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("dataSource", ctx.participants);
            i0.ɵɵadvance(13);
            i0.ɵɵproperty("matHeaderRowDef", ctx.displayedParticipantColumns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.displayedParticipantColumns);
        } }, dependencies: [AllotmentEditorComponent, StevenCounterComponent,
            CommonModule, i1.NgIf, i1.DatePipe, MatTabsModule, i2.MatTab, i2.MatTabGroup, MatButtonModule, i3.MatButton, i3.MatIconButton, MatTableModule, i4.MatTable, i4.MatHeaderCellDef, i4.MatHeaderRowDef, i4.MatColumnDef, i4.MatCellDef, i4.MatRowDef, i4.MatHeaderCell, i4.MatCell, i4.MatHeaderRow, i4.MatRow, MatIconModule, i5.MatIcon, MatCardModule, i6.MatCard, i6.MatCardContent, i6.MatCardTitle, MatSlideToggleModule], styles: [".full-width-table[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 1rem;\n}\n\n.tab-actions[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n  display: flex;\n  justify-content: flex-end;\n}\n\n.draft-controls[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n  display: flex;\n  gap: 1rem;\n}\n\nmat-card[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding: 1rem;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 0.5rem;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminComponent, [{
        type: Component,
        args: [{ selector: 'app-admin', standalone: true, imports: [AllotmentEditorComponent, StevenCounterComponent,
                    CommonModule,
                    MatTabsModule,
                    MatButtonModule,
                    MatTableModule,
                    MatIconModule,
                    MatCardModule,
                    MatSlideToggleModule,
                ], template: "<mat-card>\n  <mat-card-title>Admin Panel</mat-card-title>\n  <mat-card-content>\n    <mat-tab-group>\n      <mat-tab label=\"Fun\"><app-steven-counter [admin]=\"true\"></app-steven-counter></mat-tab>\n\n\n      <!-- Draft Tab -->\n      <mat-tab label=\"Draft\">\n        <div class=\"draft-controls\">\n          <button mat-raised-button color=\"primary\" (click)=\"startDraft()\" [disabled]=\"status?.isActive\">\n            <mat-icon>play_arrow</mat-icon> Start Draft\n          </button>\n          <button mat-raised-button color=\"warn\" (click)=\"resetDraft()\" [disabled]=\"!status?.isActive\">\n            <mat-icon>restart_alt</mat-icon> Reset Draft\n          </button>\n        </div>\n\n        <div *ngIf=\"status\" class=\"draft-status\">\n          <h3>Status: {{ status.isActive ? 'Active' : 'Inactive' }}</h3>\n          <p>Total Tickets Remaining: {{ status.totalTicketsRemaining }}</p>\n\n          <!-- Upcoming Picks -->\n          <mat-card *ngIf=\"status.upcoming?.length\">\n            <mat-card-title>Upcoming Picks</mat-card-title>\n            <table mat-table [dataSource]=\"status.upcoming\" class=\"mat-elevation-z1\">\n              <ng-container matColumnDef=\"pickOrder\">\n                <th mat-header-cell *matHeaderCellDef>Order</th>\n                <td mat-cell *matCellDef=\"let pick\">{{ pick.pickOrder }}</td>\n              </ng-container>\n              <ng-container matColumnDef=\"displayName\">\n                <th mat-header-cell *matHeaderCellDef>User</th>\n                <td mat-cell *matCellDef=\"let pick\">{{ pick.displayName || '-' }}</td>\n              </ng-container>\n              <tr mat-header-row *matHeaderRowDef=\"['pickOrder','displayName']\"></tr>\n              <tr mat-row *matRowDef=\"let row; columns: ['pickOrder','displayName'];\"></tr>\n            </table>\n          </mat-card>\n\n          <!-- History -->\n          <mat-card *ngIf=\"status.history?.length\">\n            <mat-card-title>History</mat-card-title>\n            <table mat-table [dataSource]=\"status.history\" class=\"mat-elevation-z1\">\n              <ng-container matColumnDef=\"pickOrder\">\n                <th mat-header-cell *matHeaderCellDef>Order</th>\n                <td mat-cell *matCellDef=\"let pick\">{{ pick.pickOrder }}</td>\n              </ng-container>\n              <ng-container matColumnDef=\"displayName\">\n                <th mat-header-cell *matHeaderCellDef>User</th>\n                <td mat-cell *matCellDef=\"let pick\">{{ pick.displayName || '-' }}</td>\n              </ng-container>\n              <ng-container matColumnDef=\"claimedUtc\">\n                <th mat-header-cell *matHeaderCellDef>Claimed</th>\n                <td mat-cell *matCellDef=\"let pick\">{{ pick.claimedUtc | date:'short' }}</td>\n              </ng-container>\n              <tr mat-header-row *matHeaderRowDef=\"['pickOrder','displayName','claimedUtc']\"></tr>\n              <tr mat-row *matRowDef=\"let row; columns: ['pickOrder','displayName','claimedUtc'];\"></tr>\n            </table>\n          </mat-card>\n\n          <!-- Users -->\n          <mat-card *ngIf=\"status.users?.length\">\n            <mat-card-title>Users</mat-card-title>\n            <table mat-table [dataSource]=\"status.users\" class=\"mat-elevation-z1\">\n              <ng-container matColumnDef=\"displayName\">\n                <th mat-header-cell *matHeaderCellDef>User</th>\n                <td mat-cell *matCellDef=\"let u\">{{ u.displayName }}</td>\n              </ng-container>\n              <ng-container matColumnDef=\"allotment\">\n                <th mat-header-cell *matHeaderCellDef>Allotment</th>\n                <td mat-cell *matCellDef=\"let u\"><app-allotment-editor *ngIf=\"status\" [user]=\"u\" [status]=\"status\"></app-allotment-editor></td>\n              </ng-container>\n              <ng-container matColumnDef=\"picked\">\n                <th mat-header-cell *matHeaderCellDef>Picked</th>\n                <td mat-cell *matCellDef=\"let u\">{{ u.picked }}</td>\n              </ng-container>\n              <ng-container matColumnDef=\"remaining\">\n                <th mat-header-cell *matHeaderCellDef>Remaining</th>\n                <td mat-cell *matCellDef=\"let u\">{{ u.remaining }}</td>\n              </ng-container>\n              <tr mat-header-row *matHeaderRowDef=\"['displayName','allotment','picked','remaining']\"></tr>\n              <tr mat-row *matRowDef=\"let row; columns: ['displayName','allotment','picked','remaining'];\"></tr>\n            </table>\n          </mat-card>\n        </div>\n      </mat-tab>\n            <!-- Games Tab -->\n      <mat-tab label=\"Games\">\n        <div class=\"tab-actions\">\n          <button mat-raised-button color=\"primary\">\n            <mat-icon>add</mat-icon> Add Game\n          </button>\n        </div>\n\n        <table mat-table [dataSource]=\"games\" class=\"mat-elevation-z2 full-width-table\">\n          <!-- Opponent -->\n          <ng-container matColumnDef=\"opponent\">\n            <th mat-header-cell *matHeaderCellDef> Opponent </th>\n            <td mat-cell *matCellDef=\"let game\"> {{ game.opponent }} </td>\n          </ng-container>\n\n          <!-- Date -->\n          <ng-container matColumnDef=\"date\">\n            <th mat-header-cell *matHeaderCellDef> Date </th>\n            <td mat-cell *matCellDef=\"let game\"> {{ game.gameDateTime | date:'medium' }} </td>\n          </ng-container>\n\n          <!-- Arena -->\n          <ng-container matColumnDef=\"arena\">\n            <th mat-header-cell *matHeaderCellDef> Arena </th>\n            <td mat-cell *matCellDef=\"let game\"> {{ game.arena }} </td>\n          </ng-container>\n\n          <!-- Tickets -->\n          <ng-container matColumnDef=\"tickets\">\n            <th mat-header-cell *matHeaderCellDef> Tickets </th>\n            <td mat-cell *matCellDef=\"let game\"> {{ game.remainingTickets }} </td>\n          </ng-container>\n\n          <!-- Actions -->\n          <ng-container matColumnDef=\"actions\">\n            <th mat-header-cell *matHeaderCellDef> Actions </th>\n            <td mat-cell *matCellDef=\"let game\">\n              <button mat-icon-button color=\"accent\">\n                <mat-icon>edit</mat-icon>\n              </button>\n              <button mat-icon-button color=\"warn\">\n                <mat-icon>delete</mat-icon>\n              </button>\n            </td>\n          </ng-container>\n\n          <tr mat-header-row *matHeaderRowDef=\"displayedGameColumns\"></tr>\n          <tr mat-row *matRowDef=\"let row; columns: displayedGameColumns\"></tr>\n        </table>\n      </mat-tab>\n\n\n      <!-- Participants Tab -->\n      <mat-tab label=\"Participants\">\n        <table mat-table [dataSource]=\"participants\" class=\"mat-elevation-z2 full-width-table\">\n          <!-- Name -->\n          <ng-container matColumnDef=\"name\">\n            <th mat-header-cell *matHeaderCellDef> Name </th>\n            <td mat-cell *matCellDef=\"let p\"> {{ p.displayName }} </td>\n          </ng-container>\n\n          <!-- Email -->\n          <ng-container matColumnDef=\"email\">\n            <th mat-header-cell *matHeaderCellDef> Email </th>\n            <td mat-cell *matCellDef=\"let p\"> {{ p.email }} </td>\n          </ng-container>\n\n          <!-- Is Admin -->\n          <ng-container matColumnDef=\"isAdmin\">\n            <th mat-header-cell *matHeaderCellDef> Admin </th>\n            <td mat-cell *matCellDef=\"let p\">\n              {{ p.isAdmin ? 'Yes' : 'No' }}\n            </td>\n          </ng-container>\n\n          <ng-container matColumnDef=\"pinReset\">\n            <th mat-header-cell *matHeaderCellDef>PIN recovery</th>\n            <td mat-cell *matCellDef=\"let p\">\n              <span>{{ p.pinResetUsed ? 'Self-service used' : 'Self-service available' }}</span>\n              <button mat-button (click)=\"resetPin(p)\" [disabled]=\"resettingUser !== null\">Reset PIN</button>\n            </td>\n          </ng-container>\n          <tr mat-header-row *matHeaderRowDef=\"displayedParticipantColumns\"></tr>\n          <tr mat-row *matRowDef=\"let row; columns: displayedParticipantColumns\"></tr>\n        </table>\n      </mat-tab>\n\n    </mat-tab-group>\n  </mat-card-content>\n</mat-card>", styles: [".full-width-table {\n  width: 100%;\n  margin-top: 1rem;\n}\n\n.tab-actions {\n  margin: 1rem 0;\n  display: flex;\n  justify-content: flex-end;\n}\n\n.draft-controls {\n  margin-bottom: 1rem;\n  display: flex;\n  gap: 1rem;\n}\n\nmat-card {\n  margin-top: 1rem;\n  padding: 1rem;\n}\n\ntable {\n  width: 100%;\n  margin-top: 0.5rem;\n}"] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AdminComponent, { className: "AdminComponent", filePath: "src/app/pages/admin/admin.component.ts", lineNumber: 36 }); })();
