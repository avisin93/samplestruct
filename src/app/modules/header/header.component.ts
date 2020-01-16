import { Component, OnInit } from '@angular/core';
import { UserService } from '../users.service';
import { Router } from '@angular/router';
import { MenuSidebarService } from '../menu-sidebar/menu-sidebar.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UploadDialogComponent } from '../contracts/upload-dialog/upload-dialog.component';
import { LoginService } from '../login/login.service';
import { StorageService } from '../shared/providers/storage.service';
import { SessionService } from '../shared/providers/session.service';

@Component({
  selector: 'cm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  minimize: boolean;
  headerClass: string;
  urlLogo: string;
  userCredentials: any;
  userPicture: any;

  constructor (private loginService: LoginService,private userService: UserService, private router: Router, private menuSidebarService: MenuSidebarService, private dialogMatDialog: MatDialog) { }

  ngOnInit () {
    let userEmail = JSON.parse(StorageService.get('userEmail'));
    if (userEmail != null) {
      this.userService.getUsers().subscribe((response: any) => {
        let users = response;
        this.userCredentials = users.firstName + ' ' + users.lastName;
        this.userPicture = users.profilePhoto;
      });
    }
    this.minimize = false;
    this.headerClass = 'cm-logo';
    this.urlLogo = 'assets/images/logo_project.png';
  }

  toggleSidebar (): boolean {
    this.minimize = !this.minimize;
    // this.sidebarService.toggle(true, 'menu-sidebar');
    // this.layoutService.changeLayoutSize();
    this.menuSidebarService.toggle(this.minimize ? 'compacted' : '', this.minimize ? 'big' : '');
    this.headerClass = !this.minimize ? 'cm-logo' : 'cm-logo-small';
    this.urlLogo = !this.minimize ? 'assets/images/logo_project.png' : 'assets/logo-small.png';
    return false;
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

  openUploadDialog (): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';
    dialogConfig.height = '300px';

    let dialogRef = this.dialogMatDialog.open(UploadDialogComponent, dialogConfig);
  }

  logout () {
    this.loginService.logout();
    this.router.navigate(['login']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });

  }
}
