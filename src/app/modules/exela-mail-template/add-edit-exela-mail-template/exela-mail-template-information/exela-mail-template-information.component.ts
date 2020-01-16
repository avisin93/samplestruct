import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { TextEditorComponent } from '../../../shared/components/text-editor/text-editor.component';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { RequestService } from 'src/app/modules/request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-mail-template-information',
  templateUrl: './exela-mail-template-information.component.html',
  styleUrls: ['./exela-mail-template-information.component.scss']
})
export class ExelaMailTemplateInformationComponent implements OnInit {
  @Input('mode') mode = '';
  @Input('actionId') _id = '';
  @Input('organizationId') organizationId = '';
  @ViewChild(TextEditorComponent)
  private textEditor: TextEditorComponent;
  actions = [];
  showActionError: boolean = false;
  showClientError: boolean = false;
  actionDisable: boolean = false;
  clients;
  addEditActionTemplateForm: FormGroup;
  constructor (
    private _fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    public _toastCtrl: ToastrService,
    public fileUploadCtrl: FileUploadController,
    public httpService: HttpService,
    public requestService: RequestService
  ) {
    this.addEditActionTemplateForm = this._fb.group({
      action: new FormControl(''),
      type: new FormControl('Mail'),
      organizationId: new FormControl(''),
      template: new FormControl(),
      _id: new FormControl(),
      active: new FormControl()
    });
  }

  ngOnInit () {
    this.getAllClients();
    if (this.mode === 'edit') {
      this.setEditFormValues();
      this.actionDisable = false;
    }
  }

  getAllClients () {
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      if (response.length !== 0) {
        this.clients = response;
      }
    }, () => {
    });
    const params = new HttpParams().set('organizationId', `${this.organizationId}`);
    this.requestService.doGET('/api/reachout/notificationTemplatesByOrganizationId', 'API_CONTRACT', params).subscribe(response => {
      (response as Observable<any>).forEach((item: any) => {
        if (item.active) {
          this.actions.push({ id: item._id, action: item.action });
        }
      });
    });
  }

  setEditFormValues () {
    this.requestService.doGET(`/api/reachout/notificationTemplates/${this._id}`, 'API_CONTRACT').subscribe(response => {
      response['action'] = response['_id'];
      const data = {
        action: response['action'],
        type: response['type'],
        organizationId: response['organization_id'],
        template: response['template'],
        _id: response['_id'],
        active: response['active']
      };
      this.addEditActionTemplateForm.patchValue(data);
      this.textEditor.setTemplate(response['template']);
      this.textEditor.dynamicContent = response['dynamic_content'];
    }, () => {
    });
  }

  saveTemplate ({ value, valid }: { value: any, valid: boolean }) {
    value.template = this.textEditor.getData();
    if (!valid) {
      this.addEditActionTemplateForm.markAsDirty();
      if (value.action === '') {
        this.showActionError = true;
        this.addEditActionTemplateForm.get('action').markAsTouched();
      } else if (value.organizationId === '') {
        this.showClientError = true;
        this.addEditActionTemplateForm.get('organizationId').markAsTouched();
      }
    } else if (value.template === '') {
      this._toastCtrl.error('Action Template Should Not Be Empty');
    } else {
      value.organizationId = this.organizationId;
      value.active = true;
      this.addEditActionTemplateForm.markAsPristine();
      if (this.mode === 'edit') {
        this.requestService.doPUT(`/api/reachout/notificationTemplates/${value._id}`, value, 'API_CONTRACT').subscribe(response => {
          this._toastCtrl.success('Action Template Updated Successfully');
          this.gotoMailTemplate();
        }, error => {
          if (error.status === 400) {
            this._toastCtrl.error(error.error);
          } else {
            this._toastCtrl.error('Something went wrong');
          }
        });
      } else {
        const data: any = {
          action: value.action,
          organization_id: value.organizationId,
          template: value.template,
          type: value.type,
          active: true
        };
        this.requestService.doPOST('/api/reachout/notificationTemplates', data, 'API_CONTRACT').subscribe(response => {
          this._toastCtrl.success('Action Template Added Successfully');
          this.gotoMailTemplate();
        }, error => {
          if (error.status === 400) {
            this._toastCtrl.error(error.error);
          } else {
            this._toastCtrl.error('Something went wrong');
          }
        });
      }
    }
  }

  setMailTemplate (templateId) {
    let action = this.actions.find(action => action.id === templateId);
    const params = new HttpParams().set('action', `${action.id}`);
    this.requestService.doGET('/api/reachout/notificationTemplatesByAction', 'API_CONTRACT', params).subscribe(response => {
      this.textEditor.setTemplate(response['template']);
      this.textEditor.dynamicContent = response['dynamicContent'];
    }, (error) => {
      this._toastCtrl.error(error.error);
    });
  }

  gotoMailTemplate () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-mail-template']);
  }

  uploadImage (event) {
    event.organizationId = this.organizationId;
    this.requestService.doPOST('/api/reachout/notificationTemplates/images', event, 'API_CONTRACT').subscribe(response => {
      this._toastCtrl.success('Uploaded Successfully !');
    }, error => {
      if (error.status === 400) {
        this._toastCtrl.error(error.error);
      } else {
        this._toastCtrl.error('Something went wrong');
      }
    });
  }

  changeMaleTemplate (id) {
    this._id = id;
    this.setEditFormValues();
  }
}
