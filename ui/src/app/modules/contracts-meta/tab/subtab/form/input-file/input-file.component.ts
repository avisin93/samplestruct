import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ControlContainer, FormControl } from '@angular/forms';
import { getErrorMessage } from 'src/app/modules/utilsValidation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cm-contracts-meta-tab-subtab-form-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss']
})
export class ContractsMetaTabSubtabFormInputFileComponent implements OnInit {
  formGroup: FormGroup;
  @Input() addContractMetaModelId: String;
  @Input() field: any;
  @Input() oneSubtab: Boolean;

  arrayAcceptTypes = ['application/pdf', 'text/plain', 'image/jpg', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  fileToUpload: File;
  fileType: string = null;

  constructor (
    private controlContainer: ControlContainer,
    private toastr: ToastrService
    ) {
  }

  ngOnInit () {
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
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
    this.formGroup.get('attachments').setValue(fileName);
  }
}
