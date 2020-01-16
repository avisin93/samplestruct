import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { getErrorMessage, numberValidator } from 'src/app/modules/utilsValidation';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { CommercialsService } from '../../commercials.service';
import { MatDatepickerInputEvent, MatSelect, MatDialog } from '@angular/material';
import { ContractService } from '../../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { AdditionalReportingFieldsComponent } from '../../additional-reporting-fields/additional-reporting-fields.component';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { CreateNewObjectComponent } from '../../../create-new-object-dialog/create-new-object.component';
import { IClientSpecific } from 'src/app/interfaces/client-specific.interface';

declare const google: any;
const UOM = 'UOM';
const LINKED_OPPORTUNITY: string = 'LINKED_OPPORTUNITY';
const SERVICE: string = 'SERVICE';
const SUB_SERVICE: string = 'SUB_SERVICE';
const PROJECT: string = 'PROJECT';
@Component({
  selector: 'cm-add-time-material-dialog',
  templateUrl: './add-time-material-dialog.component.html',
  styleUrls: ['./add-time-material-dialog.component.scss']
})
export class AddTimeMaterialDialogComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('textFieldDescriptionColumnTemplate') textFieldDescriptionColumnTemplate: TemplateRef<any>;
  @ViewChild('effectiveDateColumnTemplate') effectiveDateColumnTemplate: TemplateRef<any>;
  @ViewChild('selectUomColumnTemplate') selectUomColumnTemplate: TemplateRef<any>;
  @ViewChild('textFieldQuantityColumnTemplate') textFieldQuantityColumnTemplate: TemplateRef<any>;
  @ViewChild('textFieldExtendedRateColumnTemplate') textFieldExtendedRateColumnTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('textFieldRateColumnTemplate') textFieldRateColumnTemplate: TemplateRef<any>;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  @Input() generalInfoLocation: string;

  @ViewChild('singleSelect') singleSelect: MatSelect;
  public uomFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public filteredUoms: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public linkedOpportunityFilter: FormControl = new FormControl();
  public serviceFilter: FormControl = new FormControl();
  public subserviceFilter: FormControl = new FormControl();
  public projectFilter: FormControl = new FormControl();
  public filteredLinkedOpportunities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredProject: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @Input() set transferData (transferData) {
    this.maxDateFrom = false;
    this.minDateTo = false;
    this.additionalReportingFields = false;
    while (this.rowsTable.length !== 0) {
      this.rowsTable.removeAt(0);
    }

    this.initializeForm();
    if (transferData && transferData.data.update) {
      transferData.data.update = null;
      this.lastIndexInTable = 0;
      this.formGroup.get('inputFieldDescription').setValue(transferData.data.description);
      this.formGroup.get('effectiveStartDate').setValue(transferData.data.effective_start_date);
      this.formGroup.get('effectiveEndDate').setValue(transferData.data.effective_end_date);
      this.formGroup.get('inputReferenceNo').setValue(transferData.data.reference_no);
      this.formGroup.get('inputRelatedRefNo').setValue(transferData.data.related_ref_no);
      if (transferData.data.linked_opportunity) {
        this.formGroup.get('selectedLinkedOpportunity').setValue(transferData.data.linked_opportunity.code);
      }
      this.formGroup.get('selectedRelatedDoc').setValue(transferData.data.related_doc);
      this.formGroup.get('inputPlatformsApplicable').setValue(transferData.data.platforms_applicable);
      if (transferData.data.service) {
        this.formGroup.get('selectedService').setValue(transferData.data.service.code);
      }
      if (transferData.data.sub_service) {
        this.formGroup.get('selectedSubService').setValue(transferData.data.sub_service.code);
      }
      if (transferData.data.project) {
        this.formGroup.get('selectedProject').setValue(transferData.data.project.code);
      }
      this.formGroup.get('location').setValue(transferData.data.location);

      this.additionalReportingFieldsArray = transferData.data.additional_reporting_fields;

      for (let i = 0; i < this.additionalReportingFieldsArray.length; i++) {
        const field = this.additionalReportingFieldsArray[i];
        const prop = field.label.split(' ').join('_');
        this.additionalReportingFieldsArray[i].prop = prop;

        (this.formGroup.get('additionalFormGroup') as FormGroup).addControl('labelAdditionalReport_' + prop, new FormControl(field.label, [Validators.required]));
        (this.formGroup.get('additionalFormGroup') as FormGroup).addControl('configurationAdditionalReport_' + prop, new FormControl(field.config, [Validators.required]));
        (this.formGroup.get('additionalFormGroup') as FormGroup).addControl('valueAdditionalReport_' + prop, new FormControl(field.value));

        if (field.config === 'number') {
          (this.formGroup.get('additionalFormGroup') as FormGroup).get('valueAdditionalReport_' + prop).setValidators(numberValidator);
        }
      }

      if (this.addRepFieldsComponent) {
        this.addRepFieldsComponent.additionalFormGroup = (this.formGroup.get('additionalFormGroup') as FormGroup);
      }

      this.idTimeAndMaterial = transferData.data.id_time_and_material;
      this.lastIndexInTable = -1;
      this.addNewRow(transferData.data.time_and_material_details);

    } else if (transferData && transferData.data.update === false) {
      transferData.data.update = null;
      this.idTimeAndMaterial = '';
      this.totalExtendedRate = 0;

      for (const control of Object.keys((this.formGroup.get('additionalFormGroup') as FormGroup).controls)) {
        if (control.indexOf('_') > -1) {
          (this.formGroup.get('additionalFormGroup') as FormGroup).removeControl(control);
        }
      }

      this.additionalReportingFields = false;
      this.additionalReportingFieldsArray = [];

      this.formGroup.reset();
      this.formGroup.get('location').setValue(this.generalInfoLocation);
      this.lastIndexInTable = -1;
      this.addNewRow();
    }
    this.onChanges();
    this.isDirty.emit(false);
  }
  @ViewChild('location') private locationInput: HTMLInputElement;
  @ViewChild(AdditionalReportingFieldsComponent) addRepFieldsComponent: AdditionalReportingFieldsComponent;

  @Output() goBack: EventEmitter<any> = new EventEmitter<string>();

  columnsTable = [];
  rowsTable: FormArray;// 1
  idTimeAndMaterial: string;
  selectedLocation = false;

  arrayLinkedOpportunity: any[];
  arrayRelatedDoc: [];
  arrayServices: any[];
  arraySubServices: any[];
  arrayProject: any[];
  arraySubProject: [];
  arrayUoms: [];
  additionalReportingFieldsArray: any[] = [];

  minDateTo;
  maxDateFrom;

  // effectiveMinEndDate;

  totalExtendedRate: number = 0;

  lastIndexInTable: number = -1;

  formGroup: FormGroup;

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = this.fb.group({
      inputFieldDescription: new FormControl(''),
      effectiveStartDate: new FormControl(''),
      effectiveEndDate: new FormControl(''),
      inputReferenceNo: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+$')]),
      inputRelatedRefNo: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+$')]),
      selectedLinkedOpportunity: new FormControl(''),
      selectedRelatedDoc: new FormControl(''),
      inputPlatformsApplicable: new FormControl(''),
      selectedService: new FormControl(''),
      selectedSubService: new FormControl(''),
      selectedProject: new FormControl(''),
      selectedSubProject: new FormControl(''),
      location: new FormControl(''),
      timeMaterial: this.fb.array([]),
      additionalFormGroup: new FormGroup({
        labelAdditionalReport: new FormControl(''),
        configurationAdditionalReport: new FormControl('')
      })
    });

    this.rowsTable = this.formGroup.get('timeMaterial') as FormArray;
  }

  createTimeMaterialGroup (data?: any): FormGroup {
    if (!data) {
      return this.fb.group({
        description_table: new FormControl(''),
        effective_date: new FormControl(''),
        rate: new FormControl('', numberValidator),
        uom: new FormControl(''),
        quantity: new FormControl('', numberValidator),
        extended_rate: new FormControl('')
      });
    } else {
      let pom = data.uom;
      if (pom && pom.code) {
        pom = pom.code;
      }

      return this.fb.group({
        description_table: new FormControl(data.description_table,[Validators.required]),
        effective_date: new FormControl(data.effective_date),
        rate: new FormControl(data.rate, [numberValidator]),
        uom: new FormControl(pom),
        quantity: new FormControl(data.quantity, [numberValidator]),
        extended_rate: new FormControl(data.extended_rate)
      });
    }
  }

  changeEditable (rowIndex) {
    if (this.getTable(rowIndex).disabled) {
      this.setToEnabledTableFields(rowIndex);
    } else {
      this.setToDisabledTableFields(rowIndex);
    }
  }

  setToDisabledTableFields (rowIndex) {
    this.getTable(rowIndex).disable();
  }

  setToEnabledTableFields (rowIndex) {
    this.getTable(rowIndex).enable();
  }

  getTable (index): FormGroup {
    const formGroup = this.rowsTable.controls[index] as FormGroup;
    return formGroup;
  }

  get timeMaterialGroup () {
    return this.formGroup.get('timeMaterial') as FormArray;
  }

  getTimeMaterial (index): FormGroup {
    const formGroup = this.rowsTable.controls[index] as FormGroup;
    return formGroup;
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  constructor (
    private commercialsService: CommercialsService,
    private contractService: ContractService,
    public cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private dialogMatDialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit () {
    this.contractService.getClientConfigurations().subscribe((res: IClientSpecific) => {
      this.arrayLinkedOpportunity = res.linked_opportunity;
      this.arrayProject = res.project;
      this.arrayServices = res.service;
      this.arraySubServices = res.sub_service;
      this.filteredLinkedOpportunities.next(res.linked_opportunity.slice());
      this.filteredService.next(res.service.slice());
      this.filteredSubService.next(res.sub_service.slice());
      this.filteredProject.next(res.project.slice());
    });
    this.totalExtendedRate = this.getTotalExtendedRate();
    this.initDataTable();

    this.commercialsService.getAllRelatedDocs().subscribe((res: any) => {
      this.arrayRelatedDoc = res;
    });

    this.commercialsService.getAllSubProjects().subscribe((res: any) => {
      this.arraySubProject = res;
    });

    this.initDataTable();
    this.uomFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUoms();
    });
    this.linkedOpportunityFilter.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterLinkedOpportunities();
    });
    this.serviceFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterServices();
      });
    this.subserviceFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSubServices();
      });
    this.projectFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjects();
      });
    this.commercialsService.getAllUoms().subscribe((res: any) => {
      this.arrayUoms = res;
      this.filteredUoms.next(this.arrayUoms.slice());
    });
  }

  pageTable = {
    limit: 10,
    count: 0,
    offset: 0
  };

  public readonly pageLimitOptions = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 50 }
  ];

  myMessages = {
    'emptyMessage': '<img src="../../../../assets/images/no_data_found.png">',
    'totalMessage': 'Displaying item '
  };

  initDataTable () {
    this.columnsTable = [
      {
        name: 'DESCRIPTION',
        prop: 'description',
        sortable: false,
        cellTemplate: this.textFieldDescriptionColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'EFFECTIVE DATE',
        prop: 'effective_date',
        sortable: false,
        cellTemplate: this.effectiveDateColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'RATE',
        prop: 'rate',
        sortable: false,
        cellTemplate: this.textFieldRateColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'UOM',
        prop: 'uom',
        sortable: false,
        cellTemplate: this.selectUomColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'QUANTITY',
        prop: 'quantity',
        sortable: false,
        cellTemplate: this.textFieldQuantityColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'EXTENDED RATE',
        prop: 'extended_rate',
        sortable: false,
        cellTemplate: this.textFieldExtendedRateColumnTemplate,
        resizeable: false,
        minWidth: 120
      },
      {
        name: 'ACTION',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        resizeable: false,
        minWidth: 150
      }
    ];
    this.datatable.recalculateColumns();
  }

  addNewRow (data?) {
    if (!data) {
      if (this.rowsTable.length > 0) {
        this.setToDisabledTableFields(this.rowsTable.length - 1);
      }
      this.lastIndexInTable++;
      this.rowsTable.push(this.createTimeMaterialGroup());
    } else {
      data.forEach((element, i) => {
        this.lastIndexInTable++;
        this.rowsTable.push(this.createTimeMaterialGroup(element));
        this.setToDisabledTableFields(i);
      });
      this.lastIndexInTable++;
      let a: FormGroup = this.createTimeMaterialGroup();
      this.rowsTable.push(a);
    }
    this.totalExtendedRate = this.getTotalExtendedRate();
    this.cd.markForCheck();
  }

  deleteRow (rowIndex) {
    this.rowsTable.removeAt(rowIndex);
    this.lastIndexInTable--;
  }

  dateFromChanged (event: MatDatepickerInputEvent<Date>): void {
    this.minDateTo = moment(event.value).add(1, 'd');
  }

  dateToChanged (event: MatDatepickerInputEvent<Date>): void {
    this.maxDateFrom = moment(event.value).subtract(1, 'd');
  }

  ngAfterViewInit (): void {
    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement);
      // Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // Emit the new address object for the updated place
      const formattedAddress = this.getFormattedAddress(autocomplete.getPlace());
      this.formGroup.get('location').setValue(typeof formattedAddress !== 'undefined'
        && typeof formattedAddress !== null ? formattedAddress['formatted_address'] : null);
      this.formGroup.get('location').setErrors(null);
      this.selectedLocation = true;
      this.cd.detectChanges();
    });
  }

  onManualChangeInputLocation (event): void {
    if (!event || (event && !/^[0-9a-z\s\b]$/i.test(event.key) && event.keyCode !== 8)) {
      return;
    }
    if (this.formGroup.get('location').value && this.formGroup.get('location').value.trim() !== '') {
      this.selectedLocation = false;
      this.formGroup.get('location').setErrors({ 'invalidLocation': true });
    } else {
      this.selectedLocation = true;
    }
  }

  onLimitChange (value) {
    this.pageTable.limit = value;
    this.pageTable.offset = 0;
  }

  changePage (e: any) {
    this.pageTable.offset = e.page - 1;
    this.datatable.onFooterPage(e);
  }

  getFormattedAddress (place) {
    // @params: place - Google Autocomplete place object
    // @returns: location_obj - An address object in human readable format
    const locationObj = {};
    for (let i in place.address_components) {
      const item = place.address_components[i];

      locationObj['formatted_address'] = place.formatted_address;
      if (item['types'].indexOf('country') > -1) {
        locationObj['country'] = item['long_name'];
      }

    }
    return locationObj;
  }

  saveTimeAndMaterial () {
    if (this.additionalReportingFields) {
      (this.formGroup.get('additionalFormGroup') as FormGroup).get('labelAdditionalReport').clearValidators();
      (this.formGroup.get('additionalFormGroup') as FormGroup).get('labelAdditionalReport').setErrors({});
      (this.formGroup.get('additionalFormGroup') as FormGroup).get('labelAdditionalReport').reset();
      (this.formGroup.get('additionalFormGroup') as FormGroup).get('configurationAdditionalReport').clearValidators();
      (this.formGroup.get('additionalFormGroup') as FormGroup).get('configurationAdditionalReport').setErrors({});
      (this.formGroup.get('additionalFormGroup') as FormGroup).get('configurationAdditionalReport').reset();
    }

    if (!this.validate()) {
      return;
    }

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    const objectTimeMaterial = {
      description: this.formGroup.get('inputFieldDescription').value,
      effective_start_date: this.formGroup.get('effectiveStartDate').value,
      effective_end_date: this.formGroup.get('effectiveEndDate').value,
      reference_no: this.formGroup.get('inputReferenceNo').value,
      related_ref_no: this.formGroup.get('inputRelatedRefNo').value,
      linked_opportunity_code: this.formGroup.get('selectedLinkedOpportunity').value,
      related_doc_code: this.formGroup.get('selectedRelatedDoc').value,
      platforms_applicable: this.formGroup.get('inputPlatformsApplicable').value,
      service_code: this.formGroup.get('selectedService').value,
      sub_service_code: this.formGroup.get('selectedSubService').value,
      project_code: this.formGroup.get('selectedProject').value,
      sub_project_code: this.formGroup.get('selectedSubProject').value,
      location: this.formGroup.get('location').value,
      time_and_material_details: this.rowsTable.getRawValue().slice(0, -1),
      total_extended_rate: this.totalExtendedRate,
      additional_reporting_fields: []
    };

    for (const field of this.additionalReportingFieldsArray) {
      field.value = this.addRepFieldsComponent.additionalFormGroup.get('valueAdditionalReport_' + field.prop).value;
      objectTimeMaterial.additional_reporting_fields.push(field);
    }

    const dataTimeMaterial: any = {
      data: {
        time_and_material: objectTimeMaterial
      }
    };

    if (this.idTimeAndMaterial && this.idTimeAndMaterial !== '') {
      urlParams['timeAndMaterialId'] = `${this.idTimeAndMaterial}`;
      this.commercialsService.updateTimeAndMaterial(dataTimeMaterial, urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          console.log('Error while updating item');
        } else {
          this.goToTable();
          this.toastr.success('Operation Complete', 'Time and Material successfully updated');
        }
      });
    } else {
      this.commercialsService.createTimeAndMaterial(dataTimeMaterial, urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          console.log('Error while creating item');
        } else {
          this.goToTable();
          this.toastr.success('Operation Complete', 'Time and Material successfully added');
        }
      });
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

    Object.keys(this.addRepFieldsComponent.additionalFormGroup.controls).forEach(key => {
      if (!['configurationAdditionalReport', 'labelAdditionalReport'].includes(key)) {
        this.addRepFieldsComponent.additionalFormGroup.get(key).markAsTouched();
        if (this.addRepFieldsComponent.additionalFormGroup.get(key).invalid) {
          validate = false;
        }
      }
    });

    return validate;
  }

  goToTable () {
    this.additionalReportingFields = false;
    this.goBack.emit();
    this.isDirty.emit(false);
  }

  cancel () {
    this.isDirty.emit(false);
    this.goToTable();
  }

  additionalReportingFields = false;

  // effectiveStartDateChanged (event: MatDatepickerInputEvent<Date>): void {
  //   this.effectiveMinEndDate = moment(event.value).add(1, 'd');
  // }

  setRowData (element, value, row, rowIndex) {
    row[element] = value;

    if (row['rate'] && row['quantity']) {
      row['extended_rate'] = row['rate'] * row['quantity'];
      this.getTable(rowIndex).get('extended_rate').setValue(row['extended_rate']);
      this.totalExtendedRate = this.getTotalExtendedRate();
    }

    this.formGroup.getRawValue().timeMaterial[rowIndex][element] = value;
  }

  getTotalExtendedRate (): number {
    let sum = 0;
    for (let row of this.rowsTable.controls) {
      if (row.value.extended_rate === null) {
        row.value.extended_rate = 0;
      }
      sum += row.value.extended_rate;
    }
    return sum;
  }

  validationNumber (value): void {
    const isNum = isNaN(value);
    if (isNum) {
     // this.toastr.error('Error', 'Invalid number input');
    }
  }

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  protected filterUoms () {
    if (!this.arrayUoms) {
      return;
    }
    let search = this.uomFilterCtrl.value;
    if (!search) {
      this.filteredUoms.next(this.arrayUoms.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUoms.next(
      this.arrayUoms.filter((uom: any) => uom.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterLinkedOpportunities () {
    if (!this.arrayLinkedOpportunity) {
      return;
    }
    let search = this.linkedOpportunityFilter.value;
    if (!search) {
      this.filteredLinkedOpportunities.next(this.arrayLinkedOpportunity.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredLinkedOpportunities.next(
      this.arrayLinkedOpportunity.filter((prop: any) => prop.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterServices () {
    if (!this.arrayServices) {
      return;
    }
    let search = this.serviceFilter.value;
    if (!search) {
      this.filteredService.next(this.arrayServices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredService.next(
      this.arrayServices.filter((prop: any) => prop.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterSubServices () {
    if (!this.arraySubServices) {
      return;
    }
    let search = this.subserviceFilter.value;
    if (!search) {
      this.filteredSubService.next(this.arraySubServices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSubService.next(
      this.arraySubServices.filter((prop: any) => prop.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterProjects () {
    if (!this.arrayProject) {
      return;
    }
    let search = this.projectFilter.value;
    if (!search) {
      this.filteredProject.next(this.arrayProject.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProject.next(
      this.arrayProject.filter((prop: any) => prop.name.toLowerCase().indexOf(search) > -1)
    );
  }

  openCreateNewObjectDialog (titleText: string, codeObject: string, rowIndex: number = 1): void {
    const dialogRef = this.dialogMatDialog.open(CreateNewObjectComponent, {
      width: '475px',
      height: 'auto',
      data: {
        titleText: titleText,
        codeObject: codeObject
      }
    });

    dialogRef.componentInstance.onCreateNewObject.subscribe((response) => {
      if (codeObject === UOM) {
        this.commercialsService.getAllUoms().subscribe((res: any) => {
          this.arrayUoms = res;
          this.filteredUoms.next(this.arrayUoms.slice());
          this.getTable(rowIndex).get('uom').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of uoms)');
        });
      }
      if (codeObject === LINKED_OPPORTUNITY) {
        this.commercialsService.getAllClientLinkedOpportunities().subscribe((res: any) => {
          this.arrayLinkedOpportunity = res;
          this.filteredLinkedOpportunities.next(this.arrayLinkedOpportunity.slice());
          this.formGroup.get('selectedLinkedOpportunity').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of linked opportunities)');
        });
      }
      if (codeObject === SERVICE) {
        this.commercialsService.getAllClientServices().subscribe((res: any) => {
          this.arrayServices = res;
          this.filteredService.next(this.arrayServices.slice());
          this.formGroup.get('selectedService').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of services)');
        });
      }
      if (codeObject === SUB_SERVICE) {
        this.commercialsService.getAllClientSubServices().subscribe((res: any) => {
          this.arraySubServices = res;
          this.filteredSubService.next(this.arraySubServices.slice());
          this.formGroup.get('selectedSubService').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of subservices)');
        });
      }
      if (codeObject === PROJECT) {
        this.commercialsService.getAllClientProjects().subscribe((res: any) => {
          this.arrayProject = res;
          this.filteredProject.next(this.arrayProject.slice());
          this.formGroup.get('selectedProject').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of projects)');
        });
      }
      dialogRef.close();
    });
  }
}
