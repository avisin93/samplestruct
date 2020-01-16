import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Input,
  ViewChild,
  HostListener,
  ViewEncapsulation,
  SimpleChanges
} from '@angular/core';
import { StorageService } from '../../providers/storage.service';
import { DOCUMENT,DomSanitizer } from '@angular/platform-browser';
import { MatSidenav } from '@angular/material';
import { EmitterService } from '../../providers/emitter.service';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { SessionService } from '../../providers/session.service';
import { Router } from '@angular/router';

interface Menus {
  name: string;
  link: string;
  icon: string;
  submenus?: Array<any>;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SidenavComponent implements OnInit, OnDestroy {

  logo: string;
  deeplink: string;
  logotooltip: string;
  collapseLogo: String;
  @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;
  @Input('menus') menus: Array<Menus> = [];
  menusFiltrated = [];
  @Input('sidenav') sidenav: MatSidenav;
  isSideNavOpen = false;
  constructor (@Inject(DOCUMENT) private _doc,
              private sanitizer: DomSanitizer,
              private router: Router) { }

  ngOnChanges (changes: SimpleChanges) {
    this.updateMenus(changes.menus.currentValue);
  }

  updateMenus (array) {
    this.menusFiltrated = array;
  }

  ngOnInit () {
    this.logo = 'assets/images/logo.png';
    this.collapseLogo = 'assets/images/menu-collapsed-logo.png';
    this.logotooltip = 'exela';
    this.deeplink = 'https://www.exelatech.com';

    if (null != StorageService.get(StorageService.logo) && undefined !== StorageService.get(StorageService.logo) && '' !== StorageService.get(StorageService.logo)) {
      this.logo = StorageService.get(StorageService.logo);
    }
    if (null != StorageService.get(StorageService.collapseLogo) && undefined !== StorageService.get(StorageService.collapseLogo) && '' !== StorageService.get(StorageService.collapseLogo)) {
      this.collapseLogo = StorageService.get(StorageService.collapseLogo);
    }

    if ('' !== StorageService.get(StorageService.logotooltip) && null != StorageService.get(StorageService.logotooltip) && undefined !== StorageService.get(StorageService.logotooltip)) {
      this.logotooltip = StorageService.get(StorageService.logotooltip);
    }

    if ('' !== StorageService.get(StorageService.deeplink) && null != StorageService.get(StorageService.deeplink) && undefined !== StorageService.get(StorageService.deeplink)) {
      this.deeplink = StorageService.get(StorageService.deeplink);
    }

    this.changeNavMenuSettings();

      // close sidenav on event emitter
    EmitterService.get('close-sidenav').subscribe((data: any) => {
      this.sidenav.close();
    });

    setTimeout(() => {
      this.collapsedContainer();
    }, 2);

      // Subscribe for Sidenav OpenStart Event Emitter
    this.sidenav.openedStart.subscribe(() => {
      this.isSideNavOpen = true;

      this._doc.querySelector('.mat-sidenav-content').classList.remove('closed');
      this._doc.querySelector('.mat-sidenav-content').classList.add('opened');
      this._doc.querySelector('.mat-sidenav').classList.remove('mat-sidenav-closed-init');
      this._doc.querySelector('.mat-sidenav').classList.remove('mat-sidenav-closed');
      this._doc.querySelector('mat-sidenav').classList.add('mat-sidenav-opened');
    });

      // Subscribe for Sidenav onOpen Event Emitter
    this.sidenav._openedStream.subscribe(() => {
      EmitterService.get('menuOpenClosed').emit(true);
    });

    this.sidenav.closedStart.subscribe(() => {
      this.isSideNavOpen = true;
      this._doc.querySelector('.mat-sidenav-content').classList.remove('opened');
      this._doc.querySelector('.mat-sidenav-content').classList.add('closed');
      this._doc.querySelector('mat-sidenav').classList.remove('mat-sidenav-opened');
      this._doc.querySelector('.mat-sidenav').classList.add('mat-sidenav-closed');
    });

      // Subscribe for Sidenav onClose Event Emitter
    this.sidenav._closedStream.subscribe(() => {
      this._doc.querySelector('mat-sidenav').classList.remove('mat-sidenav-opening');
      this._doc.querySelector('mat-sidenav').classList.add('mat-sidenav-closed');
      this.isSideNavOpen = false;
      this.collapsedContainer();
      EmitterService.get('menuOpenClosed').emit(true);
      this.menus.forEach((menu: any) => {
        menu.subMenuOpened = false;
      });

      window.dispatchEvent(new Event('resize'));
    });
    let langRef = StorageService.get(StorageService.langPref);
    this.selectLang(langRef);
    // this.menus.forEach((element) => {
    //   for (let submenu of element.submenus) {
    //     submenu.name = this._translate.instant(submenu.name);
    //   }
    //   element.name = this._translate.instant(element.name);
    // });
    if (StorageService.get(StorageService.userRole) === 'CLIENTADMIN') {
      this.menusFiltrated = this.menus.filter(item => {
        if (item.name !== 'Dashboard') {
          return item;
        }
      });
    } else {
      this.menusFiltrated = this.menus;
    }
  }

  selectLang (lang: string) {
    // this._translate.use(lang);
  }

  @HostListener('window:resize', ['$event'])
  onResize () {
    this.collapsedContainer();
    this.changeNavMenuSettings();
  }

  gotoMenu () {
    if (this.sidenav.mode === 'push' && this.sidenav.opened && window.innerWidth < 992) {
      this.sidenav.close();
    }
  }

  openSubmenu (menu: any) {
    menu.subMenuOpened = !menu.subMenuOpened;
    if (!this.sidenav.opened) {
      this.toggleSidenav();
    }
    return false;
  }

  toggleSidenav () {
    this._doc.querySelector('mat-sidenav').classList.remove('mat-sidenav-opened');
    this._doc.querySelector('mat-sidenav').classList.remove('mat-sidenav-closed');

    this.sidenav.toggle();
  }

  collapsedContainer () {
    if (!this.sidenav.opened && window.innerWidth > 991) {
      this._doc.querySelector('.mat-sidenav-content').style.marginLeft = '64px';
    } else if (window.innerWidth < 992) {
      this._doc.querySelector('.mat-sidenav-content').style.marginLeft = '0px';
    }
  }

  changeNavMenuSettings () {
    if (window.innerWidth < 992) {
      setTimeout(() => {
        this.sidenav.mode = 'push';
        this.sidenav.close();
      }, 100);
    } else {
      setTimeout(() => {
        this.sidenav.mode = 'side';
        this.addRemoveClasses();
      }, 100);
    }
  }

  addRemoveClasses () {
    this._doc.querySelector('.mat-sidenav').classList.remove('mat-sidenav-closing');
    this._doc.querySelector('.mat-sidenav').classList.remove('mat-sidenav-opening');
    this._doc.querySelector('.mat-sidenav-content').classList.remove('opening');
  }

  ngOnDestroy () {
    EmitterService.get('close-sidenav').unsubscribe();
    EmitterService.destroy('close-sidenav');
  }
  callDeeplink () {
    window.open(this.deeplink, '_blank');
  }

  navigateToDashboard (): void {
    if (StorageService.get(StorageService.userRole) !== 'Client User') {
      return;
    }
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }
}
