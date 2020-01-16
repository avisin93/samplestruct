import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/providers/http.service';

@Component({
  selector: 'add-edit-exela-client-user',
  templateUrl: './add-edit-exela-client-user.component.html',
  styleUrls: ['./add-edit-exela-client-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditExelaClientUserComponent implements OnInit {

  type: string = 'user';

  mode: string = '';

  userId: string = '';

  heading: string = 'Add User';

  organizationId;

  tabs: Array<any> = [
        { 'name': 'Information','key': 'information-tab' },
        { 'name': 'Reset Password','key': 'reset-password-tab' }
  ];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'User Setup',
      base: true,
      link: '/exela-client-user-setup',
      active: false
    }
  ];

  currentTab: string = 'information-tab';

  constructor (private _route: ActivatedRoute, public httpService: HttpService) {

  }

  ngOnInit () {
    this._route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        this.heading = 'Edit User';
        this._route.params.subscribe((params: any) => {
          this.userId = params.id;
          this.organizationId = params.organizationId;
        });
      } else {
        this._route.params.subscribe((params: any) => {
          this.organizationId = params.organizationId;
        });
        this.tabs = [{ 'name': 'Information','key': 'information-tab' }];
      }

      this.breadcrumbs.push({
        text: this.heading,
        base: false,
        link: '',
        active: true
      });
    });
  }

  onSelectTab (tab: string) {
    this.currentTab = tab;
  }

}
