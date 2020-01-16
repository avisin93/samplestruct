import { Injectable, EventEmitter } from '@angular/core';

declare var document: any;

@Injectable()
export class DynamicThemeService {
 // tslint:disable
  public static getThemeStylingRule (colors) {
    let headerBackgroundColor = 'body md-toolbar.mat-toolbar.mat-primary { background-color: ' + colors[0] + '}',
            sidebarBackgroundColor = 'body md-sidenav.mat-sidenav { background-color: ' + colors[1] + '}',
            sidenavTextColor = 'body .mat-nav-list .mat-list-item { color: ' + colors[2] + '!important}',
            sidenavTextHoverColor = 'body .mat-nav-list .mat-list-item:hover, body .mat-nav-list .mat-list-item.active { background-color: ' + colors[3] + '!important}',
            headerTextColor = 'body  md-toolbar.mat-toolbar .logged-user-info .user-details span { color: ' + colors[4] + '}',
            mainHeadingColor = 'body  .heading-breadcrumbs--wrap .heading, body .breadcrumb li a, body .breadcrumb>.active{ color: ' + colors[5] + '}',
            bodyTextColor = 'body .full-width-input-wrap.mat-form-field .mat-input-wrapper .mat-input-placeholder,'
                + 'body .full-width-input-wrap .mat-select .mat-select-placeholder, body .full-width-input-wrap.mat-form-field '
                + '.mat-input-wrapper .mat-input-element, body .full-width-input-wrap .mat-select .mat-select-value,'
                + 'body .client-setup-tabs-wrap .client-setup-tabs-card .client-setup-tabs ul li.current-tab, .client-setup-tabs-wrap'
                + ' .client-setup-tabs-card .client-setup-tabs ul li:hover { color : ' + colors[6] + '}',
            primaryButtonColor = 'body .app-btn.mat-button.orange-button { background-color: ' + colors[7] + '}',
            primaryHoverButtonColor = 'body .app-btn.mat-button.orange-button:hover { background-color: ' + colors[8] + '}',
            dropdowmButtonColor = 'body .button-dropdown button.mat-button { background-color: ' + colors[7] + '!important}',
            dropdowmHoverButtonColor = 'body .button-dropdown button.mat-button :hover { background-color: ' + colors[8] + '!important}';

        let styleColors = [
            headerBackgroundColor,
            sidebarBackgroundColor,
            sidenavTextColor,
            sidenavTextHoverColor,
            headerTextColor,
            mainHeadingColor,
            bodyTextColor,
            primaryButtonColor,
            primaryHoverButtonColor,
            dropdowmButtonColor,
            dropdowmHoverButtonColor
        ];
        return styleColors.join(' ');
    }

    public static setThemeStyling(rule, id) {
        let css: any = document.createElement('style');
        css.id = id;
        css.type = 'text/css';
        if (css.styleSheet) {
            css.styleSheet.cssText = rule;
        } else {
            css.appendChild(document.createTextNode(rule));
        }

        document.getElementsByTagName("head")[0].appendChild(css);
    }

    public static removeThemeStyling(styleId) {
        if (document.getElementById(styleId) !== null) {
            // document.getElementById(styleId).remove();
            // @ts-ignore
            $('#' + styleId).remove();
        }
    }
}