import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "ngx-toastr";
export class ToastService {
    toastr;
    constructor(toastr) {
        this.toastr = toastr;
    }
    show(message, title = 'Notice') {
        this.toastr.info(message, title, {
            timeOut: 5000,
            progressBar: true,
            closeButton: true,
        });
    }
    success(message, title) {
        this.toastr.success(message, title);
    }
    error(message, title) {
        this.toastr.error(message, title);
    }
    info(message, title) {
        this.toastr.info(message, title);
    }
    warning(message, title) {
        this.toastr.warning(message, title);
    }
    static ɵfac = function ToastService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ToastService)(i0.ɵɵinject(i1.ToastrService)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ToastService, factory: ToastService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ToastService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.ToastrService }], null); })();
