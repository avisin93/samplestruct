import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ContactPersonService } from '../contact-person.service';
import { ContractService } from '../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { alphanumericApostrophesAndUnderscoreValidator, getErrorMessage } from '../../../utilsValidation';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AsYouType, getCountryCallingCode, isValidNumber } from 'libphonenumber-js';
import { Pattern } from 'src/app/models/util/pattern.model';
import { MatSelect } from '@angular/material/select';
import { CreateNewObjectComponent } from '../../create-new-object-dialog/create-new-object.component';
import { MatDialog } from '@angular/material/dialog';

const FUNCTION = 'FUNCTION';
@Component({
  selector: 'cm-add-contact-person',
  templateUrl: './add-contact-person.component.html',
  styleUrls: ['./add-contact-person.component.scss']
})
export class AddContactPersonComponent implements OnInit {

  formGroup: FormGroup;
  updateContactPerson: boolean = false;
  idContactPerson: string;
  arrayAllCountryList: Array<any> = [];
  arrayFunctions: Array<any> = [];
  tmpArrayAllCountryList: Array<any> = [];

  @ViewChild('singleSelect') singleSelect: MatSelect;
  public functionFilterCtrl: FormControl = new FormControl();
  protected _onDestroySingleSelect = new Subject<void>();
  public filteredFunctions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  @Output() goBack: EventEmitter<any> = new EventEmitter<string>();
  @Input() generalInfoLocation: string;
  @Input() set transferData (transferData) {
    if (this.formGroup) {
      this.formGroup.reset();
    }
    if (transferData && transferData.data.update) {
      this.formGroup.get('selectedFunction').setValue(transferData.data.function);
      this.formGroup.get('person').setValue(transferData.data.person);
      this.formGroup.get('email').setValue(transferData.data.email);
      this.formGroup.get('countryName').setValue({ name: transferData.data.countryName, code: transferData.data.countryCode });
      this.formGroup.get('countryPhoneCode').setValue(transferData.data.countryPhoneCode);
      this.formGroup.get('phoneNumber').setValue(transferData.data.phoneNumber);
      this.idContactPerson = transferData.data.idContactPerson;
      this.updateContactPerson = transferData.data.update;
    } else {
      this.idContactPerson = '';
      this.updateContactPerson = false;
      this.formGroup = this.createFormGroup();
      this.formGroup.reset();
      this.formGroup.controls['countryName'].valueChanges.pipe(
        takeUntil(this._onDestroy)).subscribe(() => {
          this.filterCountries();
        });
    }
    this.onChanges();
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  createFormGroup () {
    return new FormGroup({
      selectedFunction: new FormControl(''),
      person: new FormControl('', [ alphanumericApostrophesAndUnderscoreValidator ]),
      email: new FormControl('', [Validators.pattern(Pattern.EMAIL_PATTERN)]),
      countryName: new FormControl(''),
      countryPhoneCode: new FormControl(''),
      phoneNumber: new FormControl('')
    });
  }

  constructor (
    private toastr: ToastrService,
    private contactPersonService: ContactPersonService,
    private contractService: ContractService,
    private dialogMatDialog: MatDialog
  ) {}

  ngOnInit () {
    this.formGroup = this.createFormGroup();

    this.contactPersonService.getAllCountryList().subscribe((res: any) => {
      this.arrayAllCountryList = res;
      this.filteredCountries.next(res);
    });

    this.functionFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterFunctions();
    });
    this.contactPersonService.getAllFunctions().subscribe((res: any) => {
      this.arrayFunctions = res;
      this.filteredFunctions.next(this.arrayFunctions.slice());
    });

  }

  ngOnDestroy () {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterCountries () {
    if (!this.arrayAllCountryList) {
      return;
    }

    let search = this.formGroup.get('countryName').value;
    if (!search) {
      this.filteredCountries.next(this.arrayAllCountryList.slice());
      return;
    } else if (typeof search === 'string') {
      search = search.toLowerCase();
      this.filteredCountries.next(
        this.arrayAllCountryList.filter(country => country.name.toLowerCase().indexOf(search) > -1)
      );
    }
  }

  displayCountryAndGetCountryCodeFn (country?: any): any | undefined {
    if (country) {
      return country.name;
    } else {
      return undefined;
    }
  }

  getSelectedCountryValue (country?: any): void {
    try {
      const countryPhoneCode = getCountryCallingCode(country.code);
      this.formGroup.get('countryPhoneCode').setValue('+' + countryPhoneCode);
    } catch (error) {
      console.log(error);
      this.toastr.error('Error', 'This country is not supported!');
    }
  }

  onInputPhoneNumber (event): void {
    const phoneNumber = event.target.value;
    const country = this.formGroup.get('countryName').value;
    const asYouType = new AsYouType(country.code);
    this.formGroup.get('phoneNumber').setValue(asYouType.input(phoneNumber));
    if (!isValidNumber(phoneNumber, country.code)) {
      this.formGroup.get('phoneNumber').markAsTouched();
      this.formGroup.get('phoneNumber').setErrors({ 'invalidPhoneNumber': true });
    }
  }

  goToTableContactPerson () {
    this.goBack.emit();
  }

  cancel () {
    this.isDirty.emit(false);
    this.goToTableContactPerson();
  }

  saveAndContinueContactPerson (): void {
    if (!this.validate()) {
      return;
    }

    let urlParams = {
      contractId: `${this.contractService.contractId}`
    };
    let objectData = {
      data: {
        contact_person: {
          function: this.formGroup.get('selectedFunction').value,
          person: this.formGroup.get('person').value,
          email: this.formGroup.get('email').value,
          country_name: (this.formGroup.get('countryName').value) ? (this.formGroup.get('countryName').value).name : '',
          country_code: (this.formGroup.get('countryName').value) ? (this.formGroup.get('countryName').value).code : '',
          country_phone_code: this.formGroup.get('countryPhoneCode').value,
          phone_number: this.formGroup.get('phoneNumber').value
        }
      }
    };

    if (this.idContactPerson !== '' && this.updateContactPerson) {
      urlParams['contactPersonId'] = this.idContactPerson;
      this.contactPersonService.updateContactPerson(objectData, urlParams).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Contact person successfully updated');
        this.goToTableContactPerson();
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Error', 'Something went wrong(Cannot update contact person)');
      });
    } else {
      this.contactPersonService.createContactPerson(objectData, urlParams).subscribe((response: any) => {
        this.toastr.success('Operation Complete', 'Contact person successfully added');
        this.goToTableContactPerson();
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Error', 'Something went wrong(Cannot create contact person)');
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

    return validate;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  protected filterFunctions () {
    if (!this.arrayFunctions) {
      return;
    }
    let search = this.functionFilterCtrl.value;
    if (!search) {
      this.filteredFunctions.next(this.arrayFunctions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFunctions.next(
      this.arrayFunctions.filter((uom: any) => uom.name.toLowerCase().indexOf(search) > -1)
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
      if (codeObject === FUNCTION) {
        this.contactPersonService.getAllFunctions().subscribe((res: any) => {
          this.arrayFunctions = res;
          this.filteredFunctions.next(this.arrayFunctions.slice());
          this.formGroup.get('selectedFunction').setValue(response);
        },() => {
          this.toastr.error('Error', 'Something went wrong(Cannot fetch list of uoms)');
        });
      }
      dialogRef.close();
    });
  }

  ngOnChanges (): void {
    if (this.generalInfoLocation && !this.formGroup.get('countryName').value) {
      const arrayLp = this.generalInfoLocation.split(',');
      this.generalInfoLocation = arrayLp[arrayLp.length - 1].trim();
      if (this.arrayAllCountryList.length > 0) {
        const resultCountry = this.arrayAllCountryList.find(c => c.name.toLowerCase() === this.generalInfoLocation.toLowerCase());
        this.formGroup.get('countryName').setValue(resultCountry);
        this.getSelectedCountryValue(resultCountry);
      }
    }
  }
}
