import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../modules/shared/providers/http.service';

@Component({
  selector: 'app-add-edit-exela-project-setup',
  templateUrl: './add-edit-exela-project-setup.component.html',
  styleUrls: ['./add-edit-exela-project-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditExelaProjectSetupComponent implements OnInit {

  type: string = 'project';

  mode: string = '';

  projectId: string = '';

  heading: string = 'Add Project';

  organizationId;
  tabs: Array<any> = [{ name: 'Information', key: 'information-tab' },
    { name: 'Queue Setup', key: 'project-queue-setup-tab' },
    { name: 'DocType Setup', key: 'project-doctype-setup-tab' }
  ];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Project Setup',
      base: true,
      link: '/exela-project-setup',
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
        this.heading = 'Edit Project';
        this._route.params.subscribe((params: any) => {
          this.projectId = params.id;
        });
      } else if (this.mode === 'add') {
        this._route.params.subscribe((params: any) => {
          this.organizationId = params.organizationId;
        });
        this.tabs[1].visible = false;
        this.tabs[2].visible = false;
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
