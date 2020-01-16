import { Component, OnInit, Inject, Input, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContractService } from '../contracts.service';
import { getErrorMessage } from 'src/app/modules/utilsValidation';

const BUSINESS_PARTNER: string = 'BUSINESS_PARTNER';
const CATEGORY: string = 'CATEGORY';
const SUBCATEGORY: string = 'SUBCATEGORY';
const LEGAL_ENTITY: string = 'LEGAL_ENTITY';
const UOM: string = 'UOM';
const FUNCTION: string = 'FUNCTION';
const LINKED_OPPORTUNITY: string = 'LINKED_OPPORTUNITY';
const SERVICE: string = 'SERVICE';
const SUB_SERVICE: string = 'SUB_SERVICE';
const PROJECT: string = 'PROJECT';
const DOCUMENT_TYPE = 'DOCUMENT_TYPE';

@Component({
  selector: 'cm-create-new-object',
  templateUrl: './create-new-object.html',
  styleUrls: ['./create-new-object.scss']
})
export class CreateNewObjectComponent implements OnInit {

  formGroup: FormGroup;
  codeObject: string;
  parentCodeObject: string;
  @Input() titleText: string;
  onCreateNewObject = new EventEmitter<any>();

  constructor (
    public dialogRef: MatDialogRef<CreateNewObjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private contractService: ContractService
  ) {

  }

  ngOnInit (): void {
    this.formGroup = new FormGroup({
      inputNameObject: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$'), Validators.maxLength(40)])
    });

    this.titleText = 'Add ' + this.data.titleText;
    this.codeObject = this.data.codeObject;
    this.parentCodeObject = this.data.parentCodeObject;
  }

  public cancelCreateNewObject (): void {
    this.titleText = '';
    this.codeObject = '';
    this.parentCodeObject = '';
  }

  public saveCreateNewObject (): void {
    if (!this.validate()) {
      return;
    }
    const objectData = {
      data: {}
    };
    const inputNameObject = this.formGroup.get('inputNameObject').value;
    const codeObject = (inputNameObject.replace(/\s/g, '')).toUpperCase();
    if (this.codeObject === BUSINESS_PARTNER) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createBusinessPartner(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Business partner successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === CATEGORY) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createCategory(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Category successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === SUBCATEGORY) {
      objectData.data['subcategory_name'] = inputNameObject;
      objectData.data['subcategory_code'] = codeObject;
      objectData.data['category_code'] = this.parentCodeObject;
      this.contractService.createSubcategory(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Sub Category successfully added for Category');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === LEGAL_ENTITY) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createLegalEntity(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Legal entity successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === UOM) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createUom(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'UOM successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === FUNCTION) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createFunction(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Function successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === LINKED_OPPORTUNITY) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createLinkedOpportunity(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Linked Opportunity successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === SERVICE) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createService(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Service successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === SUB_SERVICE) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createSubService(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Sub service successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === PROJECT) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createProject(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Project successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else if (this.codeObject === DOCUMENT_TYPE) {
      objectData.data['name'] = inputNameObject;
      objectData.data['code'] = codeObject;
      this.contractService.createDocumentType(objectData).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Document type successfully added');
        this.onCreateNewObject.emit(codeObject);
      }, (error) => {
        this.toastr.error('Error', `${error.error.msg}`);
      });
    } else {
      this.toastr.error('There is no this object in database ' + this.codeObject);
    }
  }

  validate (): boolean {
    let validate = true;
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).markAsTouched();
      if (this.formGroup.get(key).invalid) {
        validate = false;
      }
    });
    return validate;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}
