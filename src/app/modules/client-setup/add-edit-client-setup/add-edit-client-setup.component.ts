import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Menus } from '../../../root/role/menu';
import { HttpService } from '../../../modules/shared/providers/http.service';

@Component({
  selector: 'app-add-edit-client-setup',
  templateUrl: './add-edit-client-setup.component.html',
  styleUrls: ['./add-edit-client-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditClientSetupComponent implements OnInit {

  type: string = 'client';

  mode: string = '';

  organizationId: string = '';

  heading: string = 'Add Client';

  tabs: Array<any> = Menus.getMenuTabs('client-setup').tabs;

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
      link: '/client-setup',
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
        this.heading = 'Edit Client';
        this._route.params.subscribe((params: any) => {
          this.organizationId = params.id;
        });
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
