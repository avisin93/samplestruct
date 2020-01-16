import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Pattern } from '../../../../models/util/pattern.model';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { SessionService } from '../../../shared/providers/session.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-project-information',
  templateUrl: './exela-project-information.component.html',
  styleUrls: ['./exela-project-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaProjectInformationComponent implements OnInit {

  @Input('mode') mode = '';

  @Input('projectId') projectId = '';

  @Input('organizationId') organizationId = '';

  projectInformationForm: FormGroup;

  logoSelected: boolean = false;

  clients = [];

  logoString: string = '';

  // tslint:disable
  db_project: any;
  // tslint:enable
  oldProjectCode: any = null;
  projectCategories: Array<any> = [
        { key: 'Education', value: 'Education' },
        { key: 'financial', value: 'Financial' },
        { key: 'Healthcare', value: 'Healthcare' },
        { key: 'Human Resources', value: 'Human Resourecs' },
        { key: 'Marketing', value: 'Marketing' },
        { key: 'Operations', value: 'Operations' },
        { key: 'Sales', value: 'sales' },
        { key: 'Services', value: 'Services' }
  ];

  languages: Array<any> = [
        { key: 'English', value: 'English' },
        { key: 'Spanish', value: 'Spanish' },
        { key: 'French', value: 'French' },
        { key: 'Chinese', value: 'Chinese' }
  ];

  priorities: Array<any> = [
        { key: 'Critical', value: 'Critical' },
        { key: 'High', value: 'High' },
        { key: 'Medium', value: 'Medium' },
        { key: 'Low', value: 'Low' }
  ];

  constructor (private _fb: FormBuilder,
        private _router: Router,
        public _toastCtrl: ToastrService,
        public fileUploadCtrl: FileUploadController,
        public httpService: HttpService) {
    const EMAIL_REGEX = Pattern.EMAIL_PATTERN;
    const NUMBER_REGEX = Pattern.ONLY_NUMBER_PATTERN;
    const ALPHA_NUMERIC_WITH_SPACE = Pattern.ALPHA_NUMERIC_WITH_SPACE;
    const ALPHA_NUMERIC = Pattern.ALPHA_NUMERIC;
    const WITHOUT_SPACE = Pattern.WITHOUT_SPACE;
    this.projectInformationForm = this._fb.group({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      category: new FormControl(''),
      opendate: new FormControl(''),
      targetclosedate: new FormControl(''),
      closedate: new FormControl(''),
      priority: new FormControl(''),
      language: new FormControl(''),
      organizationid: new FormControl(''),
      _id: new FormControl(),
      active: 'Y'
    });
  }

  ngOnInit (): void {
    if (this.mode === 'edit') {
      this.getProjectByProjectId();
    }
  }

  getProjectByProjectId () {
    this.httpService.get(UrlDetails.$exela_getProjectByProjectIdUrl, { projectId: this.projectId }).subscribe((response) => {
      this.setEditFormValues(response);
      this.oldProjectCode = response.code;
    }, () => {
      console.log('exception while loading client by id');
    });
  }

  saveClient ({ value, valid }: { value: any, valid: boolean }) {
    value.opendate = new Date(value.opendate).getTime();
    value.closedate = new Date(value.closedate).getTime();
    value.targetclosedate = new Date(value.targetclosedate).getTime();
    value.opendate = (value.opendate === 0 || isNaN(value.opendate)) ? null : value.opendate;
    value.closedate = (value.closedate === 0 || isNaN(value.closedate)) ? null : value.closedate;
    value.targetclosedate = (value.targetclosedate === 0 || isNaN(value.targetclosedate)) ? null : value.targetclosedate;

    if (value.targetclosedate < value.opendate && value.targetclosedate != null) {
      this._toastCtrl.error('Target close Date must be grater than open date');
      return;
    } else if (value.closedate < value.opendate && value.closedate != null) {
      this._toastCtrl.error('close Date must be grater than open date');
      return;
    }

    if (!valid) {
      this.projectInformationForm.markAsDirty();
    } else {
      if (this.mode === 'add') {
        value.organizationid = this.organizationId;
      }
      this.projectInformationForm.markAsPristine();
      this.httpService.save(UrlDetails.$exela_addOrUpdateProjectUrl, value).subscribe(response => {
        if (this.mode === 'edit') {
          this._toastCtrl.success('Project has been updated Successfully');
                    /*Update OrganizationCode in auto routing rule */
          if (value.code !== this.oldProjectCode) {
            let data = {
              oldProjectCode: this.oldProjectCode,
              newProjectCode: value.code
            };
            this.httpService.save('UrlDetails.$updateProjectCodeForRoutingRuleUrl',data).subscribe(response => { // TODO: Vido
            });
          }
        } else {
          this._toastCtrl.success('Project has been added Successfully');
        }
        this.gotoProjectSetup();
      }, (error) => {
        try {
          this._toastCtrl.error(JSON.parse(error._body).errmsg);
        } catch (err) {
          this._toastCtrl.error('Something went wrong');
        }
      });
    }
  }

  setEditFormValues (details?: any) {
    if (details.opendate !== null) {
      let opendate = new Date(details.opendate);
      details['opendate'] = (opendate.getMonth() + 1) + '/' + opendate.getDate() + '/' + opendate.getFullYear();
    }
    if (details.closedate !== null) {
      let closeDate = new Date(details.closedate);
      details['closedate'] = (closeDate.getMonth() + 1) + '/' + closeDate.getDate() + '/' + closeDate.getFullYear();
    }
    if (details.targetclosedate !== null) {
      let targetCloseDate = new Date(details.targetclosedate);
      details['targetclosedate'] = (targetCloseDate.getMonth() + 1) + '/' + targetCloseDate.getDate() + '/' + targetCloseDate.getFullYear();
    }
    this.projectInformationForm.patchValue(details);
    this.db_project = details;
  }

  selectLogo (input) {
    this.fileUploadCtrl.readImageFile(input, { width: 230, height: 80 }, (dataUrl) => {
      this.projectInformationForm.controls['logo'].setValue(dataUrl);
      this.logoSelected = true;
    });
  }

  removeLogo () {
    this.projectInformationForm.controls['logo'].setValue('');
    this.logoSelected = false;
  }

  gotoProjectSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-project-setup']);
  }

}
