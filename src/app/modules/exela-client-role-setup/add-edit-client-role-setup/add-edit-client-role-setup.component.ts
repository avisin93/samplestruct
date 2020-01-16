import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/providers/http.service';

@Component({
  selector: 'app-add-edit-client-role-setup',
  templateUrl: './add-edit-client-role-setup.component.html',
  styleUrls: ['./add-edit-client-role-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditClientRoleSetupComponent implements OnInit {

  type: string = 'client';

  mode: string = '';

  roleId: string = '';

  heading: string = 'Add Role';

  organizationId = '';

  tabs: Array<any> = [{ name: 'Information',key: 'information-tab' },
    { name: 'Role-Menu Assignment',key: 'role-menu-assignment-tab' },
    { name: 'Role-Project Assignment',key: 'role-project-assignment-tab' },
    // {name:'Role-Shared-Mailbox Assignment',key:'role-shared-mailbox-assignment-tab'},
    { name: 'Role-Metadata Access',key: 'role-formtype-access-tab' },
    { name: 'Role-List Header', key: 'role-list-header' }

  ];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Role Setup',
      base: true,
      link: '/exela-client-role-setup',
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
        this.heading = 'Edit Role';
        this._route.params.subscribe((params: any) => {
          this.roleId = params.id;
          this.organizationId = params.organizationId;
        });
      } else if (this.mode === 'add') {
        this._route.params.subscribe((params: any) => {
          this.organizationId = params.organizationId;
        });
        this.tabs[1].visible = true;
        this.tabs[2].visible = true;

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
