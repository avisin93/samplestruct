import { Component, OnInit, Input, ViewChild, ElementRef, NgZone, AfterViewInit, SimpleChange, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from '../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../shared/providers/session.service';
import { getErrorMessage } from '../../utilsValidation';
import { CreateNewObjectComponent } from '../create-new-object-dialog/create-new-object.component';
import { MatDialog } from '@angular/material';
import { StorageService } from '../../shared/providers/storage.service';
import { IClientSpecific } from 'src/app/interfaces/client-specific.interface';

declare var google: any;
const GENERAL_INFO: string = 'GENERAL_INFO';
const BUSINESS_PARTNER: string = 'BUSINESS_PARTNER';
const CATEGORY: string = 'CATEGORY';
const SUBCATEGORY: string = 'SUBCATEGORY';
const LEGAL_ENTITY: string = 'LEGAL_ENTITY';

function numberValidator (control: AbstractControl): {[key: string]: any} {
  const isNum = isNaN(control.value);
  return isNum ? { 'invalidNumber': { value: control.value } } : null;
}

@Component({
  selector: 'cm-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit {

  hasParent = false;
  selectedLocation = false;

  formGroup: FormGroup;

  public addr: object;
  @ViewChild('location') private locationInput: HTMLInputElement;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  @Output() locationOutput: EventEmitter<string> = new EventEmitter();

  @Input() matgroup;
  @ViewChild('currencyDropDown') currencyDropDown: ElementRef;

  arrayCategories = [];
  arraySubcategories = [];
  arrayBusinessPartners = [];
  arrayLegalEntities = [];
  arrayCurrencies = [];

  constructor (private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private dialogMatDialog: MatDialog
    ) {
    this.initializeForm();
  }

  ngOnInit () {
    this.contractService.getClientConfigurations().subscribe(
      (res: any) => {
        this.arrayCategories = res.category;
        this.arrayBusinessPartners = res.business_partner;
        this.arrayLegalEntities = res.legal_entity;
      },
      () => {
        this.toastr.error('Error', 'Something went wrong(Cannot fetch data)');
      }
    );

    this.contractService.getAllCurrencies().subscribe(
      (res: any) => {
        this.arrayCurrencies = res;
      },
      () => {
        this.toastr.error('Error', 'Something went wrong(Cannot fetch list of currencies)');
      }
    );

    if (typeof this.contractService.contractData !== 'undefined'
        && this.contractService.contractData !== null) {
      if (this.contractService.contractData.category) {
        this.formGroup.get('selectedContractCategory').setValue(this.contractService.contractData.category ? this.contractService.contractData.category.code : '');
        if (this.contractService.contractData.sub_category || this.contractService.contractData.category) {
          this.formGroup.get('selectedContractSubcategory').enable();
          this.arraySubcategories = this.contractService.contractData.category.sub_categories;
          this.formGroup.get('selectedContractSubcategory').setValue(this.contractService.contractData.sub_category ? this.contractService.contractData.sub_category.code : '');
        }
      }

      this.formGroup.get('selectedBusinessPartner').setValue(this.contractService.contractData.business_partner ? this.contractService.contractData.business_partner.code : '');
      this.formGroup.get('contractTitle').setValue(this.contractService.contractData.contract_title);
      this.formGroup.get('location').setValue(this.contractService.contractData.location);
      this.selectedLocation = true;
      this.formGroup.get('currencyType').setValue(this.contractService.contractData.currency_contract_value ? this.contractService.contractData.currency_contract_value.code : '');
      this.contractService.setGenInfoCurrency(this.contractService.contractData.currency_contract_value ? this.contractService.contractData.currency_contract_value : {});
      this.selectedCurrency();
      this.formGroup.get('contractValue').setValue(this.contractService.contractData.contract_value);
      this.formGroup.get('selectedLegalEntity').setValue(this.contractService.contractData.legal_entity ? this.contractService.contractData.legal_entity.code : '');
    } else {
      this.initializeForm();

      this.contractService.setGenInfoCurrency({});
    }
    this.onChanges();
    this.isDirty.emit(false);
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
      this.formGroup.get('selectedContractSubcategory').disable();
    }

    this.formGroup = new FormGroup({
      selectedContractCategory: new FormControl('', Validators.required),
      selectedContractSubcategory: new FormControl({value: '',disabled: !(this.formGroup && this.formGroup.controls &&
                  this.formGroup.controls.selectedContractCategory.value &&
                  this.formGroup.controls.selectedContractCategory.value !== '')}, [Validators.required]),
      selectedBusinessPartner: new FormControl('',Validators.required),
      contractTitle: new FormControl('',Validators.required),
      location: new FormControl('',Validators.required),
      selectedLegalEntity: new FormControl('',Validators.required),
      currencyType: new FormControl('', Validators.required),
      contractValue: new FormControl({value: '',disabled: !(this.formGroup && this.formGroup.controls &&
                    this.formGroup.controls.currencyType.value &&
                    this.formGroup.controls.currencyType.value !== '')},[numberValidator, Validators.required])
    });
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
      this.ref.detectChanges();
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

  cancel (): void {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
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

  saveAndContinueGeneralInformationContract (): void {
    if (this.validate()) {
      const objectData = {
        'organization_code': StorageService.get(StorageService.organizationCode),
        'type': GENERAL_INFO,
        'data': {
          'category_code': this.formGroup.get('selectedContractCategory').value,
          'subcategory_code': this.formGroup.get('selectedContractSubcategory').value,
          'business_partner_code': this.formGroup.get('selectedBusinessPartner').value,
          'contract_title': this.formGroup.get('contractTitle').value,
          'location': this.formGroup.get('location').value,
          'currency_contract_value_code': this.formGroup.get('currencyType').value,
          'contract_value': this.formGroup.get('contractValue').value,
          'legal_entity_code': this.formGroup.get('selectedLegalEntity').value
        }
      };

      if (typeof this.contractService.contractId !== 'undefined'
        && this.contractService.contractId !== null
        && this.contractService.contractId !== '0') {
        const urlParams = {
          'contractId': `${this.contractService.contractId}`
        };
        this.contractService.updateContract(objectData, urlParams).subscribe((response: any) => {
          if (response.msg != null && response.msg === 'Failed') {
            this.toastr.error('Error', 'Something went wrong');
          } else {
            this.contractService.contractId = response._id;
            this.contractService.contractData = response;
            if (this.formGroup.get('currencyType').value && this.formGroup.get('currencyType').value !== '') {
              this.contractService.setGenInfoCurrency(this.arrayCurrencies.find(obj => obj.code === this.formGroup.get('currencyType').value));
            }
            this.toastr.success('Operation Complete', 'General Information successfully updated');
          }
        });
      } else {
        this.contractService.createContract(objectData).subscribe((response: any) => {
          if (response.msg != null && response.msg === 'Failed') {
            this.toastr.error('Error', 'Something went wrong');
          } else {
            this.contractService.contractId = response._id;
            this.contractService.contractData = response;

            if (this.formGroup.get('currencyType').value && this.formGroup.get('currencyType').value !== '') {
              this.contractService.setGenInfoCurrency(this.arrayCurrencies.find(obj => obj.code === this.formGroup.get('currencyType').value));
            }
            this.toastr.success('Operation Complete', 'General Information successfully added');
          }
        });
      }

      this.isDirty.emit(false);
      this.matgroup.selectedIndex += 1;
    }
  }

  focusSelect () {
    if (!(this.formGroup.get('currencyType').value &&
      this.formGroup.get('currencyType').value !== '')) {
      // @ts-ignore
      this.currencyDropDown.trigger.nativeElement.click(); // TODO
    }
  }

  selectedCurrency () {
    if (this.formGroup.get('currencyType').value &&
        this.formGroup.get('currencyType').value !== '') {
      this.formGroup.get('contractValue').enable();
    }
  }

  selectedCategory () {
    if (this.formGroup.get('selectedContractCategory').value &&
        this.formGroup.get('selectedContractCategory').value !== '') {
      this.formGroup.get('selectedContractSubcategory').enable();
      this.arraySubcategories = this.arrayCategories.find(cat =>
        cat.code === this.formGroup.get('selectedContractCategory').value).sub_categories;
    }
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  getFormattedAddress (place) {
    // @params: place - Google Autocomplete place object
    // @returns: location_obj - An address object in human readable format
    let locationObj = {};
    for (let i in place.address_components) {
      let item = place.address_components[i];

      locationObj['formatted_address'] = place.formatted_address;
      if (item['types'].indexOf('locality') > -1) {
        locationObj['locality'] = item['long_name'];
      } else if (item['types'].indexOf('administrative_area_level_1') > -1) {
        locationObj['admin_area_l1'] = item['short_name'];
      } else if (item['types'].indexOf('street_number') > -1) {
        locationObj['street_number'] = item['short_name'];
      } else if (item['types'].indexOf('route') > -1) {
        locationObj['route'] = item['long_name'];
      } else if (item['types'].indexOf('country') > -1) {
        locationObj['country'] = item['long_name'];
      } else if (item['types'].indexOf('postal_code') > -1) {
        locationObj['postal_code'] = item['short_name'];
      }

    }
    return locationObj;
  }

  openCreateNewObjectDialog (titleText: string, codeObject: string): void {
    if (codeObject === SUBCATEGORY && this.formGroup.get('selectedContractCategory').value === '') {
      this.toastr.error('Error', 'In order to create new subcategory you need to choose category first');
      return;
    }
    const dialogRef = this.dialogMatDialog.open(CreateNewObjectComponent, {
      width: '475px',
      height: 'auto',
      data: {
        titleText: titleText,
        codeObject: codeObject,
        parentCodeObject: this.formGroup.get('selectedContractCategory').value
      }
    });

    dialogRef.componentInstance.onCreateNewObject.subscribe((response) => {
      if (codeObject === BUSINESS_PARTNER) {
        this.contractService.getClientBusinessPartners().subscribe((res: any) => {
          this.arrayBusinessPartners = res;
          this.formGroup.get('selectedBusinessPartner').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of business partners)');
        });
      } else if (codeObject === CATEGORY) {
        this.contractService.getClientCategories().subscribe((res: any) => {
          this.arrayCategories = res;
          this.formGroup.get('selectedContractCategory').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of categories)');
        });
      } else if (codeObject === SUBCATEGORY) {
        this.contractService.getClientCategories().subscribe((res: any) => {
          this.arrayCategories = res;
          this.selectedCategory();
          this.formGroup.get('selectedContractSubcategory').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of categories)');
        });
      } else if (codeObject === LEGAL_ENTITY) {
        this.contractService.getClientLegalEntities().subscribe((res: any) => {
          this.arrayLegalEntities = res;
          this.formGroup.get('selectedLegalEntity').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of legal entities)');
        });
      }
      dialogRef.close();
    });
  }

  ngOnDestroy (): void {
    const location = this.formGroup.get('location').value;
    this.locationOutput.emit(location);
  }
}
