import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { AddEditEmailTemplateComponent } from './add-edit-email-template/add-edit-email-template.component';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { StorageService } from '../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EmailSettingsComponent implements OnInit {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  @Input('mode') mode = '';

  columns: Array<any> = [
    {
      title: 'TEMPLATE NAME',
      key: 'templateName',
      sortable: true,
      filter: true
    },
    {
      title: 'CREATED BY',
      key: 'createdBy',
      sortable: true,
      filter: true
    },
    {
      title: 'CREATED ON',
      key: 'createdOn',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 1;

  hasActionButtons: boolean = true;

  dialogOptions: any = {
    width: '700px',
    height: '420px',
    panelClass: 'appModalPopup'
  };

  siteSettingId: string = '';

  constructor (public dialog: MatDialog,
    public httpService: HttpService,
    public _toastCtrl: ToastrService) {

  }

  ngOnInit () {
    console.log(this.mode);
    this.getSiteSettings();
  }

  getSiteSettings () {
    let client = { organizationId : '59cb78d2340aff0db4794d99' };
    this.httpService.save('UrlDetails.$getSiteSettingsUrl',client) // TODO: Vido
      .subscribe(response => {
        console.log(response);
        if (response.responseCode === 200) {
          this.siteSettingId = response.responseData.siteSettingId;
          StorageService.set(StorageService.siteSettingId, this.siteSettingId);
          this.records = response.responseData.emailTemplates;
          this.records.forEach((item) => {
            item['createdBy'] = item.createdBy.userRole.userRoleName;
          });
          this.totalRows = this.records.length;
        } else if (response.responseCode === 204 || response.responseCode === 400) {

        }

        this.dataTableComp.setPage(1);
      }, () => {
        this.dataTableComp.setPage(1);
      });
  }

  addEmailTemplatePopup () {
    let addEmailTmplDialogRef = this.dialog.open(AddEditEmailTemplateComponent, this.dialogOptions);
    addEmailTmplDialogRef.componentInstance.heading = 'Add Template';
    addEmailTmplDialogRef.componentInstance.saveBtnTitle = 'Add';
    addEmailTmplDialogRef.componentInstance.popupMode = 'add';
    addEmailTmplDialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        this.getSiteSettings();
      }
    });
  }

  editEmailTemplatePopup (record: any) {
    let editEmailTmplDialogRef = this.dialog.open(AddEditEmailTemplateComponent, this.dialogOptions);
    editEmailTmplDialogRef.componentInstance.heading = 'Edit Template';
    editEmailTmplDialogRef.componentInstance.saveBtnTitle = 'Save';
    editEmailTmplDialogRef.componentInstance.popupMode = 'edit';
    editEmailTmplDialogRef.componentInstance.setEditFormValues({
      templateName: record.templateName,
      emailSubject: record.emailSubject,
      emailBody: record.emailBody,
      templateId: record.templateId
    });
    editEmailTmplDialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        this.getSiteSettings();
      }
    });
  }

  deleteTemplate (record: any) {
    console.log(record);
    let deleteTemplateAlert = new SweetAlertController();
    deleteTemplateAlert.deleteConfirm({}, () => {
      let organizationId = '59cb78d2340aff0db4794d99';
      let siteSetting = {
        siteSettingId : this.siteSettingId,
        client : { organizationId : organizationId },
        emailTemplates : [record]
      };

      this.httpService.save('UrlDetails.$deleteSiteEmailTemplateeUrl', siteSetting)
        .subscribe(response => {
          if (response.responseCode === 200) {
            this._toastCtrl.success('Deleted Successfully !!!');
            this.getSiteSettings();
          } else if (response.responseCode === 204 || response.responseCode === 400) {
            this._toastCtrl.error('Record not deleted');
          }
        }, () => {

        });
    });
  }

  ngOnDestroy () {

  }

}
