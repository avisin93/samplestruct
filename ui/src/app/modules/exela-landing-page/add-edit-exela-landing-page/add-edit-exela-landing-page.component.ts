import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/providers/http.service';
import { UrlDetails } from '../../../models/url/url-details.model';
import { StorageService } from '../../shared/providers/storage.service';
import { SessionService } from '../../shared/providers/session.service';
import { EmitterService } from '../../shared/providers/emitter.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-edit-exela-landing-page',
  templateUrl: './add-edit-exela-landing-page.component.html',
  styleUrls: ['./add-edit-exela-landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditExelaLandingPageComponent implements OnInit {

  @Input('heading') heading = 'Add User';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  @Input('mode') mode = '';

  @Input('product') product = [];

  @Input('clients') clients = [];

  @Input('isAdmin') isAdmin: Boolean = false;

  projects = [];

  // tslint:disable
  db_docType: any;
  // tslint:enable

  addEditUserSetupForm: FormGroup;

  showClientError: Boolean = false;

  showProjectError: Boolean = false;

  constructor (private _fb: FormBuilder,
      private _router: Router,
      public _dialogRef: MatDialogRef<AddEditExelaLandingPageComponent>,
      public _toastCtrl: ToastrService,
      private loaderService: LoaderService,
      private httpService: HttpService) {
    this.addEditUserSetupForm = this._fb.group({
      projectId: new FormControl('', [Validators.required]),
      organizationId: new FormControl('', [Validators.required])
    });
  }

  ngOnInit (): void { }

  saveUserSetup ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.addEditUserSetupForm.markAsDirty();
      if (value.organizationId === '') {
        this.showClientError = true;
      } else {
        if (value.projectId === '') {
          this.showProjectError = true;
        }
      }
    } else {
      this.addEditUserSetupForm.markAsPristine();
      this._dialogRef.close();
      SessionService.set('base-role', this.product['productName'].toLowerCase());
      EmitterService.get('base-role').emit(true);
      StorageService.set(StorageService.organizationId, value.organizationId);
      StorageService.set(StorageService.projectId, value.projectId);
      this.projects.forEach((prj) => {
        if (prj._id === value.projectId) {
          StorageService.set(StorageService.projectCode, prj.code);
          this.httpService.get(UrlDetails.$getRolesByProjectCode, { projectCode: prj.code })
                        .subscribe(response => {
                          let projectRoles = [];
                          if (response.length > 0) {
                            response.forEach(element => {
                              projectRoles.push(element._id);
                            });
                          }
                          StorageService.set(StorageService.projectRoles, projectRoles);
                        });
          return;
        }
      });
      if (this.product['menus'] && this.product['menus'].length) {
        this._router.navigate([this.product['productName'].toLowerCase() + '/' + this.product['menus'][0].link]).then(nav => {},
          () => {
            this._toastCtrl.error('Invalid Menu Link');
          });
      } else {
        this._toastCtrl.error('No menu assigned.');
      }
      StorageService.set(StorageService.userRole, this.product['roles'][0]);
    }
  }

  setEditFormValues (details?: any) {
    this.db_docType = details;
    this.addEditUserSetupForm.patchValue(details);
  }

  onClientSelect (event) {
    console.log(event);
    this.getAllProjects(event.value);
    this.showClientError = false;
  }

  getAllProjects (organizationId) {

    if (this.isAdmin || true) { // TODO: Vido
      let reqData = {
        organizationId: organizationId
      };
      this.loaderService.show();
      this.httpService.get(UrlDetails.$exela_getAllProjectsUrl, reqData).subscribe(
        response => {
          this.projects = response;
          this.loaderService.hide();
        }, () => {
        this.loaderService.hide();
      });
    } else {
      let userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
      this.projects = this.getRoleBasedProject(userRoles);
      // remove duplicate project from the list
      let projectIds = [];
      this.projects.forEach((project, index) => {
        if (projectIds.indexOf(project._id) === -1) {
          projectIds.push(project._id);
        } else {
          this.projects.splice(index, 1);
        }
      });
    }
  }

  getRoleBasedProject (userRoles) {
    let projects = [];
    userRoles.forEach((role) => {
      projects.push(...role.projects);
    });
    return projects;
  }

  closePopup () {
    this._dialogRef.close();
  }

}
