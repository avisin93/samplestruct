import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';
import { StorageService } from '../../../../shared/providers/storage.service';
import { ModelAssignmentModel } from '../model-assignment';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { ModelAssignmentService } from '../model-assignment.service';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-model',
  templateUrl: './add-edit-model.component.html',
  styleUrls: ['./add-edit-model.component.scss'],
  providers: [ModelAssignmentService]
})
export class AddEditModelComponent implements OnInit, OnDestroy {

  @Input('heading') public heading = 'Assign Model';
  @Input('saveButtonTitle') public saveButtonTitle = 'Assign';
  @Input('mode') mode = '';
  @Input('organizationId') organizationId = '';

  dbRole: any;
  addEditUserSetupForm: FormGroup;
  modelSchema: ModelAssignmentModel = new ModelAssignmentModel();
  modelRows: ModelAssignmentModel[];
  projectList: any[] = [];
  projectListMaster: any[] = [];
  docTypes: any[];
  modelList: any[];
  isClientinvalid: boolean = false;
  isProjectNameinvalid: boolean = false;
  isDocTypeInvalid: boolean = false;
  isModelIsInvalid: boolean = false;
  clientList: any[] = [];
  userType: string;

  constructor (
    private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddEditModelComponent>,
    public toastController: ToastrService,
    private modelService: ModelAssignmentService,
    private loaderService: LoaderService
  ) {
    this.addEditUserSetupForm = this._fb.group({
      productName: new FormControl(''),
      projectName: new FormControl('', [Validators.required]),
      formType: new FormControl('',[Validators.required]),
      modelname: new FormControl('', [Validators.required]),
      modelDescription: new FormControl('', [Validators.required]),
      selectedClient: new FormControl('')
    });
  }

  ngOnInit (): void {
    this.userType = StorageService.get(StorageService.userRole);
    this.getProjectList();
    this.getModelList();
  }

  ngOnDestroy () {

  }

  saveModel ({ value, valid }: { value: any, valid: boolean }) {
    this.loaderService.show();
    if (!valid) {
      this.addEditUserSetupForm.markAsDirty();
      this.loaderService.hide();
      this.isDocTypeInvalid = true;
      this.isClientinvalid = true;
      this.isProjectNameinvalid = (value.projectName === '' || isNullOrUndefined(value.projectName));
      this.isDocTypeInvalid = (value.formType === '' || isNullOrUndefined(value.formType));
      this.isModelIsInvalid = (value.modelname === '' || isNullOrUndefined(value.modelname));
    } else {
      this.addEditUserSetupForm.markAsPristine();
      this.modelSchema.createdBy = {
        userName: StorageService.get(StorageService.userName),
        userRole: StorageService.get(StorageService.userRole)
      };
      this.modelSchema.productName = value.productName;
      this.modelSchema.projectName = value.projectName;
      this.modelSchema.formType = value.formType;
      this.modelSchema.modelname = value.modelname;
      this.modelSchema.modelDescription = value.modelDescription;
      this.modelSchema.organizationid = this.organizationId;
      this.modelSchema.active = this.mode === 'Add' ? true : value.active;
      this.mode === 'Add' ? this.addNewModel() : this.updateExistingModel(this.dbRole._id);
    }
  }

  addNewModel () {
    this.modelService.saveAssignmentModel(this.modelSchema).subscribe(data => {
      this.toastController.success('Model added successfully');
      this.loaderService.hide();
      this.closePopup();
    }, () => {
      this.toastController.error('Something went wrong');
      this.loaderService.hide();
      this.closePopup();
    });
  }

  updateExistingModel (modelId) {
    const payload = { modelId: modelId, modelData: this.modelSchema };
    this.modelService.updateAssignmentModel(payload).subscribe(data => {
      this.toastController.success('Model updated successfully');
      this.loaderService.hide();
      this.closePopup();
    }, () => {
      this.toastController.error('Something went wrong');
      this.loaderService.hide();
      this.closePopup();
    }
        );
  }

  setEditFormValues (details?: any) {
    this.dbRole = details;
    details['selectedClient'] = details.organizationid;
    this.addEditUserSetupForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

  getClientSpecificProjectsAndModels (organizationId) {
    this.organizationId = organizationId;
    this.getProjectList();
    this.getModelList();
  }

  getProjectList () {
    this.loaderService.show();
    this.projectList = [];
    this.projectListMaster = [];
    this.modelService.getProjectList({ organizationId: this.organizationId }).subscribe(data => {
      this.loaderService.hide();
      this.projectListMaster = data.slice(0);
      this.projectList = this.projectListMaster.map((project) => { return { label: project.name, value: project.name }; });
      if (this.mode === 'Edit') {
        this.getDocListForTheProject(this.dbRole.projectName);
      }
    }, () => {
      this.toastController.error('Something went wrong');
      this.loaderService.hide();
    });
  }

  getDocListForTheProject (name) {
    if (!isNullOrUndefined(this.projectListMaster)) {
      const selectedProject = this.projectListMaster.find((project) => project.name === name);
      const selectedDocs = !isNullOrUndefined(selectedProject) ? selectedProject.doctypes : [];
      this.docTypes = !isNullOrUndefined(selectedDocs) ?
                selectedDocs.map(doc => { return { label: doc.name, value: doc.name }; }) : [];
    }
  }

  getModelList () {
    this.loaderService.show();
    this.modelList = [];
    this.modelService.getModelList({ organizationId: this.organizationId }).subscribe(data => {
      this.loaderService.hide();
      if (data.status) {
        const tempList = data.modelList;
        this.modelList = tempList.map((tempModel) => {
          return { label: tempModel.modelname, value: tempModel._id };
        });
      }
    },() => {
      this.toastController.error('Something went wrong');
      this.loaderService.hide();
    });
  }

}
