import { Component, OnInit, ViewChild, TemplateRef, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommercialsService } from '../../commercials.service';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ContractService } from '../../../../../modules/contracts/contracts.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { numberValidator, getErrorMessage, digitWithSpacesValidator, alphanumericWithSpacesValidator } from 'src/app/modules/utilsValidation';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent, MatSelect, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { AdditionalReportingFieldsComponent } from '../../additional-reporting-fields/additional-reporting-fields.component';
import { Subject } from 'rxjs/internal/Subject';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { CreateNewObjectComponent } from '../../../create-new-object-dialog/create-new-object.component';
import { IClientSpecific } from 'src/app/interfaces/client-specific.interface';

declare var google: any;
const UOM = 'UOM';
const LINKED_OPPORTUNITY: string = 'LINKED_OPPORTUNITY';
const SERVICE: string = 'SERVICE';
const SUB_SERVICE: string = 'SUB_SERVICE';
const PROJECT: string = 'PROJECT';
@Component({
  selector: 'cm-add-transaction-rate-volume',
  templateUrl: './add-transaction-rate-volume.component.html',
  styleUrls: ['./add-transaction-rate-volume.component.scss']
})

export class AddTransactionRateVolumeComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionColumnTemplate') actionColumnTemplate: TemplateRef<any>;
  @ViewChild('textFieldLowerTierColumnTemplate') textFieldLowerTierColumnTemplate: TemplateRef<any>;
  @ViewChild('textFieldUpperTierColumnTemplate') textFieldUpperTierColumnTemplate: TemplateRef<any>;
  @ViewChild('textFieldRateColumnTemplate') textFieldRateColumnTemplate: TemplateRef<any>;
  @ViewChild('selectApplicableFactorColumnTemplate') selectApplicableFactorColumnTemplate: TemplateRef<any>;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  @Input() generalInfoLocation: string;

  @ViewChild('singleSelect') singleSelect: MatSelect;
  public uomFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public filteredUoms: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredLinkedOpportunities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredProject: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public linkedOpportunityFilter: FormControl = new FormControl();
  public serviceFilter: FormControl = new FormControl();
  public subserviceFilter: FormControl = new FormControl();
  public projectFilter: FormControl = new FormControl();
  @Input() set transferData (transferData) {
    this.maxDateFrom = false;
    this.minDateTo = false;
    this.additionalReportingFields = false;
    while (this.rowsTable.length) {
      this.rowsTable.removeAt(0);
    }
    this.initializeForm();
    if (transferData !== undefined && transferData.data.update) {
      transferData.data.update = null;
      this.lastIndexInTable = 0;
      this.formGroup.get('effectiveStartDate').setValue(transferData.data.effective_start_date);
      this.formGroup.get('effectiveEndDate').setValue(transferData.data.effective_end_date);
      this.formGroup.get('inputLineItem').setValue(transferData.data.line_item);
      this.formGroup.get('selectedTierType').setValue(transferData.data.tier_type_code);
      this.formGroup.get('selectedVolumeSplit').setValue(transferData.data.volume_split_code);
      this.formGroup.get('inputVolumeGroupName').setValue(transferData.data.volume_group_name);
      this.formGroup.get('selectedProject').setValue(transferData.data.project_code);
      this.formGroup.get('selectedSubProject').setValue(transferData.data.sub_project_code);
      this.formGroup.get('inputPlatformsApplicable').setValue(transferData.data.platform_applicable);
      this.formGroup.get('selectedRelatedDoc').setValue(transferData.data.related_doc_code);
      this.formGroup.get('selectedLinkedOpportunity').setValue(transferData.data.linked_opportunity_code);
      this.formGroup.get('inputRelatedRefNo').setValue(transferData.data.related_ref_no);
      this.formGroup.get('inputReferenceNo').setValue(transferData.data.reference_no);
      this.formGroup.get('uom').setValue(transferData.data.uom_code);
      this.formGroup.get('selectedService').setValue(transferData.data.service_code);
      this.formGroup.get('selectedSubService').setValue(transferData.data.sub_service_code);
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

      this.idTransactionRateVolume = transferData.data.id_transaction_rate_volume;
      this.lastIndexInTable = -1;
      this.addNewRow(transferData.data.commercial_rate_percentage);

    } else if (transferData !== undefined && transferData.data.update === false) {
      transferData.data.update = null;
      this.idTransactionRateVolume = '';

      for (const control of Object.keys((this.formGroup.get('additionalFormGroup') as FormGroup).controls)) {
        if (control.indexOf('_') > -1) {
          (this.formGroup.get('additionalFormGroup') as FormGroup).removeControl(control);
        }
      }

      this.additionalReportingFields = false;
      this.additionalReportingFieldsArray = [];

      this.formGroup.reset();
      this.formGroup.get('selectedTierType').setValue('SIMPLE', { onlySelf: true });
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

  selectedAppFactor;

  columnsTable = [];
  rowsTable: FormArray;
  tempRowsTable = [];
  idTransactionRateVolume: string;
  selectedLocation = false;

  arrayUoms: [];
  arrayServices: any[];
  arraySubServices: any[];
  arrayTierTypes: [];
  arrayCurrency: [];
  arrayVolumeSplit: [];
  arrayApplicableFactor: [];
  arrayLinkedOpportunity: any[];
  arrayRelatedDoc: [];
  arrayProject: any[];
  arraySubProject: [];
  additionalReportingFieldsArray: any[] = [];
  isEditable = {};

  minDateTo;
  maxDateFrom;

  lastIndexInTable: number = -1;

  showTable: boolean = true;
  showAdd: boolean = false;

  formGroup: FormGroup;

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      uom: new FormControl(''),
      selectedService: new FormControl(''),
      selectedSubService: new FormControl(''),
      location: new FormControl(''),
      selectedTierType: new FormControl(''),
      selectedVolumeSplit: new FormControl(''),
      selectApplicableFactor: new FormControl(''),
      selectedLinkedOpportunity: new FormControl(''),
      selectedRelatedDoc: new FormControl(''),
      selectedProject: new FormControl(''),
      selectedSubProject: new FormControl(''),
      inputRate: new FormControl(''),
      inputLineItem: new FormControl(''),
      inputVolumeGroupName: new FormControl(''),
      inputReferenceNo: new FormControl(''),
      inputRelatedRefNo: new FormControl('', [alphanumericWithSpacesValidator]),
      inputPlatformsApplicable: new FormControl(''),
      inputLabelAdditionalReport: new FormControl(''),
      inputValueAdditionalReport: new FormControl(''),
      effectiveStartDate: new FormControl(''),
      effectiveEndDate: new FormControl(''),
      tableGroup: this.fb.array([]),
      additionalFormGroup: new FormGroup({
        labelAdditionalReport: new FormControl(''),
        configurationAdditionalReport: new FormControl('')
      })
    });

    this.rowsTable = this.formGroup.get('tableGroup') as FormArray;
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  constructor (
    private commercialsService: CommercialsService,
    private contractService: ContractService,
    private toastr: ToastrService,
    public cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialogMatDialog: MatDialog
    ) {
    this.initializeForm();
  }

  get tableGroup () {
    return this.formGroup.get('tableGroup') as FormArray;
  }

  getTable (index): FormGroup {
    const formGroup = this.rowsTable.controls[index] as FormGroup;
    return formGroup;
  }

  ngOnInit () {
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

    this.commercialsService.getAllTierTypes().subscribe((res: any) => {
      this.arrayTierTypes = res;
    });

    this.commercialsService.getAllCurrencies().subscribe((res: any) => {
      this.arrayCurrency = res;
    });

    this.commercialsService.getAllVolumeSplit().subscribe((res: any) => {
      this.arrayVolumeSplit = res;
    });

    this.commercialsService.getAllApplicableFactors().subscribe((res: any) => {
      this.arrayApplicableFactor = res;
    });

    this.commercialsService.getAllRelatedDocs().subscribe((res: any) => {
      this.arrayRelatedDoc = res;
    });

    this.commercialsService.getAllSubProjects().subscribe((res: any) => {
      this.arraySubProject = res;
    });

  }

  createTableGroup () {
    return this.fb.group({
      lower_tier: new FormControl('', [numberValidator]),
      upper_tier: new FormControl('', [numberValidator]),
      rate: new FormControl('', [numberValidator]),
      applicable_factor: new FormControl('')
    });
  }

  createTableGroupWithDefinedData (data) {
    let pom = data.applicable_factor;
    if (pom && pom.code) {
      pom = pom.code;
    }

    return this.fb.group({
      lower_tier: new FormControl(data.lower_tier, [numberValidator]),
      upper_tier: new FormControl(data.upper_tier , [numberValidator]),
      rate: new FormControl(data.rate, [numberValidator]),
      applicable_factor: new FormControl(pom)
    });
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
        name: 'LOWER TIER',
        prop: 'lower_tier',
        sortable: true,
        cellTemplate: this.textFieldLowerTierColumnTemplate,
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'UPPER TIER',
        prop: 'upper_tier',
        sortable: true,
        cellTemplate: this.textFieldUpperTierColumnTemplate,
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'RATE',
        prop: 'rate',
        sortable: true,
        cellTemplate: this.textFieldRateColumnTemplate,
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'APPLICABLE FACTOR',
        prop: 'applicable_factor',
        sortable: true,
        cellTemplate: this.selectApplicableFactorColumnTemplate,
        resizeable: false,
        minWidth: 90
      },
      {
        name: 'ACTION',
        prop: 'action',
        sortable: false,
        cellTemplate: this.actionColumnTemplate,
        resizeable: false,
        minWidth: 90
      }
    ];
    this.datatable.recalculateColumns();
  }

  dateFromChanged (event: MatDatepickerInputEvent<Date>): void {
    this.minDateTo = moment(event.value).add(1, 'd');
  }

  dateToChanged (event: MatDatepickerInputEvent<Date>): void {
    this.maxDateFrom = moment(event.value).subtract(1, 'd');
  }

  addNewRow (data?) {
    // disable changing data for row before new row
    let a: FormArray = this.rowsTable;
    if (!data) {
      if (this.rowsTable.length > 0) {
        this.setToDisabledTableFields(this.rowsTable.length - 1);
      }
      this.lastIndexInTable++;
      this.rowsTable.push(this.createTableGroup());
    } else {
      data.forEach((element, i) => {
        this.lastIndexInTable++;
        let a: FormGroup = this.createTableGroupWithDefinedData(element);
        this.rowsTable.push(a);
        this.setToDisabledTableFields(i);
      });
      this.lastIndexInTable++;
      let a: FormGroup = this.createTableGroup();
      this.rowsTable.push(a);
    }
    // setTimeout(() => {
    //   for (let i = 0;i < this.lastIndexInTable;i++) {
    //     if (this.getTable(i) !== undefined && this.rowsTable.length > 1) {
    //       this.setToDisabledTableFields(i);
    //     }
    //   }
    // }, 0);
    this.cd.markForCheck();
  }

  deleteRow (rowIndex) {
    this.rowsTable.removeAt(rowIndex);
    this.lastIndexInTable--;
    this.initDataTable();
  }

  setApplicableFactor (element,value, row, rowIndex) {
    row[element] = value;
    this.rowsTable[rowIndex] = row;
  }

  ngAfterViewInit (): void {
    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement);
      // Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // Emit the new address object for the updated place
      let formattedAddress = this.getFormattedAddress(autocomplete.getPlace());
      this.formGroup.get('location').setValue(typeof formattedAddress !== 'undefined'
        && typeof formattedAddress !== null ? formattedAddress['formatted_address'] : null);
      this.selectedLocation = true;
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

  updateFilter (event, propName) {
    const val = event.target.value.toLowerCase();
    let tempRowsTable;
    tempRowsTable = this.tempRowsTable.filter((d) => {
      if (!propName.includes('.')) {
        return d[propName].toString().toLowerCase().indexOf(val) !== -1 || !val;
      } else {// in case we have object
        let objectPro = d[propName.substring(0,propName.indexOf('.'))];
        return objectPro[propName.substring(propName.indexOf('.') + 1)].toLowerCase().indexOf(val) !== -1 || !val;
      }
    });
    this.rowsTable = tempRowsTable;
    this.datatable.offset = 0;
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
    let locationObj = {};
    for (let i in place.address_components) {
      let item = place.address_components[i];

      locationObj['formatted_address'] = place.formatted_address;
      if (item['types'].indexOf('country') > -1) {
        locationObj['country'] = item['long_name'];
      }

    }
    return locationObj;
  }

  saveTransactionRateVolume () {
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

    const objectTransactionRateVolume = {
      line_item: this.formGroup.get('inputLineItem').value,
      tier_type_code: this.formGroup.get('selectedTierType').value,
      volume_split_code: this.formGroup.get('selectedVolumeSplit').value,
      volume_group_name: this.formGroup.get('inputVolumeGroupName').value,
      uom_code: this.formGroup.get('uom').value,
      effective_start_date: this.formGroup.get('effectiveStartDate').value,
      effective_end_date: this.formGroup.get('effectiveEndDate').value,
      reference_no: this.formGroup.get('inputReferenceNo').value,
      related_ref_no: this.formGroup.get('inputRelatedRefNo').value,
      linked_opportunity_code: this.formGroup.get('selectedLinkedOpportunity').value,
      related_doc_code: this.formGroup.get('selectedRelatedDoc').value,
      platform_applicable: this.formGroup.get('inputPlatformsApplicable').value,
      service_code: this.formGroup.get('selectedService').value,
      sub_service_code: this.formGroup.get('selectedSubService').value,
      project_code: this.formGroup.get('selectedProject').value,
      sub_project_code: this.formGroup.get('selectedSubProject').value,
      location: this.formGroup.get('location').value,
      commercial_rate_percentage: this.rowsTable.getRawValue().slice(0, -1),
      additional_reporting_fields: []
    };

    for (const field of this.additionalReportingFieldsArray) {
      field.value = this.addRepFieldsComponent.additionalFormGroup.get('valueAdditionalReport_' + field.prop).value;
      objectTransactionRateVolume.additional_reporting_fields.push(field);
    }

    const objectData: any = {
      data: {
        transaction_rate_volume: objectTransactionRateVolume
      }
    };

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    if (this.idTransactionRateVolume !== undefined && this.idTransactionRateVolume !== '') {
      urlParams['transactionRateVolumeId'] = `${this.idTransactionRateVolume}`;
      this.commercialsService.updateTransactionRateVolume(objectData, urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          console.log('Status:500');
        } else {
          this.goToTable();
          this.toastr.success('Operation Complete', 'Transaction Rate Volume successfully updated');
        }
      });
    } else {
      this.commercialsService.createTransactionRateVolume(objectData, urlParams).subscribe((response: any) => {
        if (response.status === '500') {
          console.log('Status:500');
        } else {
          this.goToTable();
          this.toastr.success('Operation Complete', 'Transaction Rate Volume successfully added');
        }
      });
    }
    this.isDirty.emit(false);
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

  showAdditionalReportingFields () {
    this.additionalReportingFields = !this.additionalReportingFields;
  }

  getErrorMessage (field: FormControl, customMsg ?: JSON) {
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

  openCreateNewObjectDialog (titleText: string, codeObject: string): void {
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
          this.formGroup.get('uom').setValue(response);
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
