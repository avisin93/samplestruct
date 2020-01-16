import { Component, OnInit, Input, HostBinding, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatSidenav, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';
import { Router } from '@angular/router';
import { StorageService } from '../../providers/storage.service';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../providers/http.service';
import { SessionService } from '../../providers/session.service';
import { LoginService } from 'src/app/modules/login/login.service';
import { UploadDialogComponent } from 'src/app/modules/contracts/upload-dialog/upload-dialog.component';
import { customTooltipDefaults } from 'src/app/models/constants';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { HeaderService } from './header.service';
import { PopUpComponent } from 'src/app/modules/pop-up/pop-up.component';
import { RequestService } from '../../../request.service';
import { HttpClient } from '@angular/common/http';
import { HeadingSectionComponent } from '../../heading-section/heading-section.component';
const tmsProductId = '6';

interface Menus {
  name: string;
  link: string;
  icon: string;
  submenus?: Array<any>;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults }
  ]
})

export class HeaderComponent implements OnInit {
  userName: string;
  userFullName: string;
  userRole: string;
  userRoles: any[] = [];
  userRoleTitle: String;
  hideGlobalSearch = true;
  tmsAuthId: String;
  // socket: socketIo;
  LogoutButtonName = 'Logout';
  superAdmin = false;
  haveRoleClientAdmin = false;
  isHomePage = false;

  @Input('sidenav') sidenav: MatSidenav;

  @Input('displayToggleMenuButton') displayToggleMenuButton: boolean = true;

  @Input('menus') menus: Array<Menus> = [];

  heading: string = '';
  profilePhoto: String = '';

  @HostBinding('class') classes = 'app-header';
  constructor (@Inject(DOCUMENT) private _doc,
            public dialog: MatDialog,
            public router: Router,
            public _toastCtrl: ToastrService,
            public httpService: HttpService,
            public loginService: LoginService,
            private dialogMatDialog: MatDialog,
            private headerService: HeaderService,
            private matDialog: MatDialog,
            private requestService: RequestService,
            private httpClient: HttpClient
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit () {
    this.userName = (StorageService.get(StorageService.userName) !== 'undefined' ? StorageService.get(StorageService.userName) : 'unknown');
    this.userRole = (StorageService.get(StorageService.userRole) !== 'undefined' ? StorageService.get(StorageService.userRole) : 'unknown');
    this.userRoles = (StorageService.get(StorageService.userRoles) !== 'undefined' ? JSON.parse(StorageService.get(StorageService.userRoles)) : 'unknown');
    this.userRoles = this.userRoles.filter(role => {
      if (role.roleName !== this.userRole) {
        return role;
      }
      if (role.roleName === 'CLIENTADMIN') {
        this.haveRoleClientAdmin = true;
      }
    });
    // this.tmsAuthId = StorageService.get(StorageService.tmsAuthId);
    // if (StorageService.get(StorageService.JWTLogin) === 'tms') {
    //   this.LogoutButtonName = 'Back';
    // }
    this.formatUserRoleTitle();
    // For DMR recipient display this
    if (this.userRole.toUpperCase() === 'RECIPIENT') {
      this.hideGlobalSearch = false;
    }
    // this.socket = socketIo(BaseUrl.$boxofficeCoreUrl, { autoConnect: true });
    // this.initWebSocket(this.userName);
    if (this.sidenav) {
      this.sidenav.close();
    }

    this.headerService.userFullName.subscribe(updatedFullName => {
      this.userFullName = updatedFullName;
    });

    this.headerService.profilePhoto.subscribe(updatedProfilePhoto => {
      this.profilePhoto = updatedProfilePhoto;
    });

    this.headerService.heading.subscribe(updatedHeading => {
      this.heading = updatedHeading;
    });

    this.headerService.setUserFullName((StorageService.get(StorageService.firstName) !== 'undefined' ? StorageService.get(StorageService.firstName) : 'unknown') + ' ' + (StorageService.get(StorageService.lastName) !== 'undefined' ? StorageService.get(StorageService.lastName) : 'unknown'));
    this.headerService.setProfilePhoto((StorageService.get('profilePhoto') !== 'undefined' ? StorageService.get('profilePhoto') : ''));

    /**
     * If have super admin hide switch role options
     */
    this.superAdmin = !this.haveRoleClientAdmin && StorageService.get(StorageService.userRole) === 'SUPERADMIN';
    this.isHomePage = this.router.url === '/home';
  }

  toggleSidenav () {
    this._doc.querySelector('mat-sidenav').classList.remove('mat-sidenav-opened');
    this._doc.querySelector('mat-sidenav').classList.remove('mat-sidenav-closed');
    this.sidenav.toggle();
  }

  formatUserRoleTitle () {
    let userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
    let tmpTitle = '';
    userRoles.forEach((uRole) => {
      tmpTitle += ', ' + uRole.roleName;
    });
    if (tmpTitle.length > 2) {
      tmpTitle = tmpTitle.substring(2);
    }
    this.userRoleTitle = tmpTitle;
    if (userRoles.length > 1 && this.userRole.indexOf('*') < 0) {
      this.userRole += '*';
    }
  }

  logout () {
    this.loginService.logout();
    this.router.navigate(['login']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  search (searchText) {
    // let base = SessionService.get('base-role');
    // base = 'dmr';
    // this.router.navigate(['/' + base + '/recipient-list-view', { searchText: searchText }]);
  }

  myProfile () {
    const base = SessionService.get('base-role');
    this.router.navigate(['/' + base + '/my-profile']);
  }

  routingRule () {
    // StorageService.set(StorageService.autoRoutingRuleFor, 'user')
    // let base = SessionService.get('base-role');
    // this.router.navigate(['/' + base + '/nQube-autorouting-rule', 'user']);
  }

  initWebSocket (username) {
  //   this.socket.on('connect', () => {
  //     this.socket.emit('subscribeNotification', { user: username.toLowerCase(), socket: this.socket.id });
  //     let listenEvent = 'mailBox' + this.socket.id;
  //     this.socket.on(listenEvent, (res) => {
  //       let mailOptions = {
  //         text: res.message
  //       };
  //       this._toastCtrl.snackBar(mailOptions);
  //     });
  //   });
  }

  navigateAddContract () {
    let base = SessionService.get('base-role');
    this.router.navigate(['/' + base + '/contracts/0']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  navigateAddNotification () {
    let base = SessionService.get('base-role');
    this.router.navigate(['/' + base + '/notification/0']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  navigateToNotifications () {
    const base = SessionService.get('base-role');
    this.router.navigate(['/' + base + '/notification/notification-list']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  openCreateContractUploadDialog (): void {
    this.dialogMatDialog.open(UploadDialogComponent, {
      width: '475px',
      height: '325px'
    });
  }

  openChangePasswordDialog (): void {
    this.dialogMatDialog.open(ChangePasswordComponent, {
      width: '500px',
      height: '420px'
    });
  }

  openDialogToConfirmLogOut (): void {
    const data = {
      'heading': 'Log Out',
      'message': 'Are you sure you want to log out?',
      'component': 'log-out',
      'yes': 'Yes',
      'no': 'Cancel'
    };

    const dialogRef = this.matDialog.open(PopUpComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result !== undefined && result.component === 'log-out') {
          this.logout();
        }
      }
    });
  }

  switchToOtherRole (switchRole) {
    this.userRoles = (StorageService.get(StorageService.userRoles) !== 'undefined' ? JSON.parse(StorageService.get(StorageService.userRoles)) : 'unknown');
    const haveUserRole = this.userRoles.some(userRole => userRole.roleName === switchRole);
    if (!haveUserRole) {
      this._toastCtrl.warning('You don\'t have privileges for this role!');
    } else {
      let urlReturn = '';
      const base = SessionService.get('base-role');
      if (switchRole === 'CLIENTADMIN') {
        urlReturn = base + '/exela-client-setup';// HARDCODED DUE TO EXELA HARDCODED LINKS FOR MENUS
      } else if (switchRole === 'Client Editor' || switchRole === 'Editor') {
        urlReturn = base + '/dashboard-configuration';// same as above 'if'
      } else {
        urlReturn = base;// same as above 'if'
      }
      this.userRole = switchRole;
      StorageService.set(StorageService.userRole, switchRole);
      this.router.navigated = false;
      this.router.navigate([[urlReturn]]).then(() => {
        window.location.href = window.location.origin + '/#' + urlReturn;
      }).catch();
    }
  }

  hasMultipleProjects (basicUserInfoResponse) {
    let projects = [];
    basicUserInfoResponse.roles.forEach((role) => {
      role.projects.forEach(item => {
        if (projects.indexOf(item._id) === -1) {
          projects.push(item._id);
        }
      });
    });
    return projects.length > 1;
  }

  checkUserRole (): boolean {
    let role = StorageService.get(StorageService.userRole);
    if (role === 'Client User') {
      return true;
    } else {
      return false;
    }
  }
}
