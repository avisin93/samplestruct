import { Component, OnInit, Inject, EventEmitter, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggle, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { ContractService } from '../../contracts.service';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { DocumentService } from '../document.service';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { LoaderService } from 'src/app/modules/shared/components/loader/loader.service';
import { CreateNewObjectComponent } from '../../create-new-object-dialog/create-new-object.component';
import * as moment from 'moment';
import { Pattern } from 'src/app/models/util/pattern.model';

@Component({
  selector: 'app-add-new-document-dialog',
  templateUrl: './add-new-document-dialog.component.html',
  styleUrls: ['./add-new-document-dialog.component.scss']
})
export class AddNewDocumentDialogComponent implements OnInit {

  hasParent = false;
  hasChild = false;
  @ViewChild('hasParentCheckbox') hasParentCheckbox: MatSlideToggle;
  @ViewChild('hasChildCheckbox') hasChildCheckbox: MatSlideToggle;

  @Input() minStartDate;
  @Input() maxSignedDate;

  constructor (
    public dialogRef: MatDialogRef<AddNewDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contractService: ContractService,
    private documentService: DocumentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private dialogMatDialog: MatDialog
  ) { }

  formGroup = new FormGroup({
    inputDocumentTitle: new FormControl('', [Validators.required, Validators.maxLength(40), Validators.pattern(Pattern.ALPHA_NUMERIC_WITH_SPACES)]),
    selectedDocumentType: new FormControl('', [Validators.required]),
    selectedStatus: new FormControl('', [Validators.required]),
    selectedStartDate: new FormControl('', [Validators.required]),
    selectedSignedDate: new FormControl('', [Validators.required]),
    inputFile: new FormControl({ value: '', disabled: this.data.updateDocument }, [Validators.required]),
    selectedParentDocument: new FormControl({ value: '', disabled: !this.hasParent }, [this.validateParentDocument]),
    selectedChildDocument: new FormControl({ value: '', disabled: !this.hasChild }, [this.validateChildDocument])
  });

  arrayDocTypes = [];
  arrayContractStatus = [];
  parentDocuments = [];
  childDocuments = [];
  businessPartner;

  fileToUpload: File;
  fileType: string = null;

  onActionDocument = new EventEmitter();
  updateDocument: boolean = false;
  idDocument: string = '';
  textHeaderDialogDocument: string = 'Add Document';
  arrayAcceptTypes = ['application/pdf', 'text/plain', 'image/jpg', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  async ngOnInit () {
    this.formGroup.get('inputDocumentTitle').setValue(typeof this.contractService.contractData !== 'undefined' ? this.contractService.contractData.contract_title : 'unknown');

    this.contractService.getAllDocumentTypes().subscribe((res: any) => {
      this.arrayDocTypes = res;
    });

    this.contractService.getAllStatus().subscribe((res: any) => {
      this.arrayContractStatus = res;
    });

    let now = new Date();
    now.setUTCHours(0,0,0,0);

    this.businessPartner = this.contractService.contractData.business_partner ? this.contractService.contractData.business_partner.code : '';
    if (this.data.start_date) {
      this.loaderService.show();
      const paramsForParent = new HttpParams()
                      .set('businessPartnerCode', `${this.businessPartner}`)
                      .set('lteDocStartDate', `${this.data.start_date}`);
      await this.contractService.getAllDocumentsByBusinessPartnerAndStartDate(paramsForParent).then((res: any) => {
        this.parentDocuments = res.docs;
        this.parentDocuments = this.parentDocuments.filter(doc => doc.documents._id !== this.data.id_document);
        this.hasParentCheckbox.disabled = this.parentDocuments.length === 0;
      }).catch();

      const paramsForChild = new HttpParams()
                      .set('businessPartnerCode', `${this.businessPartner}`)
                      .set('gteDocStartDate', `${this.data.start_date}`);
      await this.contractService.getAllDocumentsByBusinessPartnerAndStartDate(paramsForChild).then((res: any) => {
        this.childDocuments = res.docs;
        this.childDocuments = this.childDocuments.filter(doc => doc.documents._id !== this.data.id_document);
        this.hasChildCheckbox.disabled = this.childDocuments.length === 0;
      }).catch();
      this.loaderService.hide();
    } else {
      this.hasChildCheckbox.disabled = true;
      this.hasParentCheckbox.disabled = true;
    }
    if (this.data.updateDocument) {
      this.formGroup.get('inputDocumentTitle').setValue(this.data.document_title);
      this.formGroup.get('selectedDocumentType').setValue(this.data.type_code);
      this.formGroup.get('selectedStatus').setValue(this.data.status_code);
      this.formGroup.get('selectedStartDate').setValue(this.data.start_date);
      this.formGroup.get('selectedSignedDate').setValue(this.data.signed_date);
      this.formGroup.get('inputFile').setValue(this.data.name_document_efa);

      if (this.data.parent_document) {
        this.hasParentCheckbox.toggle();
        this.documentHasParent();
        this.formGroup.get('selectedParentDocument').enable();
        this.formGroup.get('selectedParentDocument').setValue(this.data.parent_document);
      }

      if (this.data.child_document) {
        this.hasChildCheckbox.toggle();
        this.documentHasChild();
        this.formGroup.get('selectedChildDocument').enable();
        this.formGroup.get('selectedChildDocument').setValue(this.data.child_document);
      }

      this.parentDocuments = this.parentDocuments.filter(doc => doc._id !== this.data.id_document);
      this.childDocuments = this.childDocuments.filter(doc => doc._id !== this.data.id_document);
      this.idDocument = this.data.id_document;
      this.updateDocument = this.data.updateDocument;
      this.textHeaderDialogDocument = 'Edit document';
    }
    this.onChanges();
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.documentService.emitEvent(true);
    });
  }

  documentHasParent () {
    this.hasParent = !this.hasParent;
    if (this.hasParent) {
      this.formGroup.get('selectedParentDocument').enable();
    } else {
      this.formGroup.controls.selectedParentDocument.disable();
    }
  }

  documentHasChild () {
    this.hasChild = !this.hasChild;
    if (this.hasChild) {
      this.formGroup.get('selectedChildDocument').enable();
    } else {
      this.formGroup.controls.selectedChildDocument.disable();
    }
  }

  validateParentDocument (control: AbstractControl): {[key: string]: any} {
    return !control.disabled && control.value === '' ? { 'required': { value: control.value } } : null;
  }

  validateChildDocument (control: AbstractControl): {[key: string]: any} {
    return !control.disabled && control.value === '' ? { 'required': { value: control.value } } : null;
  }

  close () {
    this.documentService.emitEvent(false);
    this.dialogRef.close();
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

  saveDocumentDialog () {
    if (!this.validate() || (typeof this.contractService.contractId === 'undefined'
        || this.contractService.contractId === null
        || this.contractService.contractId === '0')) {
      return;
    }
    this.loaderService.show();
    const objectDocument = {
      data: {
        document: {
          document_title: this.formGroup.get('inputDocumentTitle').value.trim(),
          type_code: this.formGroup.get('selectedDocumentType').value,
          start_date: this.formGroup.get('selectedStartDate').value,
          signed_date: this.formGroup.get('selectedSignedDate').value,
          status_code: this.formGroup.get('selectedStatus').value,
          parent_document: this.hasParent ? this.formGroup.get('selectedParentDocument').value : undefined,
          child_document: this.hasChild ? this.formGroup.get('selectedChildDocument').value : undefined,
          file_type: this.fileType
        }
      }
    };

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    if (this.updateDocument) {
      urlParams['documentId'] = this.idDocument;
      this.documentService.updateDocument(objectDocument, urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error','Document not updated!!!');
        } else {
          this.toastr.success('Operation Complete','Document successfully updated');
          this.onActionDocument.emit();
        }
        this.loaderService.hide();
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Error',`Document not updated ${error}!`);
        this.loaderService.hide();
      });
    } else {
      const formData = new FormData();
      formData.append('uploadFile', this.fileToUpload);
      formData.append('documentData', JSON.stringify(objectDocument));

      this.documentService.createDocumentContractFile(formData, urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          this.toastr.error('Error','Document not created!!!');
        } else {
          this.toastr.success('Operation Complete','Document successfully added');
          this.onActionDocument.emit();
        }
        this.loaderService.hide();
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Error',`Document not created: ${error.error}`);
        this.loaderService.hide();
      });
    }
    this.documentService.emitEvent(false);
  }

  onFileChoose (fileInput: Event) {
    const file = (fileInput.target as HTMLInputElement).files[0];
    const fileName = file.name;
    if (!this.arrayAcceptTypes.includes(file.type)) {
      this.toastr.error('Error', `File type is not supported!`);
      return;
    }
    this.fileToUpload = file;
    this.fileType = file.type;
    this.formGroup.get('inputFile').setValue(fileName);
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  openCreateNewObjectDialog (titleText: string): void {
    const dialogRef = this.dialogMatDialog.open(CreateNewObjectComponent, {
      width: '475px',
      height: 'auto',
      data: {
        titleText: titleText,
        codeObject: 'DOCUMENT_TYPE'
      }
    });

    dialogRef.componentInstance.onCreateNewObject.subscribe((response) => {
      this.contractService.getAllDocumentTypes().subscribe((res: any) => {
        this.arrayDocTypes = res;
        this.formGroup.get('selectedDocumentType').setValue(response);
      },() => {
        this.toastr.error('Error', 'Something went wrong(Cannot fetch list of document types)');
      });

      dialogRef.close();
    });
  }

  signedDateChanged (event: MatDatepickerInputEvent<Date>): void {
    this.minStartDate = moment(event.value);
  }

  async startDateChanged (event: MatDatepickerInputEvent<Date>) {
    this.maxSignedDate = moment(event.value);
    const paramsForParent = new HttpParams()
                      .set('businessPartnerCode', `${this.businessPartner}`)
                      .set('lteDocStartDate', `${moment(event.value).toISOString()}`);
    await this.contractService.getAllDocumentsByBusinessPartnerAndStartDate(paramsForParent).then((res: any) => {
      this.parentDocuments = res.docs;
      this.parentDocuments = this.parentDocuments.filter(doc => doc.documents._id !== this.data.id_document);
      this.hasParentCheckbox.disabled = this.parentDocuments.length === 0;
    }).catch();

    const paramsForChild = new HttpParams()
                      .set('businessPartnerCode', `${this.businessPartner}`)
                      .set('gteDocStartDate', `${moment(event.value).toISOString()}`);
    await this.contractService.getAllDocumentsByBusinessPartnerAndStartDate(paramsForChild).then((res: any) => {
      this.childDocuments = res.docs;
      this.childDocuments = this.childDocuments.filter(doc => doc.documents._id !== this.data.id_document);
      this.hasChildCheckbox.disabled = this.childDocuments.length === 0;
    }).catch();
  }

}
