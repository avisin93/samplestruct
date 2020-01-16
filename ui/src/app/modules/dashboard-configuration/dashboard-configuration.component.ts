import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup, MatDialog, MatTab, MatTabHeader } from '@angular/material';
import { DashboardConfigurationService } from './dashboard-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardConfigurationDialogComponent } from './dialog/dialog.component';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { HttpParams } from '@angular/common/http';
import { StorageService } from '../shared/providers/storage.service';

@Component({
  selector: 'cm-dashboard-configuration',
  templateUrl: './dashboard-configuration.component.html',
  styleUrls: ['./dashboard-configuration.component.scss']
})
export class DashboardConfigurationComponent implements OnInit {
  @ViewChild('matGroupTab') matGroupTab: MatTabGroup;
  selectedIndexTab: number = 0;
  dashboardConfigurationId: String;
  arrayTabs: any[] = [];
  isDirtyForm: boolean = false;

  breadcrumbs: Array<any> = [
    {
      text: 'Dashboard',
      base: true,
      link: '/dashboard',
      active: this.checkUserIfClientEditor()
    },
    {
      text: 'Configure Dashboard',
      link: '/configure-dashboard',
      base: true,
      active: true
    }
  ];

  constructor (
    private dialogMatDialog: MatDialog,
    private dashboardConfigurationService: DashboardConfigurationService,
    private toastr: ToastrService
  ) {
    this.dashboardConfigurationService.dashboardConfigurationModelChange$.subscribe((response: any) => {
      this.arrayTabs = response.tabs;
      this.arrayTabs.push({});
    });
  }

  ngOnInit (): void {
    this.getDashboardConfiguration();
    this.isDirtyForm = false;
    this.matGroupTab._handleClick = this.interceptTabChange.bind(this);
  }

  async interceptTabChange (tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    if (tab.disabled) {
      return;
    } else if (this.isDirtyForm) {
      let result = await this.openDialog().then(value => {
        return value;
      }).catch();

      if (result) {
        this.selectedIndexTab = idx;
        this.isDirtyForm = false;
      }
    } else {
      this.selectedIndexTab = idx;
      this.isDirtyForm = false;
    }
  }

  openDialog () {
    return new Promise(resolve => {
      const dialogRef = this.dialogMatDialog.open(PopUpComponent, {
        width: '450px',
        data: {
          message: `All changes will be lost?`,
          'yes': 'Ok',
          'no': 'Cancel',
          'fontSize': '20px'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        setTimeout(() => {
          if (result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    });
  }

  getDashboardConfiguration (): void {
    this.dashboardConfigurationService.getDashboardConfiguration().subscribe((response: any) => {
      if (response.status === '500') {
        this.toastr.error('Error', `Error while getting contract meta model`);
      } else {
        if (response && response[0] && response[0].tabs) {
          this.arrayTabs = response[0].tabs;
          this.dashboardConfigurationId = response[0]._id;
        }
        this.arrayTabs.push({});
      }
    }, error => {
      this.toastr.error('Error', `${error}`);
    });
  }

  openDialogTab (typeAction): void {
    const selectedIndex = this.selectedIndexTab;
    const tab = typeAction !== 'CREATE' && selectedIndex !== -1 ? this.arrayTabs[selectedIndex] : {};
    const existTab = tab && Object.keys(tab).length > 0;
    const newIndex = typeAction === 'CREATE' ? this.matGroupTab._tabs.length : selectedIndex;
    const dialogRef = this.dialogMatDialog.open(DashboardConfigurationDialogComponent, {
      width: '300px',
      height: '250px',
      data: {
        tabType: 'TAB',
        action: typeAction,
        tabName: existTab && tab.hasOwnProperty('widget_name') ? tab['widget_name'] : '',
        dashboardConfigurationId: this.dashboardConfigurationId,
        dashboardConfigurationTabId: existTab ? tab['_id'] : '',
        selectedIndex: newIndex
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dashboardConfiguration) {
        this.dashboardConfigurationId = result.dashboardConfiguration._id;
        this.arrayTabs = result.dashboardConfiguration.tabs;
        this.arrayTabs.push({});
        this.selectedIndexTab = newIndex;
      }
    });
  }

  isChildDirty (changed: boolean) {
    this.isDirtyForm = changed;
  }

  checkUserIfClientEditor () {
    let role = StorageService.get(StorageService.userRole);
    if (role === 'Client Editor' || role === 'Editor') {
      return true;
    } else {
      return false;
    }
  }
}
