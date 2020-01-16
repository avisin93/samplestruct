import { Component, Input, Output, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileUploadController } from '../../../../shared/controllers/file-uploader.controller';
import { ModelAssignmentService } from '../model-assignment.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { StorageService } from '../../../../shared/providers/storage.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-execute-file',
  templateUrl: './execute.file.component.html',
  styleUrls: ['./execute.file.component.scss'],
  providers: [ModelAssignmentService]
})
export class ExecuteFileComponent implements OnInit {

  @Input('title') heading = 'Execute File';
  fileDataArray: string[] = [];
  fileNameArray: string[] = [];
  fileSelected: boolean;
  exeFileAddGroup: FormGroup;
  isFileExecuted: boolean = false;
  outputOfProgram = '';
  modelList: any[] = [];
  isModelNameInvalid: boolean = false;
  isFileValid: boolean = true;
  oldValue: any;
  outputFileName: string = '';
  outputFileData: any;

  constructor (
        private mdRef: MatDialogRef<ExecuteFileComponent>,
        private fb: FormBuilder,
        private fileController: FileUploadController,
        private modelService: ModelAssignmentService,
        private loaderService: LoaderService
    ) {
    this.exeFileAddGroup = this.fb.group({
      active: new FormControl(true),
      modelName: new FormControl('', [Validators.required]),
      fileParameters: this.fb.array([this.getFormGroupForParamaters()])
    });
  }

  ngOnInit () {
    this.getModelList();
  }

  getFormGroupForParamaters () {
    return this.fb.group({
      keyName: new FormControl(''),
      keyValue: new FormControl('')
    });
  }

  addNewParameterPair () {
    const tempFormArray = this.exeFileAddGroup.controls['fileParameters'] as FormArray;
    tempFormArray.push(this.getFormGroupForParamaters());
  }

  getAllParams (fmGroup, keyValue) {
    return (fmGroup.get(keyValue) as FormArray).controls;
  }

  selectfile (input) {
    this.loaderService.show();
    this.fileController.readMultiplBinaryFiles(input, (fileDataArray, fileNameArray) => {
      this.fileDataArray = fileDataArray.slice(0);
      this.fileSelected = true;
      this.fileNameArray = fileNameArray.slice(0);
      this.loaderService.hide();
    });
  }

  setEditFormValues (details) {
    this.oldValue = details;
    this.exeFileAddGroup.patchValue(details);
  }

  closePopup () {
    this.mdRef.close();
  }

  getModelList () {
    this.loaderService.show();
    this.modelList = [];
    this.modelService.getModelList({ organizationId: StorageService.get(StorageService.organizationId) }).subscribe(data => {
      this.loaderService.hide();
      if (data.status) {
        const tempList = data.modelList;
        this.modelList = tempList.map((tempModel) => {
          return { label: tempModel.modelname, value: tempModel._id };
        });
      }
    }, () => {
      this.loaderService.hide();
    });
  }

  processTextFile ({ value, valid }: {value: any, valid: boolean}) {
    this.loaderService.show();
    this.isFileValid = (!isNullOrUndefined(this.fileNameArray) && this.fileNameArray[0] !== '' && this.fileSelected);
    if (!valid) {
      this.loaderService.hide();
      this.exeFileAddGroup.markAsDirty();
    } else {
      this.exeFileAddGroup.markAsPristine();
      if (this.isFileValid) {
        const payload = { fileData: this.fileDataArray, fileName: this.fileNameArray, modelId: value.modelName };
        this.isFileExecuted = false;
        this.modelService.uploadExecutionFile(payload).subscribe(data => {
          this.outputOfProgram = data.output;
          this.isFileExecuted = true;
          this.outputFileName = data.outputFileName;
          this.outputFileData = data.finalOutput;
          this.loaderService.hide();
        },() => {
          this.isFileExecuted = false;
          this.loaderService.hide();
        }
                );
      } else {
        this.loaderService.hide();
      }
    }
  }

  downloadOutputFile () {
    if (this.isFileExecuted && !isNullOrUndefined(this.outputFileData)) {
      let tempLink = document.createElement('a');
      tempLink.download = this.outputFileName;
      let outputData = new Blob([this.outputFileData], { type: 'multipart/form-data' });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(outputData, this.outputFileName);
      } else {
        let linkToOutput = URL.createObjectURL(outputData);
        tempLink.href = linkToOutput;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        URL.revokeObjectURL(linkToOutput);
      }
    }
  }

}
