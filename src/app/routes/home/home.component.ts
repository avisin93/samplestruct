import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SessionService, NavigationService } from '@app/common';
import { LOCAL_STORAGE_CONSTANTS, MENU_CONFIG } from '@app/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  menuList = MENU_CONFIG;
  
  constructor(
    private sessionService: SessionService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.redirectToLandingModule();
  }

  redirectToLandingModule() {
    const landingPage = this.sessionService.getLocalStorageItem(LOCAL_STORAGE_CONSTANTS.landingPage);
    if (landingPage) {
      this.navigationService.navigate(landingPage);
    } else {
      this.navigationService.navigate(['dashboard']);
    }
  }
}
