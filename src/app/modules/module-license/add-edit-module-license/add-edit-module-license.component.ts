import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { UrlDetails } from '../../../models/url/url-details.model';
import { HttpService } from '../../shared/providers/http.service';
import { Pattern } from '../../../models/util/pattern.model';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-add-edit-module-license',
  templateUrl: './add-edit-module-license.component.html',
  styleUrls: ['./add-edit-module-license.component.scss']
})

export class AddEditModuleLicenseComponent implements OnInit {

  @Input('heading') heading = 'Add Facility';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  @Input('mode') mode = 'add';

  @Input('organizationId') organizationId = 0;

  addEditFacilityForm: FormGroup;

  wait: boolean = false;

  // tslint:disable
  db_module: any;
    // tslint:enable
  modules = [];

  constructor (private _fb: FormBuilder, public _dialogRef: MatDialogRef<AddEditModuleLicenseComponent>, public httpService: HttpService, public toastCtrl: ToastrService) {
    let onlyCharacters = Pattern.ONLY_CHARACTERS;
    let phoneNumber = Pattern.PHONE_NUMBER;
    let alphaNumeric = Pattern.ALPHA_NUMERIC;
    let onlyNumberPattern = Pattern.ONLY_NUMBER_PATTERN;

    this.addEditFacilityForm = this._fb.group({
      managerName1: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      organizationId: '',
      managerId: new FormControl('')
    });
  }

  ngOnInit (): void {
    $('.add-edit-facilities-wrap').closest('.cdk-overlay-pane').addClass('facilitiesAddEditPopup');
    this.getAllModules();
  }

  ngAfterViewInit () {

  }

  getAllModules () {
    this.httpService.getAll('UrlDetails.$getAllModulesUrl') // TODO: Vido
            .subscribe(response => {
              response.forEach((item: any) => {
                this.modules.push({ value: item.managerId + '||' + item.managerName, viewValue: item.managerName });
              });

            }, () => {
            });
  }

  saveFacility ({ value, valid }: { value: any, valid: boolean }) {
    console.log(value);
    let module = value.managerName1;
    console.log(module);
    value.organizationId = this.organizationId;
    value.managerId = module.split('||')[0];
    value.managerName1 = module.split('||')[1];
    value.startDate = new Date(value.startDate).getTime();
    value.endDate = new Date(value.endDate).getTime();
    console.log(value);
    if (!valid) {
      this.addEditFacilityForm.markAsDirty();
    } else {
      this.wait = true;
      this.addEditFacilityForm.markAsPristine();
      if (this.mode === 'add') {
        delete value.facilityId;
        this.httpService.save('UrlDetails.$saveAdminModulesLicenceUrl', value) // TODO: Vido
                    .subscribe(response => {
                      this.toastCtrl.success('Module License added successfully.');
                      this._dialogRef.close('save');
                      this.wait = false;
                    }, () => {
                      this.wait = false;
                    });
      } else {
        this.db_module.organizationId = value.organizationId;
        this.db_module.managerId = value.managerId;
        this.db_module.managerName1 = value.managerName1;
        this.db_module.startDate = value.startDate;
        this.db_module.endDate = value.endDate;
        this.httpService.save('UrlDetails.$updateAdminModulesLicenceUrl', this.db_module) // TODO: Vido
                    .subscribe(response => {
                      this.toastCtrl.success('Module License updated successfully.');
                      this._dialogRef.close('save');
                      this.wait = false;
                    }, () => {
                      this.wait = false;
                    });
      }
    }
  }

  setEditFormValues (details?: any) {
    console.log(details);
    const tmpDetails = Object.assign({}, details);
    this.db_module = tmpDetails;
    tmpDetails.managerName1 = tmpDetails.managerId + '||' + tmpDetails.managerName1;
        // this.addEditFacilityForm.get('managerName1').disable();
    this.addEditFacilityForm.patchValue(tmpDetails);
  }

  closePopup () {
    this._dialogRef.close();
  }

}
