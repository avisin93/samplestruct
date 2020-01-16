import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSlideToggle } from '@angular/material';
import { FormGroup, ControlContainer } from '@angular/forms';
import { ContractsMetaService } from 'src/app/modules/contracts-meta/contracts-meta.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-child-input',
  templateUrl: './child-input.component.html',
  styleUrls: ['./child-input.component.scss']
})
export class ChildInputComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;
  @Input() objectData: any;

  childDocuments: any[];

  hasChild = false;
  @ViewChild('hasChildCheckbox') hasChildCheckbox: MatSlideToggle;

  constructor (
    private controlContainer: ControlContainer,
    private toastr: ToastrService,
    private contractsMetaService: ContractsMetaService
  ) { }

  ngOnInit () {
    this.formGroup = this.controlContainer.control as FormGroup;
    if (this.checkForBusinessPartner()) {
      let now = new Date();
      now.setUTCHours(0,0,0,0);
      let startDate = this.objectData && this.objectData._id && this.objectData.startDate ? this.objectData.startDate : now.toISOString();
      this.getAllDocumentsByBusinessPartnerAndStartDate(this.contractsMetaService.contractData['general_informations']['general_informations']['business_partner'], startDate);
    }
    if (this.objectData._id && this.objectData.child_document) {
      this.hasChildCheckbox.toggle();
      this.documentHasChild();
    } else {
      this.formGroup.controls[this.field.database_column_name].disable();
    }
  }
  documentHasChild () {
    this.hasChild = !this.hasChild;
    if (this.hasChild) {
      this.formGroup.get(this.field.database_column_name).enable();
    } else {
      this.formGroup.controls[this.field.database_column_name].disable();
    }
  }

  getAllDocumentsByBusinessPartnerAndStartDate (businessPartner, startDate) {
    const params = new HttpParams()
                    .set('businessPartnerCode', `${businessPartner.code}`)
                    .set('gteDocStartDate', `${startDate}`);
    this.contractsMetaService.getAllDocumentsByBusinessPartnerAndStartDate(params).subscribe((res: any) => {
      this.childDocuments = res.docs;
      this.childDocuments = this.childDocuments.filter(doc => doc.documents._id !== this.objectData.id_document);
      this.hasChildCheckbox.disabled = this.childDocuments.length === 0;
    });
  }

  checkForBusinessPartner (): boolean {
    return this.contractsMetaService.contractData && this.contractsMetaService.contractData['general_informations'] && this.contractsMetaService.contractData['general_informations']['general_informations'] && this.contractsMetaService.contractData['general_informations']['general_informations']['business_partner'];
  }
}
