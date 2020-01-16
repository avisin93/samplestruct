import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/providers/http.service';
import { StorageService } from '../../shared/providers/storage.service';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-edit-exela-client',
  templateUrl: './add-edit-exela-client.component.html',
  styleUrls: ['./add-edit-exela-client.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditExelaClientSetupComponent implements OnInit {
  @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  type: string = 'client';
  mode: string = '';
  organizationId: string = '';
  heading: string = 'Add Client';
  currentTab: string = 'information-tab';

  tabs: Array<any> = [
      { 'name': 'Information', 'key': 'information-tab' },
      { 'name': 'Products', 'key': 'product-tab' },
      { 'name': 'Menu Setup', 'key': 'menu-tab' },
      { 'name': 'Email Recipients', 'key': 'non-registered-users-tab' },
      { 'name': 'Self Registration', 'key': 'self-registered-users-tab' },
      { 'name': 'Assign Theme', 'key': 'assign-theme' },
      { 'name': 'Assign Action', 'key': 'action-tab' },
      { 'name': 'Shared Mail Box', 'key': 'shared-mailbox' },
      { 'name': 'Password Rule','key': 'configurable-password' }
  ];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Client Setup',
      base: true,
      link: '/exela-client-setup',
      active: false
    }
  ];

  constructor (private _route: ActivatedRoute, public httpService: HttpService) { }

  ngOnInit () {
    this._route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        this.heading = 'Edit Client';
        this._route.params.subscribe((params: any) => {
          this.organizationId = params.id;
        });
      } else if (this.mode === 'add') {
        this.tabs[1].visible = false;
        this.tabs[2].visible = false;
        this.tabs[3].visible = false;
        this.tabs[4].visible = false;
        this.tabs[5].visible = false;
        this.tabs[6].visible = false;
        this.tabs[7].visible = false;
        this.tabs[8].visible = false;
      }

      const userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
      const hasClientAdminRole = userRoles.find((role) => {
        return role.roleName === 'CLIENTADMIN';
      });

      if (hasClientAdminRole) {
        this.tabs[1].visible = false;
        this.tabs[2].visible = false;
        this.tabs[6].visible = false;
      }

      this.breadcrumbs.push({
        text: this.heading,
        base: false,
        link: '',
        active: true
      });
    });
  }

  onSelectTab (tab: string,event: any) {
    this.currentTab = tab;
  }
}
