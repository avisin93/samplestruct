import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, ControlContainer, FormControl, AbstractControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggle } from '@angular/material';
import { ContractsMetaService } from 'src/app/modules/contracts-meta/contracts-meta.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-parent-child-input',
  templateUrl: './parent-child-input.component.html',
  styleUrls: ['./parent-child-input.component.scss']
})
export class ContractsMetaTabSubtabFormParentChildInput implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;
  @Input() objectData: any;

  parentDocuments: any[];

  hasParent = false;
  @ViewChild('hasParentCheckbox') hasParentCheckbox: MatSlideToggle;

  constructor (
    private controlContainer: ControlContainer,
    private toastr: ToastrService,
    private contractsMetaService: ContractsMetaService
    ) {
  }

  ngOnInit () {
    this.formGroup = this.controlContainer.control as FormGroup;
    if (this.checkForBusinessPartner()) {
      let now = new Date();
      now.setUTCHours(0,0,0,0);
      let startDate = this.objectData && this.objectData._id && this.objectData.start_date ? this.objectData.start_date : now.toISOString();
      this.getAllDocumentsByBusinessPartnerAndStartDate(this.contractsMetaService.contractData['general_informations']['general_informations']['business_partner'], startDate);
    }
    if (this.objectData._id && this.objectData.parent_document) {
      this.hasParentCheckbox.toggle();
      this.documentHasParent();
    } else {
      this.formGroup.controls[this.field.database_column_name].disable();
    }
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  documentHasParent () {
    this.hasParent = !this.hasParent;
    if (this.hasParent) {
      this.formGroup.get(this.field.database_column_name).enable();
    } else {
      this.formGroup.controls[this.field.database_column_name].disable();
    }
  }

  getAllDocumentsByBusinessPartnerAndStartDate (businessPartner, startDate) {
    const params = new HttpParams()
                    .set('businessPartnerCode', `${businessPartner.code}`)
                    .set('lteDocStartDate', `${startDate}`);
    this.contractsMetaService.getAllDocumentsByBusinessPartnerAndStartDate(params).subscribe((res: any) => {
      this.parentDocuments = res.docs;
      this.parentDocuments = this.parentDocuments.filter(doc => doc.documents._id !== this.objectData._id);
      this.hasParentCheckbox.disabled = this.parentDocuments.length === 0;
    });
  }

  checkForBusinessPartner (): boolean {
    return this.contractsMetaService.contractData && this.contractsMetaService.contractData['general_informations'] && this.contractsMetaService.contractData['general_informations']['general_informations'] && this.contractsMetaService.contractData['general_informations']['general_informations']['business_partner'];
  }
}
