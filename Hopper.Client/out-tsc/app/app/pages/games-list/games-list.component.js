import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { FilterService } from '@services/filter.service';
import { GamesService } from '@services/games.service';
// Import your game card
import { GameCardComponent } from '@components/game-card/game-card.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
function GamesListComponent_app_game_card_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-game-card", 2);
} if (rf & 2) {
    const game_r1 = ctx.$implicit;
    i0.ɵɵproperty("game", game_r1);
} }
export class GamesListComponent {
    gamesSvc = inject(GamesService);
    filterSvc = inject(FilterService);
    destroyRef = inject(DestroyRef);
    games = [];
    filteredGames = [];
    ngOnInit() {
        combineLatest([
            this.gamesSvc.games$,
            this.filterSvc.filterState$,
        ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([games, filterState]) => {
            this.games = games;
            this.applyFilters(filterState);
        });
    }
    applyFilters(filterState) {
        this.filteredGames = this.games.filter((game) => {
            const date = new Date(game.gameDateTime);
            const matchesSearch = !filterState.searchTerm ||
                game.opponent.name?.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
                game.opponent.city?.toLowerCase().includes(filterState.searchTerm.toLowerCase());
            const matchesAvailability = !filterState.showAvailableOnly || game.remainingTickets > 0;
            const matchesFilters = !filterState.filters ||
                (() => {
                    const monthMatch = !filterState.filters?.months?.length ||
                        filterState.filters.months.includes(date.getMonth() + 1);
                    const dayMatch = !filterState.filters?.daysOfWeek?.length ||
                        filterState.filters.daysOfWeek.includes(date.getDay());
                    return monthMatch && dayMatch;
                })();
            return matchesSearch && matchesAvailability && matchesFilters;
        });
    }
    static ɵfac = function GamesListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GamesListComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: GamesListComponent, selectors: [["app-games-list"]], decls: 2, vars: 1, consts: [[1, "games-list"], [3, "game", 4, "ngFor", "ngForOf"], [3, "game"]], template: function GamesListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, GamesListComponent_app_game_card_1_Template, 1, 1, "app-game-card", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.filteredGames);
        } }, dependencies: [CommonModule, i1.NgForOf, GameCardComponent // 👈 add this so <app-game-card> is known
        ], styles: ["\n\n.games-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding: 24px;   // more breathing room\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GamesListComponent, [{
        type: Component,
        args: [{ selector: 'app-games-list', standalone: true, imports: [
                    CommonModule,
                    GameCardComponent // 👈 add this so <app-game-card> is known
                ], template: "<div class=\"games-list\">\n  <app-game-card *ngFor=\"let game of filteredGames\" [game]=\"game\">\n  </app-game-card>\n</div>", styles: ["\n\n/* Add spacing back to game cards */\n.games-list {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding: 24px;   // more breathing room\n}"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(GamesListComponent, { className: "GamesListComponent", filePath: "src/app/pages/games-list/games-list.component.ts", lineNumber: 23 }); })();
