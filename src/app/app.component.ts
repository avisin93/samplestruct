import { Component, HostBinding, OnInit } from '@angular/core';
declare var $: any;

import { SettingsService } from './core/settings/settings.service';
import { TranslatorService } from './core/translator/translator.service';
import { SessionService, NavigationService } from './common';
import { COOKIES_CONSTANTS, LANGUAGE_CODES, LOCAL_STORAGE_CONSTANTS, ROUTER_LINKS_FULL_PATH } from './config';
import { ActivatedRoute, Params, Router, RoutesRecognized, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/pairwise';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    selectedLang: any;
    isFirefox: Boolean = false;
    isChrome: Boolean = false;
    isSafari: Boolean = false;
    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.layout.isFixed; }
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.layout.isCollapsed; }
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.layout.isBoxed; }
    @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.layout.useFullLayout; }
    @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.layout.hiddenFooter; }
    @HostBinding('class.layout-h') get horizontal() { return this.settings.layout.horizontal; }
    @HostBinding('class.aside-float') get isFloat() { return this.settings.layout.isFloat; }
    @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.layout.offsidebarOpen; }
    @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.layout.asideToggled; }
    @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.layout.isCollapsedText; }

    constructor(
        public settings: SettingsService,
        public translator: TranslatorService,
        public sessionService: SessionService,
        private navigationService: NavigationService,
    ) { }

    ngOnInit() {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            this.isFirefox = true;
        } else {
            this.isFirefox = false;
        }
        // if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ) {
        //     this.isChrome = true;
        // } else {
        //     this.isChrome = false;
        // }
        // const isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
        this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/OPR/.test(navigator.userAgent) && !/UBrowser/.test(navigator.userAgent);
        // this.isEdge = /edge\//i.test(window.navigator.userAgent);
        this.isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
            navigator.userAgent &&
            navigator.userAgent.indexOf('CriOS') == -1 &&
            navigator.userAgent.indexOf('FxiOS') == -1;
        if (/CriOS/i.test(navigator.userAgent) &&
            /iphone|ipod|ipad/i.test(navigator.userAgent)) {
            this.isChrome = true;
        }
         if (!this.isChrome && !this.isFirefox && !this.isSafari) {
         this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.incompatibleBrowser]);
         }

        $(document).on('click', '[href="#"]', e => e.preventDefault());
        this.selectedLang = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
        this.translator.useLanguage(this.selectedLang);
        if (!this.sessionService.getCookie(COOKIES_CONSTANTS.langCode)) {
            this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, LANGUAGE_CODES.en_US);
            this.sessionService.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.langCode, LANGUAGE_CODES.en_US);
        }
    }

}

