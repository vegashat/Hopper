import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// Your own components
import { HeaderComponent } from '../components/header/header.component';
import { FilterDialogComponent } from '@components/filter-dialog/filter-dialog.component';
import { RankingSuggestionDialogComponent } from '@components/ranking-suggestion-dialog/ranking-suggestion-dialog.component';
// Services & models
import { FilterService } from '@services/filter.service';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { DraftService } from '@services/draft.service';
import { GameRankingsService } from '@services/game-rankings.service';
import { GamesService } from '@services/games.service';
import { SelectionsService } from '@services/selections.service';
import { SeasonService } from '@services/season.service';
import { combineLatest, forkJoin } from 'rxjs';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/router";
import * as i4 from "@angular/material/sidenav";
import * as i5 from "@angular/material/toolbar";
import * as i6 from "@angular/material/list";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/button";
import * as i9 from "@angular/material/badge";
import * as i10 from "@angular/material/tooltip";
function ShellComponent_a_31_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 26);
    i0.ɵɵlistener("click", function ShellComponent_a_31_Template_a_click_0_listener() { i0.ɵɵrestoreView(_r3); i0.ɵɵnextContext(); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.close()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "admin_panel_settings");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 4);
    i0.ɵɵtext(4, "Admin");
    i0.ɵɵelementEnd()();
} }
function ShellComponent_button_67_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 27);
    i0.ɵɵlistener("click", function ShellComponent_button_67_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r4 = i0.ɵɵnextContext(); ctx_r4.searchTerm = ""; return i0.ɵɵresetView(ctx_r4.onSearchChange("")); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "close");
    i0.ɵɵelementEnd()();
} }
export class ShellComponent {
    filterSvc = inject(FilterService);
    dialog = inject(MatDialog);
    auth = inject(AuthService);
    toast = inject(ToastService);
    draftService = inject(DraftService);
    rankingsService = inject(GameRankingsService);
    gamesService = inject(GamesService);
    selectionsService = inject(SelectionsService);
    seasonService = inject(SeasonService);
    searchTerm = '';
    searchOpen = false;
    showAvailableOnly = false;
    filters = null;
    isCompact = false;
    isUserTurn = false;
    currentUser = null;
    subs = [];
    promptedDraftPickId = null;
    checkingDraftPickId = null;
    constructor() {
        this.updateCompactMode();
    }
    ngOnInit() {
        // Track logged-in user
        this.subs.push(this.auth.currentUser$.subscribe(user => {
            if (!this.currentUser && user) {
                this.searchTerm = '';
                this.filterSvc.setSearchTerm('');
            }
            this.currentUser = user;
        }));
        this.subs.push(combineLatest([this.auth.currentUser$, this.draftService.draftStatus$]).subscribe(([user, status]) => {
            const nextPick = status?.upcoming?.[0];
            this.debugRanking('Turn check', {
                loggedInUserId: user?.firebaseUserId ?? null,
                nextPickerId: nextPick?.firebaseUserId ?? null,
                draftPickId: nextPick?.draftPickId ?? null,
                isDraftActive: status?.isActive ?? false
            });
            if (!nextPick || user?.firebaseUserId !== nextPick.firebaseUserId)
                return;
            this.fireUserTurnAlert(nextPick.displayName ?? 'It');
            this.offerRankedGame(status);
        }));
    }
    offerRankedGame(status) {
        const nextPick = status.upcoming[0];
        const user = this.currentUser;
        if (!nextPick || !user || this.promptedDraftPickId === nextPick.draftPickId ||
            this.checkingDraftPickId === nextPick.draftPickId)
            return;
        this.checkingDraftPickId = nextPick.draftPickId;
        const remaining = status.users.find(item => item.firebaseUserId === user.firebaseUserId)?.remaining ?? 0;
        forkJoin({
            rankings: this.rankingsService.get(status.seasonId),
            games: this.gamesService.getSeasonGames(status.seasonId)
        }).subscribe({
            next: ({ rankings, games }) => {
                this.checkingDraftPickId = null;
                const gameById = new Map(games.map(game => [game.gameId, game]));
                const ranking = rankings
                    .filter(item => !item.isFulfilled && item.quantity <= remaining)
                    .sort((a, b) => a.rankOrder - b.rankOrder)
                    .find(item => (gameById.get(item.gameId)?.remainingTickets ?? 0) >= item.quantity);
                this.debugRanking('Suggestion candidates loaded', {
                    draftPickId: nextPick.draftPickId,
                    remainingAllotment: remaining,
                    rankings: rankings.map(item => ({
                        gameId: item.gameId,
                        rankOrder: item.rankOrder,
                        quantity: item.quantity,
                        isFulfilled: item.isFulfilled,
                        gameTicketsRemaining: gameById.get(item.gameId)?.remainingTickets ?? null
                    })),
                    selectedRankingId: ranking?.gameRankingId ?? null
                });
                this.promptedDraftPickId = nextPick.draftPickId;
                if (!ranking) {
                    this.toast.warning('It is your turn, but none of your ranked choices are currently available. Please choose manually.');
                    return;
                }
                const game = gameById.get(ranking.gameId);
                const dialogRef = this.dialog.open(RankingSuggestionDialogComponent, {
                    width: '420px',
                    maxWidth: '95vw',
                    disableClose: true,
                    data: { game, ranking }
                });
                dialogRef.afterClosed().subscribe(confirmed => {
                    if (!confirmed)
                        return;
                    const selection = {
                        draftPickId: nextPick.draftPickId,
                        firebaseUserId: nextPick.firebaseUserId,
                        displayName: nextPick.displayName,
                        gameId: ranking.gameId,
                        quantity: ranking.quantity,
                        pickedUtc: new Date().toISOString()
                    };
                    this.selectionsService.makeSelection(status.seasonId, [selection], ranking.gameRankingId).subscribe({
                        next: () => this.draftService.loadStatus(this.seasonService.currentSeasonId),
                        error: () => this.toast.error('That ranked game is no longer available. Please choose another game.')
                    });
                });
            },
            error: error => {
                this.checkingDraftPickId = null;
                this.debugRanking('Suggestion request failed', error);
                this.toast.error('Unable to check your ranked games');
            }
        });
    }
    debugRanking(message, details) {
        if (!environment.production)
            console.debug(`[Ranking suggestion] ${message}`, details);
    }
    fireUserTurnAlert(name) {
        this.isUserTurn = true;
        this.toast.show(`${name}, it is your pick!`);
        setTimeout(() => (this.isUserTurn = false), 8000);
    }
    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
    toggleSearch() {
        this.searchOpen = !this.searchOpen;
        if (!this.searchOpen) {
            this.searchTerm = '';
            this.filterSvc.setSearchTerm('');
        }
    }
    onSearchChange(term) {
        this.searchTerm = term;
        this.filterSvc.setSearchTerm(term);
    }
    openFilterDialog() {
        this.dialog.open(FilterDialogComponent, {
            width: '400px',
            data: {
                filters: this.filters,
                showAvailableOnly: false
            }
        });
    }
    filterCount() {
        let count = 0;
        if (this.filters?.months?.length)
            count += this.filters.months.length;
        if (this.filters?.daysOfWeek?.length)
            count += this.filters.daysOfWeek.length;
        return count;
    }
    onResize() {
        this.updateCompactMode();
    }
    updateCompactMode() {
        this.isCompact = window.innerWidth < 600;
    }
    static ɵfac = function ShellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ShellComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ShellComponent, selectors: [["app-shell"]], hostBindings: function ShellComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function ShellComponent_resize_HostBindingHandler() { return ctx.onResize(); }, false, i0.ɵɵresolveWindow);
        } }, decls: 68, vars: 9, consts: [["sidenav", ""], [1, "shell-container"], ["mode", "over", 1, "sidenav"], ["mat-list-item", "", "routerLink", "/games", "routerLinkActive", "active-link", 3, "click"], [1, "link-label"], ["mat-list-item", "", "routerLink", "/calendar", "routerLinkActive", "active-link", 3, "click"], ["mat-list-item", "", "routerLink", "/history", "routerLinkActive", "active-link", 3, "click"], ["mat-list-item", "", "routerLink", "/participants", "routerLinkActive", "active-link", 3, "click"], ["mat-list-item", "", "routerLink", "/rankings", "routerLinkActive", "active-link", 3, "click"], ["mat-list-item", "", "routerLink", "/admin", "routerLinkActive", "active-link", 3, "click", 4, "ngIf"], ["mat-list-item", "", "routerLink", "/draft-status", "routerLinkActive", "active-link", 3, "click"], [1, "shell-layout"], [3, "menuToggle"], [1, "shell-content"], ["color", "accent", 1, "shell-footer", "games-toolbar"], [1, "toolbar-left"], ["mat-icon-button", "", "routerLink", "/games"], ["mat-icon-button", "", "routerLink", "/calendar"], ["mat-icon-button", "", "routerLink", "/history"], ["mat-icon-button", "", "routerLink", "/participants"], ["mat-icon-button", "", "routerLink", "/rankings", "aria-label", "My Rankings"], [1, "toolbar-center"], [1, "search-box"], ["type", "text", "name", "game-search", "role", "searchbox", "autocomplete", "off", "autocapitalize", "off", "spellcheck", "false", "placeholder", "Search games", 3, "ngModelChange", "ngModel"], ["mat-icon-button", "", "matTooltip", "Filter", "matBadgeColor", "warn", 3, "click", "matBadge", "matBadgeHidden"], ["mat-icon-button", "", "class", "clear-btn", 3, "click", 4, "ngIf"], ["mat-list-item", "", "routerLink", "/admin", "routerLinkActive", "active-link", 3, "click"], ["mat-icon-button", "", 1, "clear-btn", 3, "click"]], template: function ShellComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "mat-sidenav-container", 1)(1, "mat-sidenav", 2, 0)(3, "mat-toolbar");
            i0.ɵɵtext(4, "Hopper");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "mat-nav-list")(6, "a", 3);
            i0.ɵɵlistener("click", function ShellComponent_Template_a_click_6_listener() { i0.ɵɵrestoreView(_r1); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.close()); });
            i0.ɵɵelementStart(7, "mat-icon");
            i0.ɵɵtext(8, "sports_basketball");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "span", 4);
            i0.ɵɵtext(10, "Games");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "a", 5);
            i0.ɵɵlistener("click", function ShellComponent_Template_a_click_11_listener() { i0.ɵɵrestoreView(_r1); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.close()); });
            i0.ɵɵelementStart(12, "mat-icon");
            i0.ɵɵtext(13, "calendar_month");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "span", 4);
            i0.ɵɵtext(15, "Calendar");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "a", 6);
            i0.ɵɵlistener("click", function ShellComponent_Template_a_click_16_listener() { i0.ɵɵrestoreView(_r1); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.close()); });
            i0.ɵɵelementStart(17, "mat-icon");
            i0.ɵɵtext(18, "history");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "span", 4);
            i0.ɵɵtext(20, "History");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(21, "a", 7);
            i0.ɵɵlistener("click", function ShellComponent_Template_a_click_21_listener() { i0.ɵɵrestoreView(_r1); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.close()); });
            i0.ɵɵelementStart(22, "mat-icon");
            i0.ɵɵtext(23, "groups");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "span", 4);
            i0.ɵɵtext(25, "Participants");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(26, "a", 8);
            i0.ɵɵlistener("click", function ShellComponent_Template_a_click_26_listener() { i0.ɵɵrestoreView(_r1); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.close()); });
            i0.ɵɵelementStart(27, "mat-icon");
            i0.ɵɵtext(28, "format_list_numbered");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "span", 4);
            i0.ɵɵtext(30, "My Rankings");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(31, ShellComponent_a_31_Template, 5, 0, "a", 9);
            i0.ɵɵelementStart(32, "a", 10);
            i0.ɵɵlistener("click", function ShellComponent_Template_a_click_32_listener() { i0.ɵɵrestoreView(_r1); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.close()); });
            i0.ɵɵelementStart(33, "mat-icon");
            i0.ɵɵtext(34, "assignment");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "span", 4);
            i0.ɵɵtext(36, "Draft Status");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(37, "mat-sidenav-content")(38, "div", 11)(39, "app-header", 12);
            i0.ɵɵlistener("menuToggle", function ShellComponent_Template_app_header_menuToggle_39_listener() { i0.ɵɵrestoreView(_r1); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.toggle()); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "div", 13);
            i0.ɵɵelement(41, "router-outlet");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "mat-toolbar", 14)(43, "div", 15)(44, "button", 16)(45, "mat-icon");
            i0.ɵɵtext(46, "sports_basketball");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(47, "button", 17)(48, "mat-icon");
            i0.ɵɵtext(49, "calendar_month");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "button", 18)(51, "mat-icon");
            i0.ɵɵtext(52, "history");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(53, "button", 19)(54, "mat-icon");
            i0.ɵɵtext(55, "groups");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(56, "button", 20)(57, "mat-icon");
            i0.ɵɵtext(58, "format_list_numbered");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(59, "div", 21)(60, "div", 22)(61, "mat-icon");
            i0.ɵɵtext(62, "search");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(63, "input", 23);
            i0.ɵɵtwoWayListener("ngModelChange", function ShellComponent_Template_input_ngModelChange_63_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.searchTerm, $event) || (ctx.searchTerm = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵlistener("ngModelChange", function ShellComponent_Template_input_ngModelChange_63_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSearchChange($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "button", 24);
            i0.ɵɵlistener("click", function ShellComponent_Template_button_click_64_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openFilterDialog()); });
            i0.ɵɵelementStart(65, "mat-icon");
            i0.ɵɵtext(66, "filter_list");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(67, ShellComponent_button_67_Template, 3, 0, "button", 25);
            i0.ɵɵelementEnd()()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(31);
            i0.ɵɵproperty("ngIf", ctx.currentUser == null ? null : ctx.currentUser.isAdmin);
            i0.ɵɵadvance(7);
            i0.ɵɵclassProp("pulse-background", ctx.isUserTurn);
            i0.ɵɵadvance(21);
            i0.ɵɵclassProp("compact", ctx.isCompact);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.searchTerm);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matBadge", ctx.filterCount())("matBadgeHidden", ctx.filterCount() === 0);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngIf", ctx.searchTerm);
        } }, dependencies: [CommonModule, i1.NgIf, FormsModule, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgModel, RouterModule, i3.RouterOutlet, i3.RouterLink, i3.RouterLinkActive, 
            // Angular Material
            MatSidenavModule, i4.MatSidenav, i4.MatSidenavContainer, i4.MatSidenavContent, MatToolbarModule, i5.MatToolbar, MatListModule, i6.MatNavList, i6.MatListItem, MatIconModule, i7.MatIcon, MatButtonModule, i8.MatIconButton, MatBadgeModule, i9.MatBadge, MatTooltipModule, i10.MatTooltip, MatDialogModule,
            // App Components
            HeaderComponent], styles: [".shell-container[_ngcontent-%COMP%]    > mat-sidenav-content[_ngcontent-%COMP%] {\n  height: 100%;\n  overflow: hidden;\n}\n\n.shell-container[_ngcontent-%COMP%] {\n  height: 100vh;\n  height: 100dvh;\n}\n\n.shell-layout[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  transition: box-shadow 0.3s ease; // smooth glow\n}\n\n.shell-header[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  position: sticky;\n  top: 0;\n  z-index: 100;\n}\n\n.shell-content[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-height: 0;\n  min-width: 0;\n  overflow-y: auto;\n  padding: .5rem;\n  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));\n\n  background: linear-gradient(\n    180deg,\n    #f77a52 0%,   // softened Thunder orange\n    #ffb74d 50%,  // mid orange\n    #ffe0b2 100%  // pale toward bottom\n  );\n}\n\n.shell-layout[_ngcontent-%COMP%]    > app-header[_ngcontent-%COMP%] { flex-shrink: 0; }\n\n.shell-footer[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  position: sticky;\n  bottom: 0;\n  z-index: 100;\n}\n\n.games-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 4px 8px;\n\n  .toolbar-left,\n  .toolbar-right {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n  }\n\n  .toolbar-center {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex: 1;\n    transition: all 0.3s ease;\n\n    .search-box {\n      display: flex;\n      align-items: center;\n      background: white;\n      border-radius: 24px;\n      padding: 4px 8px;\n      min-width: 260px;\n      max-width: 500px;\n      height: 42px;\n      box-shadow: 0 2px 6px rgba(0,0,0,0.2);\n\n      mat-icon {\n        margin-right: 6px;\n        color: #666;\n      }\n\n      input {\n        border: none;\n        outline: none;\n        flex: 1;\n        background: transparent;\n        font-size: 1rem;\n      }\n    }\n  }\n\n  .clear-btn {\n    width: 36px;\n    height: 36px;\n\n    mat-icon {\n      font-size: 20px;\n      color: #888;\n    }\n  }\n}\n\n@media (max-width: 600px) {\n  //[_ngcontent-%COMP%]   Use[_ngcontent-%COMP%]   document[_ngcontent-%COMP%]   scrolling[_ngcontent-%COMP%]   on[_ngcontent-%COMP%]   phones[_ngcontent-%COMP%]   so[_ngcontent-%COMP%]   no[_ngcontent-%COMP%]   viewport-sized[_ngcontent-%COMP%]   ancestor[_ngcontent-%COMP%]   clips[_ngcontent-%COMP%]   the[_ngcontent-%COMP%]   list.\n[_ngcontent-%COMP%]   .shell-container[_ngcontent-%COMP%] {\n    height: auto;\n    min-height: 100dvh;\n    overflow: visible;\n  }\n\n  .shell-container[_ngcontent-%COMP%]    > mat-sidenav-content[_ngcontent-%COMP%] {\n    height: auto;\n    overflow: visible;\n  }\n\n  .shell-layout[_ngcontent-%COMP%] {\n    height: auto;\n    min-height: 100dvh;\n    overflow: visible;\n  }\n\n  .shell-layout[_ngcontent-%COMP%]    > app-header[_ngcontent-%COMP%] {\n    position: sticky;\n    top: 0;\n    z-index: 100;\n  }\n\n  .shell-content[_ngcontent-%COMP%] {\n    flex: 1 0 auto;\n    overflow: visible;\n  }\n\n  .games-toolbar[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n}\n\n\n\n@keyframes _ngcontent-%COMP%_glowPulse {\n  0% {\n    box-shadow: 0 0 0 rgba(255, 215, 0, 0);\n  }\n  50% {\n    box-shadow: 0 0 60px rgba(255, 215, 0, 0.9);\n  }\n  100% {\n    box-shadow: 0 0 0 rgba(255, 215, 0, 0);\n  }\n}\n\n.pulse-background[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_glowPulse 1.5s ease-in-out infinite;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ShellComponent, [{
        type: Component,
        args: [{ selector: 'app-shell', standalone: true, imports: [
                    CommonModule,
                    FormsModule,
                    RouterModule,
                    RouterOutlet,
                    // Angular Material
                    MatSidenavModule,
                    MatToolbarModule,
                    MatListModule,
                    MatIconModule,
                    MatButtonModule,
                    MatBadgeModule,
                    MatTooltipModule,
                    MatDialogModule,
                    // App Components
                    HeaderComponent,
                ], template: "<mat-sidenav-container class=\"shell-container\">\n  <mat-sidenav #sidenav mode=\"over\" class=\"sidenav\">\n    <mat-toolbar>Hopper</mat-toolbar>\n    <mat-nav-list>\n      <a mat-list-item routerLink=\"/games\" routerLinkActive=\"active-link\" (click)=\"sidenav.close()\">\n        <mat-icon>sports_basketball</mat-icon>\n        <span class=\"link-label\">Games</span>\n      </a>\n      <a mat-list-item routerLink=\"/calendar\" routerLinkActive=\"active-link\" (click)=\"sidenav.close()\">\n        <mat-icon>calendar_month</mat-icon>\n        <span class=\"link-label\">Calendar</span>\n      </a>\n      <a mat-list-item routerLink=\"/history\" routerLinkActive=\"active-link\" (click)=\"sidenav.close()\">\n        <mat-icon>history</mat-icon>\n        <span class=\"link-label\">History</span>\n      </a>\n      <a mat-list-item routerLink=\"/participants\" routerLinkActive=\"active-link\" (click)=\"sidenav.close()\">\n        <mat-icon>groups</mat-icon>\n        <span class=\"link-label\">Participants</span>\n      </a>\n      <a mat-list-item routerLink=\"/rankings\" routerLinkActive=\"active-link\" (click)=\"sidenav.close()\">\n        <mat-icon>format_list_numbered</mat-icon>\n        <span class=\"link-label\">My Rankings</span>\n      </a>\n      <a *ngIf=\"currentUser?.isAdmin\" mat-list-item routerLink=\"/admin\" routerLinkActive=\"active-link\" (click)=\"sidenav.close()\">\n        <mat-icon>admin_panel_settings</mat-icon>\n        <span class=\"link-label\">Admin</span>\n      </a>\n      <a mat-list-item routerLink=\"/draft-status\" routerLinkActive=\"active-link\" (click)=\"sidenav.close()\">\n        <mat-icon>assignment</mat-icon>\n        <span class=\"link-label\">Draft Status</span>\n      </a>\n    </mat-nav-list>\n  </mat-sidenav>\n\n  <mat-sidenav-content>\n    <!-- Apply pulse only here -->\n    <div class=\"shell-layout\" [class.pulse-background]=\"isUserTurn\">\n      <!-- Header sticks at top -->\n      <app-header (menuToggle)=\"sidenav.toggle()\"></app-header>\n\n      <!-- Scrollable content -->\n      <div class=\"shell-content\">\n        <router-outlet></router-outlet>\n      </div>\n\n      <!-- Footer toolbar -->\n      <mat-toolbar color=\"accent\" class=\"shell-footer games-toolbar\">\n        <!-- Left: Quick links -->\n        <div class=\"toolbar-left\">\n          <button mat-icon-button routerLink=\"/games\"><mat-icon>sports_basketball</mat-icon></button>\n          <button mat-icon-button routerLink=\"/calendar\"><mat-icon>calendar_month</mat-icon></button>\n          <button mat-icon-button routerLink=\"/history\"><mat-icon>history</mat-icon></button>\n          <button mat-icon-button routerLink=\"/participants\"><mat-icon>groups</mat-icon></button>\n          <button mat-icon-button routerLink=\"/rankings\" aria-label=\"My Rankings\"><mat-icon>format_list_numbered</mat-icon></button>\n        </div>\n\n        <!-- Center/Right: Search -->\n        <div class=\"toolbar-center\" [class.compact]=\"isCompact\">\n          <div class=\"search-box\">\n            <mat-icon>search</mat-icon>\n            <input\n              type=\"text\"\n              name=\"game-search\"\n              role=\"searchbox\"\n              autocomplete=\"off\"\n              autocapitalize=\"off\"\n              spellcheck=\"false\"\n              placeholder=\"Search games\"\n              [(ngModel)]=\"searchTerm\"\n              (ngModelChange)=\"onSearchChange($event)\" />\n\n            <!-- Filter -->\n            <button\n              mat-icon-button\n              (click)=\"openFilterDialog()\"\n              matTooltip=\"Filter\"\n              [matBadge]=\"filterCount()\"\n              matBadgeColor=\"warn\"\n              [matBadgeHidden]=\"filterCount() === 0\">\n              <mat-icon>filter_list</mat-icon>\n            </button>\n\n            <!-- Clear button -->\n            <button *ngIf=\"searchTerm\" mat-icon-button class=\"clear-btn\" (click)=\"searchTerm=''; onSearchChange('')\">\n              <mat-icon>close</mat-icon>\n            </button>\n          </div>\n        </div>\n      </mat-toolbar>\n    </div>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n", styles: [".shell-container > mat-sidenav-content {\n  height: 100%;\n  overflow: hidden;\n}\n\n.shell-container {\n  height: 100vh;\n  height: 100dvh;\n}\n\n.shell-layout {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  transition: box-shadow 0.3s ease; // smooth glow\n}\n\n.shell-header {\n  flex-shrink: 0;\n  position: sticky;\n  top: 0;\n  z-index: 100;\n}\n\n.shell-content {\n  flex: 1 1 0;\n  min-height: 0;\n  min-width: 0;\n  overflow-y: auto;\n  padding: .5rem;\n  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));\n\n  background: linear-gradient(\n    180deg,\n    #f77a52 0%,   // softened Thunder orange\n    #ffb74d 50%,  // mid orange\n    #ffe0b2 100%  // pale toward bottom\n  );\n}\n\n.shell-layout > app-header { flex-shrink: 0; }\n\n.shell-footer {\n  flex-shrink: 0;\n  position: sticky;\n  bottom: 0;\n  z-index: 100;\n}\n\n.games-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 4px 8px;\n\n  .toolbar-left,\n  .toolbar-right {\n    display: flex;\n    align-items: center;\n    gap: 0.5rem;\n  }\n\n  .toolbar-center {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex: 1;\n    transition: all 0.3s ease;\n\n    .search-box {\n      display: flex;\n      align-items: center;\n      background: white;\n      border-radius: 24px;\n      padding: 4px 8px;\n      min-width: 260px;\n      max-width: 500px;\n      height: 42px;\n      box-shadow: 0 2px 6px rgba(0,0,0,0.2);\n\n      mat-icon {\n        margin-right: 6px;\n        color: #666;\n      }\n\n      input {\n        border: none;\n        outline: none;\n        flex: 1;\n        background: transparent;\n        font-size: 1rem;\n      }\n    }\n  }\n\n  .clear-btn {\n    width: 36px;\n    height: 36px;\n\n    mat-icon {\n      font-size: 20px;\n      color: #888;\n    }\n  }\n}\n\n@media (max-width: 600px) {\n  // Use document scrolling on phones so no viewport-sized ancestor clips the list.\n  .shell-container {\n    height: auto;\n    min-height: 100dvh;\n    overflow: visible;\n  }\n\n  .shell-container > mat-sidenav-content {\n    height: auto;\n    overflow: visible;\n  }\n\n  .shell-layout {\n    height: auto;\n    min-height: 100dvh;\n    overflow: visible;\n  }\n\n  .shell-layout > app-header {\n    position: sticky;\n    top: 0;\n    z-index: 100;\n  }\n\n  .shell-content {\n    flex: 1 0 auto;\n    overflow: visible;\n  }\n\n  .games-toolbar {\n    display: none !important;\n  }\n}\n\n/* Strong glow animation */\n@keyframes glowPulse {\n  0% {\n    box-shadow: 0 0 0 rgba(255, 215, 0, 0);\n  }\n  50% {\n    box-shadow: 0 0 60px rgba(255, 215, 0, 0.9);\n  }\n  100% {\n    box-shadow: 0 0 0 rgba(255, 215, 0, 0);\n  }\n}\n\n.pulse-background {\n  animation: glowPulse 1.5s ease-in-out infinite;\n}\n"] }]
    }], () => [], { onResize: [{
            type: HostListener,
            args: ['window:resize']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src/app/shell/shell.component.ts", lineNumber: 61 }); })();
