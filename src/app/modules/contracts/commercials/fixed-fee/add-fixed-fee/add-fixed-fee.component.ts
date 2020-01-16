import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { numberValidator, getErrorMessage } from 'src/app/modules/utilsValidation';
import { CommercialsService } from '../../commercials.service';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '../../../contracts.service';
import { MatSelect, MatDatepickerInputEvent, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { CreateNewObjectComponent } from '../../../create-new-object-dialog/create-new-object.component';
import { IClientSpecific } from 'src/app/interfaces/client-specific.interface';

declare var google: any;
const UOM = 'UOM';
const SERVICE: string = 'SERVICE';
const SUB_SERVICE: string = 'SUB_SERVICE';
const PROJECT: string = 'PROJECT';
const LINKED_OPPORTUNITY: string = 'LINKED_OPPORTUNITY';
@Component({
  selector: 'cm-add-fixed-fee',
  templateUrl: './add-fixed-fee.component.html',
  styleUrls: ['./add-fixed-fee.component.scss']
})
export class AddFixedFeeComponent implements OnInit {

  formGroup: FormGroup;
  selectedLocation = false;
  additionalReportingFields = false;
  idFixedFee: string;

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
  arrayLinkedOpportunity: any[];
  @Input() generalInfoLocation: string;

  @Input() set transferData (transferData) {
    this.maxDateFrom = false;
    this.minDateTo = false;
    this.additionalReportingFields = false;
    if (transferData !== undefined && transferData.data.update) {
      transferData.data.update = null;
      this.formGroup.get('lineItem').setValue(transferData.data.line_item);
      this.formGroup.get('currency').setValue(transferData.data.currency);
      if (transferData.data.currency) {
        this.formGroup.get('rate').enable();
      }
      this.formGroup.get('rate').setValue(transferData.data.rate);
      this.formGroup.get('uom').setValue(transferData.data.uom);
      this.formGroup.get('effectiveStartDate').setValue(transferData.data.effective_start_date);
      this.formGroup.get('effectiveEndDate').setValue(transferData.data.effective_end_date);
      this.formGroup.get('advanceBilling').setValue(transferData.data.advance_billing);
      this.formGroup.get('selectedLinkedOpportunity').setValue(transferData.data.linked_opportunity);
      this.selectedAdvanceBilling();
      this.formGroup.get('applicablePeriod').setValue(transferData.data.applicable_period);
      this.formGroup.get('referenceNo').setValue(transferData.data.reference_no);
      this.formGroup.get('relatedReferenceNo').setValue(transferData.data.related_ref_no);
      this.formGroup.get('relatedDoc').setValue(transferData.data.related_doc);
      this.formGroup.get('platformsApplicable').setValue(transferData.data.platform_applicable);
      this.formGroup.get('project').setValue(transferData.data.project);
      this.formGroup.get('subProject').setValue(transferData.data.sub_project);
      this.formGroup.get('service').setValue(transferData.data.service);
      this.formGroup.get('subService').setValue(transferData.data.sub_service);
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

      this.idFixedFee = transferData.data.id_fixed_fee;
    } else {
      if (transferData) {
        transferData.data.update = null;
      }
      this.idFixedFee = '';

      for (const control of Object.keys((this.formGroup.get('additionalFormGroup') as FormGroup).controls)) {
        if (control.indexOf('_') > -1) {
          (this.formGroup.get('additionalFormGroup') as FormGroup).removeControl(control);
        }
      }

      this.additionalReportingFields = false;
      this.additionalReportingFieldsArray = [];
      this.formGroup.reset();
      this.formGroup.get('rate').disable();
      this.formGroup.get('effectiveStartDate').disable();
      this.formGroup.get('effectiveEndDate').disable();
      this.formGroup.get('location').setValue(this.generalInfoLocation);
    }

    if (this.contractService.contractId && this.contractService.contractId !== '0') {
      const urlParams = {
        contractId: `${this.contractService.contractId}`
      };

      this.commercialsService.getAllDocumentsForContract(urlParams).subscribe(
        (res: any) => { this.arrayRelatedDoc = res.rowsTable; },
        () => {
          this.toastr.error(
          'Error',
          'Internal Server Error (Cannot fetch list of docs)'
          );
        }
      );
    }
    this.onChanges();
    this.isDirty.emit(false);
  }
  @ViewChild('location') private locationInput: HTMLInputElement;
  @ViewChild('currencyDropDown') currencyDropDown: MatSelect;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  @Output() goBack: EventEmitter<any> = new EventEmitter<string>();

  arrayUoms: [];
  arrayServices: any[];
  arraySubServices: any[];
  arrayCurrencies: [];
  arrayRelatedDoc: [];
  arrayProject: any[];
  arraySubProject: [];
  arrayApplicablePeriods: [];
  additionalReportingFieldsArray: any[] = [];

  minDateTo;
  maxDateFrom;

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      lineItem: new FormControl(''),
      currency: new FormControl(''),
      rate: new FormControl({value: '',
        disabled: !(this.formGroup &&
        this.formGroup.controls.currency.value &&
        this.formGroup.controls.currency.value !== '')},
        [numberValidator]),
      uom: new FormControl(''),
      effectiveStartDate: new FormControl({ value: '', disabled: true }),
      effectiveEndDate: new FormControl({ value: '', disabled: true }),
      advanceBilling: new FormControl('true'),
      applicablePeriod: new FormControl(''),
      referenceNo: new FormControl(''),
      relatedReferenceNo: new FormControl(''),
      selectedLinkedOpportunity: new FormControl(''),
      relatedDoc: new FormControl(''),
      platformsApplicable: new FormControl(''),
      project: new FormControl(''),
      subProject: new FormControl(''),
      service: new FormControl(''),
      subService: new FormControl(''),
      location: new FormControl(''),
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
    private toastr: ToastrService,
    private contractService: ContractService,
    public cdr: ChangeDetectorRef,
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
    this.commercialsService.getAllUoms().subscribe(
      (res: any) => {
        this.arrayUoms = res;
        this.filteredUoms.next(this.arrayUoms.slice());
      }, () => {
      this.toastr.error(
        'Error',
        'Internal Server Error (Cannot fetch list of uoms)'
        );
    }
    );

    this.commercialsService.getAllApplicablePeriods().subscribe(
      (res: any) => { this.arrayApplicablePeriods = res; },
      () => {
        this.toastr.error(
        'Error',
        'Internal Server Error (Cannot fetch list of applicable periods)'
        );
      }
    );

    this.commercialsService.getAllCurrencies().subscribe(
      (res: any) => { this.arrayCurrencies = res; },
      () => {
        this.toastr.error(
        'Error',
        'Internal Server Error (Cannot fetch list of currencies)'
        );
      }
    );

    this.commercialsService.getAllSubProjects().subscribe(
      (res: any) => { this.arraySubProject = res; },
      () => {
        this.toastr.error(
        'Error',
        'Internal Server Error (Cannot fetch list of projects)'
        );
      }
    );
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
      let formattedAddress = this.getFormattedAddress(autocomplete.getPlace());
      this.formGroup.get('location').setValue(typeof formattedAddress !== 'undefined'
        && typeof formattedAddress !== null ? formattedAddress['formatted_address'] : null);
      this.formGroup.get('location').setErrors(null);
      this.selectedLocation = true;
      this.cdr.detectChanges();
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

  focusSelect () {
    if (!(this.formGroup.get('currency').value &&
      this.formGroup.get('currency').value !== '')) {
      this.currencyDropDown.toggle();
    }
  }

  selectedCurrency () {
    if (this.formGroup.get('currency').value &&
        this.formGroup.get('currency').value !== '') {
      this.formGroup.get('rate').enable();
    }
  }

  selectedAdvanceBilling () {
    if (this.formGroup.get('advanceBilling').value && this.formGroup.get('advanceBilling').value !== '') {
      this.formGroup.get('effectiveStartDate').enable();
      this.formGroup.get('effectiveEndDate').enable();
    } else {
      this.formGroup.get('effectiveStartDate').setValue(null);
      this.formGroup.get('effectiveStartDate').disable();
      this.formGroup.get('effectiveEndDate').setValue(null);
      this.formGroup.get('effectiveEndDate').disable();
    }
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

  saveFixedFee () {
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

    let urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    const objectFixedFee = {
      line_item: this.formGroup.get('lineItem').value,
      currency_code: this.formGroup.get('currency').value,
      rate: this.formGroup.get('rate').value,
      uom_code: this.formGroup.get('uom').value,
      effective_start_date: this.formGroup.get('effectiveStartDate').value,
      effective_end_date: this.formGroup.get('effectiveEndDate').value,
      advance_billing: this.formGroup.get('advanceBilling').value,
      applicable_period_code: this.formGroup.get('applicablePeriod').value,
      reference_no: this.formGroup.get('referenceNo').value,
      related_ref_no: this.formGroup.get('relatedReferenceNo').value,
      linked_opportunity_code: this.formGroup.get('selectedLinkedOpportunity').value,
      related_doc: this.formGroup.get('relatedDoc').value,
      platform_applicable: this.formGroup.get('platformsApplicable').value,
      service_code: this.formGroup.get('service').value,
      sub_service_code: this.formGroup.get('subService').value,
      project_code: this.formGroup.get('project').value,
      sub_project_code: this.formGroup.get('subProject').value,
      location: this.formGroup.get('location').value,
      additional_reporting_fields: []
    };

    for (const field of this.additionalReportingFieldsArray) {
      field.value = this.formGroup.get('additionalFormGroup').get('valueAdditionalReport_' + field.prop).value;
      objectFixedFee.additional_reporting_fields.push(field);
    }

    let dataFixedFee: any = {
      data: {
        fixed_fee: objectFixedFee
      }
    };

    if (this.idFixedFee !== undefined && this.idFixedFee !== '') {
      urlParams['fixedFeeId'] = `${this.idFixedFee}`;

      this.commercialsService.updateFixedFee(dataFixedFee, urlParams).subscribe(
        (response: any) => {
          this.goToTable();
          this.toastr.success('Operation Complete', 'Fixed Fee successfully updated');
        },
        () => {
          this.toastr.error(
            'Error',
            'Cannot update fixed fee'
          );
        }
      );
    } else {
      this.commercialsService.createFixedFee(dataFixedFee, urlParams).subscribe(
        (response: any) => {
          this.goToTable();
          this.toastr.success('Operation Complete', 'Fixed Fee successfully added');
        },
        () => {
          this.toastr.error(
            'Error',
            'Cannot create fixed fee'
          );
        }
      );
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

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  protected filterUoms () {
    if (!this.arrayUoms) {
      return;
    }
    // get the search keyword
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
          this.formGroup.get('service').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of services)');
        });
      }
      if (codeObject === SUB_SERVICE) {
        this.commercialsService.getAllClientSubServices().subscribe((res: any) => {
          this.arraySubServices = res;
          this.filteredSubService.next(this.arraySubServices.slice());
          this.formGroup.get('subService').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of subservices)');
        });
      }
      if (codeObject === PROJECT) {
        this.commercialsService.getAllClientProjects().subscribe((res: any) => {
          this.arrayProject = res;
          this.filteredProject.next(this.arrayProject.slice());
          this.formGroup.get('project').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of projects)');
        });
      }
      dialogRef.close();
    });
  }
}
