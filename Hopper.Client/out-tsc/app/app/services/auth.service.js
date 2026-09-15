import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, tap } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class AuthService {
    http;
    static sessionVersion = '2';
    apiUrl = `${environment.apiUrl}/participants`;
    currentUserSubject = new BehaviorSubject(null);
    currentUser$ = this.currentUserSubject.asObservable();
    constructor(http) {
        this.http = http;
        const stored = localStorage.getItem('user');
        const token = localStorage.getItem('sessionToken');
        const version = localStorage.getItem('sessionVersion');
        if (stored && token && version === AuthService.sessionVersion) {
            this.currentUserSubject.next(JSON.parse(stored));
        }
        else {
            localStorage.removeItem('user');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('sessionVersion');
        }
    }
    login(participant, pin) {
        const claim = { firebaseUserId: participant.firebaseUserId, pin };
        return this.http.post(`${this.apiUrl}/claim`, claim)
            .pipe(tap(res => {
            if (res.success) {
                localStorage.setItem('user', JSON.stringify(participant));
                localStorage.setItem('sessionToken', res.token);
                localStorage.setItem('sessionVersion', AuthService.sessionVersion);
                this.currentUserSubject.next(participant);
            }
        }));
    }
    logout() {
        this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
        localStorage.removeItem('user');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionVersion');
        this.currentUserSubject.next(null);
    }
    get currentUser() {
        return this.currentUserSubject.value;
    }
    static ɵfac = function AuthService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthService)(i0.ɵɵinject(i1.HttpClient)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
