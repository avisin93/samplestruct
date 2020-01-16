import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, Input, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommercialsService } from '../../commercials.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ContractService } from '../../../../../modules/contracts/contracts.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { numberValidator, getErrorMessage, alphanumericValidator } from 'src/app/modules/utilsValidation';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent, MatDialog, MatSelect } from '@angular/material';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { CreateNewObjectComponent } from '../../../create-new-object-dialog/create-new-object.component';
import { Subject } from 'rxjs/internal/Subject';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { IClientSpecific } from 'src/app/interfaces/client-specific.interface';

declare var google: any;
const UOM = 'UOM';
const LINKED_OPPORTUNITY: string = 'LINKED_OPPORTUNITY';
const SERVICE: string = 'SERVICE';
const SUB_SERVICE: string = 'SUB_SERVICE';
const PROJECT: string = 'PROJECT';

@Component({
  selector: 'app-transaction-rate-standard',
  templateUrl: './add-transaction-rate-standard.component.html',
  styleUrls: ['./add-transaction-rate-standard.component.scss']
})
export class AddTransactionRateStandardComponent implements OnInit {
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('sortableHeaderTemplate') sortableHeaderTemplate: TemplateRef<any>;
  @Input() generalInfoLocation: string;

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('singleSelect') singleSelect: MatSelect;
  public uomFilterCtrl: FormControl = new FormControl();
  public linkedOpportunityFilter: FormControl = new FormControl();
  public serviceFilter: FormControl = new FormControl();
  public subserviceFilter: FormControl = new FormControl();
  public projectFilter: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public filteredUoms: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredLinkedOpportunities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredProject: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('currencyDropDown') currencyDropDown: ElementRef;
  @Input() set transferData (transferData) {
    this.additionalReportingFields = false;
    if (transferData !== undefined && transferData.data.update) {
      transferData.data.update = null;
      this.formGroup.get('effectiveStartDate').setValue(transferData.data.effective_start_date);
      this.formGroup.get('effectiveEndDate').setValue(transferData.data.effective_end_date);
      this.formGroup.get('selectedLinkedOpportunity').setValue(transferData.data.linked_opportunity_code);
      this.formGroup.get('selectedRelatedDoc').setValue(transferData.data.related_doc_code);
      this.formGroup.get('inputPlatformsApplicable').setValue(transferData.data.platform_applicable);
      this.formGroup.get('selectedProject').setValue(transferData.data.project_code);
      this.formGroup.get('selectedSubProject').setValue(transferData.data.sub_project_code);
      this.formGroup.get('inputLineItem').setValue(transferData.data.line_item);
      this.formGroup.get('uom').setValue(transferData.data.uom_code);
      this.formGroup.get('selectedBillingType').setValue(transferData.data.billing_type_code);
      this.formGroup.get('inputRelatedRefNo').setValue(transferData.data.related_ref_no);
      this.formGroup.get('inputReferenceNo').setValue(transferData.data.reference_no);
      this.formGroup.get('selectedService').setValue(transferData.data.service_code);
      this.formGroup.get('selectedSubService').setValue(transferData.data.sub_service_code);
      this.formGroup.get('currencyType').setValue(transferData.data.currency_contract_value_code);
      this.selectedCurrency();
      this.formGroup.get('rate').setValue(transferData.data.rate);
      this.formGroup.get('location').setValue(transferData.data.location);
      this.formGroup.get('billingValue').setValue(transferData.data.billing_value);
      this.formGroup.get('radioConsiderForMinBilling').setValue(transferData.data.billing_value || transferData.data.billing_type ? 'true' : 'false');
      this.additionalFields = transferData.data.billing_value || transferData.data.billing_type ? true : false;

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

      this.idTransactionRateStandard = transferData.data.id_transaction_rate_standard;
    } else if (transferData !== undefined && transferData.data.update === false) {
      transferData.data.update = null;
      this.idTransactionRateStandard = '';

      for (const control of Object.keys((this.formGroup.get('additionalFormGroup') as FormGroup).controls)) {
        if (control.indexOf('_') > -1) {
          (this.formGroup.get('additionalFormGroup') as FormGroup).removeControl(control);
        }
      }
      this.additionalFields = false;
      this.additionalReportingFields = false;
      this.additionalReportingFieldsArray = [];
      this.formGroup.reset();
      this.formGroup.get('radioConsiderForMinBilling').setValue('false');
      this.formGroup.get('location').setValue(this.generalInfoLocation);
      this.rowsTable = [];
      this.lastIndexInTable = -1;
    }
    this.onChanges();
    this.isDirty.emit(false);
  }
  @ViewChild('location') private locationInput: HTMLInputElement;
  @Output() goBack: EventEmitter<any> = new EventEmitter<string>();

  selectedAppFactor;

  columnsTable = [];
  rowsTable = [];
  tempRowsTable = [];
  idTransactionRateStandard: string;
  selectedLocation = false;
  onActionRate = new EventEmitter();

  minDateTo;
  maxDateFrom;

  arrayUoms: [];
  arrayServices: any[];
  arraySubServices: any[];
  arrayTierTypes: [];
  arrayCurrencies: [];
  arrayVolumeSplit: [];
  arrayApplicableFactor: [];
  arrayLinkedOpportunity: any[];
  arrayBillingType: [];
  arrayRelatedDoc: [];
  arrayProject: any[];
  arraySubProject: [];
  additionalReportingFieldsArray: any[] = [];

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
      selectedBillingType: new FormControl(''),
      billingValue: new FormControl('', numberValidator),
      selectedService: new FormControl(''),
      selectedSubService: new FormControl(''),
      location: new FormControl(''),
      selectedLinkedOpportunity: new FormControl(''),
      selectedRelatedDoc: new FormControl(''),
      selectedProject: new FormControl(''),
      selectedSubProject: new FormControl(''),
      currencyType: new FormControl(''),
      rate: new FormControl(
        {
          value: '',
          disabled: !(
            this.formGroup &&
            this.formGroup.controls &&
            this.formGroup.controls.currencyType.value &&
            this.formGroup.controls.currencyType.value !== ''
          )
        },
        [ numberValidator]
      ),
      inputLineItem: new FormControl(''),
      inputReferenceNo: new FormControl(''),
      inputRelatedRefNo: new FormControl('', [
        alphanumericValidator
      ]),
      inputPlatformsApplicable: new FormControl(''),
      inputLabelAdditionalReport: new FormControl(''),
      inputValueAdditionalReport: new FormControl(''),
      radioConsiderForMinBilling: new FormControl('false'),
      effectiveStartDate: new FormControl(''),
      effectiveEndDate: new FormControl(''),
      additionalFormGroup: new FormGroup({
        labelAdditionalReport: new FormControl(''),
        configurationAdditionalReport: new FormControl('')
      })
    });

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
    private dialogMatDialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit () {
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
    },() => {
      this.toastr.error('Error', 'Something went wrong(Cannot fetch list of uoms)');
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

    this.contractService.getAllCurrencies().subscribe((res: any) => {
      this.arrayCurrencies = res;
    },() => {
      this.toastr.error('Error', 'Something went wrong(Cannot fetch list of currencies)');
    });

    this.commercialsService.getAllBillingTypes().subscribe((res: any) => {
      this.arrayBillingType = res;
    },() => {
      this.toastr.error('Error', 'Something went wrong(Cannot fetch list of billing types)');
    });

    this.commercialsService.getAllRelatedDocs().subscribe((res: any) => {
      this.arrayRelatedDoc = res;
    },() => {
      this.toastr.error('Error', 'Something went wrong(Cannot fetch list of related docs)');
    });

    this.commercialsService.getAllSubProjects().subscribe((res: any) => {
      this.arraySubProject = res;
    },() => {
      this.toastr.error('Error', 'Something went wrong(Cannot fetch list of subprojects)');
    });
  }

  pageTable = {
    limit: 10,
    count: 0,
    offset: 0
  };

  myMessages = {
    emptyMessage: '<img src="../../../../assets/images/no_data_found.png">',
    totalMessage: 'Displaying item '
  };

  ngAfterViewInit (): void {
    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(
      // @ts-ignore
      this.locationInput.nativeElement
    );
    // Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // Emit the new address object for the updated place
      let formattedAddress = this.getFormattedAddress(autocomplete.getPlace());
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

  dateFromChanged (event: MatDatepickerInputEvent<Date>): void {
    this.minDateTo = moment(event.value).add(1, 'd');
  }

  dateToChanged (event: MatDatepickerInputEvent<Date>): void {
    this.maxDateFrom = moment(event.value).subtract(1, 'd');
  }

  updateFilter (event, propName) {
    const val = event.target.value.toLowerCase();
    let tempRowsTable;
    tempRowsTable = this.tempRowsTable.filter(d => {
      if (!propName.includes('.')) {
        return (
          d[propName]
            .toLowerCase()
            .toString()
            .indexOf(val) !== -1 || !val
        );
      } else {
        // in case we have object
        let objectPro = d[propName.substring(0, propName.indexOf('.'))];
        return (
          objectPro[propName.substring(propName.indexOf('.') + 1)]
            .toLowerCase()
            .indexOf(val) !== -1 || !val
        );
      }
    });
    this.rowsTable = tempRowsTable;
    this.datatable.offset = 0;
  }

  onLimitChange (value) {
    this.pageTable.limit = value;
    this.pageTable.offset = 0;
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

  saveTransactionRateStandard () {
    // if (this.additionalReportingFields) {
    (this.formGroup.get('additionalFormGroup') as FormGroup).get('labelAdditionalReport').clearValidators();
    (this.formGroup.get('additionalFormGroup') as FormGroup).get('labelAdditionalReport').setErrors({});
    (this.formGroup.get('additionalFormGroup') as FormGroup).get('labelAdditionalReport').reset();
    (this.formGroup.get('additionalFormGroup') as FormGroup).get('configurationAdditionalReport').clearValidators();
    (this.formGroup.get('additionalFormGroup') as FormGroup).get('configurationAdditionalReport').setErrors({});
    (this.formGroup.get('additionalFormGroup') as FormGroup).get('configurationAdditionalReport').reset();
    // }

    if (!this.validate()) {
      return;
    }

    const objectTransactionRateStandard = {
      line_item: this.formGroup.get('inputLineItem').value,
      currency_contract_value_code: this.formGroup.get('currencyType').value,
      rate: this.formGroup.get('rate').value,
      uom_code: this.formGroup.get('uom').value,
      billing_type_code: this.formGroup.get('selectedBillingType').value,
      billing_value: this.formGroup.get('billingValue').value,
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
      additional_reporting_fields: []
    };

    for (const field of this.additionalReportingFieldsArray) {
      field.value = this.formGroup.get('additionalFormGroup').get('valueAdditionalReport_' + field.prop).value;
      objectTransactionRateStandard.additional_reporting_fields.push(field);
    }

    const objectData: any = {
      data: {
        transaction_rate_standard: objectTransactionRateStandard
      }
    };

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    if (this.idTransactionRateStandard !== undefined && this.idTransactionRateStandard !== '') {
      urlParams['transactionRateStandardId'] = `${this.idTransactionRateStandard}`;
      this.commercialsService.updateTransactionRateStandard(objectData, urlParams).subscribe((response: any) => {
        if (response && response.status === '500') {
          console.log('Unable to update Transaction rate standard');
          this.toastr.error('Error', 'Unable to update Transaction rate standard');
        } else {
          this.goToTable();
          this.toastr.success('Operation Complete', 'Transaction Rate Standard successfully updated');
        }
      });
    } else {
      this.commercialsService.createTransactionRateStandard(objectData, urlParams).subscribe((response: any) => {
        if (response && response.status === '500') {
          console.log('Unable to delete Transaction rate standard');
          this.toastr.error('Error', 'Unable to delete Transaction rate standard');
        } else {
          this.goToTable();
          this.toastr.success('Operation Complete', 'Transaction Rate Standard successfully added');
        }
      });
    }
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
  additionalFields = false;

  showAdditionalFields () {
    this.additionalFields = true;
  }

  hideAdditionalFields () {
    this.additionalFields = false;
  }

  selectedCurrency () {
    if (this.formGroup.get('currencyType').value && this.formGroup.get('currencyType').value !== '') {
      this.formGroup.get('rate').enable();
    }
  }

  focusSelect () {
    if (!(this.formGroup.get('currencyType').value && this.formGroup.get('currencyType').value !== '')) {
      // @ts-ignore
      this.currencyDropDown.trigger.nativeElement.click(); // TODO
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
