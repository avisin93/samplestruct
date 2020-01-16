import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { Subscription } from 'rxjs/Subscription';

import { MenuService } from '../../core/menu/menu.service';
import { SettingsService } from '../../core/settings/settings.service';
import { SharedData } from '../../shared/shared.data';
import { ACTION_TYPES, EVENT_TYPES, ROLE_PERMISSION_KEY } from '@app/config';
import { Common, SessionService, TriggerService, EncriptionService } from '@app/common';
import { LoginService } from '../../routes/pages/login/login.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [LoginService]
})
export class SidebarComponent implements OnInit, OnDestroy {
  ACTION_TYPES = ACTION_TYPES;
  menuItems: Array<any>;
  router: Router;
  sbclickEvent = 'click.sidebar-toggle';
  $doc: any = null;
  userInfo: any;
  permissionArr: any;
  selectedModuleId: any;
  subscription: Subscription;
  constructor(
    public menu: MenuService,
    public settings: SettingsService,
    public injector: Injector,
    private sharedData: SharedData,
    private sessionService: SessionService,
    private triggerService: TriggerService,
    private loginService: LoginService,
    private _encriptionService: EncriptionService
  ) {

    this.menuItems = menu.getMenu();

  }

  ngOnInit() {
    this.setUserInfo();
    // this.userInfo = Common.parseJwt(this.sessionService.getCookie(COOKIES_CONSTANTS.authToken));
    this.router = this.injector.get(Router);

    this.router.events.subscribe((val) => {
      // close any submenu opened when route changes
      this.removeFloatingNav();
      // scroll view to top
      // window.scrollTo(0, 0);
      // close sidebar on route change
      this.settings.layout.asideToggled = false;
    });
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        var eventType = data.event['type'];
      }
      if (eventType == EVENT_TYPES.updateProfileEvent) {
        this.setUserInfo();
      }
      if (eventType == EVENT_TYPES.roleAccessPermission) {
        this.getPermissionArr();
        this.updateUserInfo();
      }
    })
    // enable sidebar autoclose from extenal clicks
    this.anyClickClose();
    this.getPermissionArr();

  }


  updateUserInfo() {
    this.userInfo = this.sharedData.getUsersInfo();
  }


  setUserInfo() {
    if (this.sharedData.getUsersInfo) {
      this.updateUserInfo();
    } else {
      this.loginService.getUserInfo().subscribe((result: any) => {
        if (Common.checkStatusCode(result.header.statusCode)) {
          if (result.payload) {
            let userInfoData = result.payload;
            const rolesObj = (userInfoData.rolesDetails.length > 0) ? userInfoData.rolesDetails[0] : {};
            const userInfo = {
              id: userInfoData.id,
              name: userInfoData.i18n.displayName,
              profilePicUrl: userInfoData.profilePicUrl,
              roleId: rolesObj.id,
              roleName: rolesObj.roleName,
              rolesArr: userInfoData.roles,
              rolesDetails: userInfoData.rolesDetails,
              emailId: userInfoData.emailId
            };
            if (userInfoData.rolePermission) {
              userInfo['rolePermission'] = this.encryptData(userInfoData.rolePermission);
            }
            this.sharedData.setUsersInfo(userInfo);
            this.userInfo = this.sharedData.getUsersInfo();
          }
        }
      });
    }

  }
  /*
* This method is used to encrypt Role Permission data.
*/
  encryptData(data: any) {
    const rolePermissionJSONData = this._encriptionService.setEncryptedData(JSON.stringify(data), ROLE_PERMISSION_KEY);
    return rolePermissionJSONData.toString();
  }


  getPermissionArr() {
    this.permissionArr = this.sharedData.getRolePermissionData();
  }
  anyClickClose() {
    this.$doc = $(document).on(this.sbclickEvent, (e) => {
      if (!$(e.target).parents('.aside-container').length) {
        this.settings.layout.asideToggled = false;
      }
    });
  }




  ngOnDestroy() {
    if (this.$doc)
      this.$doc.off(this.sbclickEvent);

    this.subscription.unsubscribe();
  }

  toggleSubmenuClick(event, id) {
    if (this.selectedModuleId != id) {
      $('.parent-item').removeClass("opened");
    }
    this.selectedModuleId = id;
    if ($("li.opened").length > 0 && $("li.opened a").hasClass('parent-item')) {
      if (!$('#arrow' + id).parents('li').hasClass('opened') && !$('#arrow' + id).hasClass('opened')) {
        $('li.opened').removeClass("opened");
        $('#arrow' + id).addClass("opened");
      } else {
        $('li.opened').removeClass("opened");
        $('#arrow' + id).removeClass("opened");
      }
    } else {
      $('#arrow' + id).toggleClass("opened");
    }

    if (!this.isSidebarCollapsed() && !this.isSidebarCollapsedText() && !this.isEnabledHover()) {
      event.preventDefault();

      let target = $(event.target || event.srcElement || event.currentTarget);
      let ul, anchor = target;

      // find the UL
      if (!target.is('a')) {
        anchor = target.parent('a').first();
      }
      ul = anchor.next();

      // hide other submenus
      let parentNav = ul.parents('.sidebar-subnav');
      $('.sidebar-subnav').each((idx, el) => {
        let $el = $(el);
        // if element is not a parent or self ul
        if (!$el.is(parentNav) && !$el.is(ul)) {
          this.closeMenu($el);
        }
      });

      // abort if not UL to process
      if (!ul.length) {
        return;
      }

      // any child menu should start closed
      ul.find('.sidebar-subnav').each((idx, el) => {
        this.closeMenu($(el));
      });

      // toggle UL height
      if (parseInt(ul.height(), 0)) {
        this.closeMenu(ul);
      }
      else {
        // expand menu
        ul.on('transitionend', () => {
          ul.height('auto').off('transitionend');
        }).height(ul[0].scrollHeight);
        // add class to manage animation
        ul.addClass('opening');
      }

    }

  }

  // Close menu collapsing height
  closeMenu(elem) {
    elem.height(elem[0].scrollHeight); // set height
    elem.height(0); // and move to zero to collapse
    elem.removeClass('opening');
  }

  toggleSubmenuHover(event) {
    let self = this;
    if (this.isSidebarCollapsed() || this.isSidebarCollapsedText() || this.isEnabledHover()) {
      event.preventDefault();

      this.removeFloatingNav();

      let target = $(event.target || event.srcElement || event.currentTarget);
      let ul, anchor = target;
      // find the UL
      if (!target.is('a')) {
        anchor = target.parent('a');
      }
      ul = anchor.next();

      if (!ul.length) {
        return; // if not submenu return
      }

      let $aside = $('.aside-container');
      let $asideInner = $aside.children('.aside-inner'); // for top offset calculation
      let $sidebar = $asideInner.children('.sidebar');
      let mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);
      let itemTop = ((anchor.parent().position().top) + mar) - $sidebar.scrollTop();

      let floatingNav = ul.clone().appendTo($aside);
      let vwHeight = $(window).height();

      // let itemTop = anchor.position().top || anchor.offset().top;

      floatingNav
        .removeClass('opening') // necesary for demo if switched between normal//collapsed mode
        .addClass('nav-floating')
        .css({
          position: this.settings.layout.isFixed ? 'fixed' : 'absolute',
          top: itemTop,
          bottom: (floatingNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
        });

      floatingNav
        .on('mouseleave', () => { floatingNav.remove(); })
        .find('a').on('click', function (e) {
          e.preventDefault(); // prevents page reload on click
          // get the exact route path to navigate
          let routeTo = $(this).attr('route');
          if (routeTo) self.router.navigate([routeTo]);
        });

      this.listenForExternalClicks();

    }

  }

  listenForExternalClicks() {
    let $doc = $(document).on('click.sidebar', (e) => {
      if (!$(e.target).parents('.aside-container').length) {
        this.removeFloatingNav();
        $doc.off('click.sidebar');
      }
    });
  }

  removeFloatingNav() {
    $('.nav-floating').remove();
  }

  isSidebarCollapsed() {
    return this.settings.layout.isCollapsed;
  }
  isSidebarCollapsedText() {
    return this.settings.layout.isCollapsedText;
  }
  isEnabledHover() {
    return this.settings.layout.asideHover;
  }
}
