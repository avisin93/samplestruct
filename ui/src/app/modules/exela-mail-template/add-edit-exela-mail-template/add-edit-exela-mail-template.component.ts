import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-exela-mail-template',
  templateUrl: './add-edit-exela-mail-template.component.html',
  styleUrls: ['./add-edit-exela-mail-template.component.scss']
})
export class AddEditExelaMailTemplateComponent implements OnInit {
  mode: string = '';

  actionId: string = '';
  heading: string = 'Add Mail Template';
  organizationId: string = '';

  tabs: Array<any> = [
    { 'name': 'Information', 'key': 'information-tab' }
  ];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Mail Template',
      base: true,
      link: '/exela-mail-template',
      active: false
    }
  ];

  currentTab: string = 'information-tab';

  constructor (
    private _route: ActivatedRoute
  ) {}

  ngOnInit () {
    this._route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        this.heading = 'Edit Mail Template';
        this._route.params.subscribe((params: any) => {
          this.actionId = params.id;
          this.organizationId = params.organizationId;
        });
      } else {
        this._route.params.subscribe((params: any) => {
          this.organizationId = params.id;
        });

        this.tabs = [{ 'name': 'Information', 'key': 'information-tab' }];
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
