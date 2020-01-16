import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { StorageService } from '../../../shared/providers/storage.service';
import { SessionService } from '../../../shared/providers/session.service';
import { FormGroup, FormBuilder,FormControl, Validators } from '@angular/forms';
import { Pattern } from '../../../../models/util/pattern.model';
import { PoiSetUpService } from '../exela-poi-setup.service';
import { MatDialog } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { ExelaCreateCustomerSetupComponent } from '../../exela-customer-group-setup/exela-customer-create-setup/exela-create-customer-setup.component';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/modules/request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-create-poi-setup',
  templateUrl: './exela-create-poi-setup.component.html',
  providers: [PoiSetUpService],
  styleUrls: ['./exela-create-poi-setup.component.scss']
})
export class ExelaCreatePoiSetupComponent implements OnInit, OnDestroy {
  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  showDeleteButton: boolean = true;
  showDeactivateButton: boolean = true;
  createPoiForm: FormGroup;
  heading: String = 'POI Details';
  records: Array<any> = [];
  records1: Array<any> = [];
  POI: any;
  poiid: string = '';
  mode: string = '';
  totalRows: number = 0;
  id: string = '';
  hasActionButtons: boolean = true;
  allowClientAdd: boolean = false;
  showUsersButton: boolean = false;
  validPhoneNumber: boolean = true;
  selectGender: boolean = false;
  showInstruction: boolean = false;
  maxDate = new Date();
  organizationId: string = '';
  public phoneMask = [ /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/];
  breadcrumbs: Array<any> = [
    {   text: 'Home', base: true, link: '/home', active: false },
    {   text: 'ReachOut', base: true, link: '/reachout-setup', active: false },
    {   text: 'POI List', base: true, link: '/ro-poi', active: false },
    {   text: 'POI Details', base: false, link: '', active: true }
  ];

  language: Array<any> = [
    { value: 'eng', text: 'English' },
    { value: 'marathi', text: 'Marathi' }
  ];

  alternateLanguage: Array<any> = [];
  customeGroup: Array<any> = [
    { value: 'cuatome',text: 'Customer' },
    { value: 'Employee',text: 'Employee' }
  ];

  constructor (
    private _router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public requestService: RequestService,
    public _toastCtrl: ToastrService,
    private _fb: FormBuilder,
    private poisetupservice: PoiSetUpService
  ) {
    this.createPoiForm = this._fb.group({
      firstName: new FormControl('', [Validators.required, Validators.pattern(Pattern.ONLY_CHARACTERS)]),
      middleName: new FormControl('',Validators.pattern(Pattern.ONLY_CHARACTERS)),
      lastName: new FormControl('', [Validators.required, Validators.pattern(Pattern.ONLY_CHARACTERS)]),
      userName: new FormControl(''),
      dob: new FormControl(''),
      age: new FormControl('',[Validators.pattern(Pattern.ONLY_NUMBER_PATTERN)]),
      addr1: new FormControl('', [Validators.required]),
      addr2: new FormControl(''),
      city: new FormControl('',Validators.pattern(Pattern.ONLY_CHARACTERS)),
      state: new FormControl('',Validators.pattern(Pattern.ONLY_CHARACTERS)),
      zip: new FormControl('',[Validators.required,Validators.pattern(Pattern.ONLY_NUMBER_PATTERN)]),
      homePhone: new FormControl(''),
      cellPhone: new FormControl('',[Validators.required]),
      workPhone: new FormControl(''),
      email: new FormControl('',[Validators.required,Validators.pattern(Pattern.EMAIL_PATTERN)]),
      language: new FormControl(''),
      customeGroup:  new FormControl(''),
      alternateLanguage: new FormControl(''),
      customerGroup: new FormControl(''),
      gender: new FormControl(''),
      poiid: this.getRandomNumber(),
      deleteFlag: false,
      active: true
    });
  }

  ngOnInit () {
    this.createPoiForm.controls['dob'].setValue(this.maxDate);

    this.alternateLang();
    this.route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        this.route.params.subscribe((params: any) => {
          this.poiid = params.id;
          this.organizationId = params.organizationId;
        });
      } else if (this.mode === 'add') {
        this.route.params.subscribe((params: any) => {
          this.organizationId = params.id;
        });
      }
    });
    this.id = this.poiid;
    this.getPoiDetails();
    this.getCustomerGroupDetails();
    this.loadPoiDetailbyPoiid(this.poiid);
  }

  alternateLang () {
    this.alternateLanguage = [
      { value: 'eng', text: 'English' },
      { value: 'marathi', text: 'Marathi' },
      { value: 'hindi', text: 'Hindi' }
    ];
  }

  loadPoiDetailbyPoiid (_id: any) {
    if (_id && _id !== '') {
      this.poisetupservice.loadPoiDetailService(_id).subscribe((response) => {
        response['dob'] = new Date(response['dob']);
        let poi = {
          firstName: response['first_name'],
          middleName: response['middle_name'],
          lastName: response['last_name'],
          userName: response['username'],
          dob: response['dob'],
          age: response['age'],
          addr1: response['address1'],
          addr2: response['address2'],
          city: response['city'],
          state: response['state'],
          zip: response['zip'],
          homePhone: response['home_phone'],
          cellPhone: response['cell_phone'],
          workPhone: response['work_phone'],
          email: response['email'],
          language: response['language'],
          customerGroup:  response['customer_group'],
          alternateLanguage: response['alternate_language'],
          gender: response['gender'],
          deleteFlag: false,
          active: response['active']
        };
        this.setEditFormValues(poi);
      }, () => {
        console.log('exception while loading poi by Id');
      });
    }
  }

  setEditFormValues (details?: any) {
    this.createPoiForm.patchValue(details);
  }

  gotoPoiSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/ro-poi' ,{ organizationId: this.organizationId }]);
  }

  savePoi ({ value,valid }: {value: any,valid: boolean}) {
    let organizationId = StorageService.get(StorageService.organizationId);
    if (value.userName === '') {
      value.userName = value.email;
    }
    if (value.gender === '') {
      this.selectGender = true;
    }
    if (!valid || value.gender === '') {
      this.createPoiForm.markAsDirty();
    } else {
      if (this.mode === 'add') {
        if (value.male === true) {
          value.gender = 'male';
        } else if (value.female === true) {
          value.gender = 'female';
        }
        this.POI = value;
        this.POI.organizationid = this.organizationId;

        const newObject = {
          active: value.active,
          first_name: value.firstName,
          middle_name: value.middleName,
          last_name: value.lastName,
          username: value.userName,
          dob: value.dob,
          gender: value.gender,
          age: value.age,
          address1: value.addr1,
          address2: value.addr2,
          city: value.city,
          state: value.state,
          zip: value.zip,
          home_phone: value.homePhone,
          work_phone: value.cellPhone,
          cell_phone: value.workPhone,
          email: value.email,
          language: value.language,
          alternate_language: value.alternateLanguage,
          customer_group: value.customerGroup,
          organization_id: this.organizationId,
          poi_id: value.poiid
        };

        if (this.records1.length !== 0) {
          for (let i = 0;i < this.records1.length;i++) {
            if (!isNullOrUndefined(this.records1[i]) && !isNullOrUndefined(this.records1[i].email) && this.records1[i].email.toLowerCase() === this.POI.email.toLowerCase()) {
              this._toastCtrl.error('POI email already exist');
              break;
            }
            if (!isNullOrUndefined(this.records1[i]) && !isNullOrUndefined(this.records1[i].userName) && this.records1[i].userName.toLowerCase() === this.POI.userName.toLowerCase()) {
              this._toastCtrl.error('POI UserName already exist');
              break;
            }
            if (i === this.records1.length - 1) {
              this.poisetupservice.savePoiDetailService(newObject).subscribe(response => {
                this._toastCtrl.success('POI has been added Successfully');
                this.gotoPoiSetup();
              }, (error) => {
                if (error.status === 400) {
                  this._toastCtrl.error(error.error);
                }
              });
            }
          }
        } else {
          this.poisetupservice.savePoiDetailService(newObject).subscribe(response => {
            this._toastCtrl.success('POI has been added Successfully');
            this.gotoPoiSetup();
          }, (error) => {
            if (error.status === 400) {
              this._toastCtrl.error(error.error);
            }
          });
        }

      } else if (this.mode === 'edit') {
        if (value.male === true) {
          value.gender = 'male';
        } else if (value.female === true) {
          value.gender = 'female';
        }
        this.POI = value;
        this.POI._id = this.id;
        const newObject = {
          _id: this.id,
          active: value.active,
          first_name: value.firstName,
          middle_name: value.middleName,
          last_name: value.lastName,
          username: value.userName,
          dob: value.dob,
          gender: value.gender,
          age: value.age,
          address1: value.addr1,
          address2: value.addr2,
          city: value.city,
          state: value.state,
          zip: value.zip,
          home_phone: value.homePhone,
          work_phone: value.cellPhone,
          cell_phone: value.workPhone,
          email: value.email,
          language: value.language,
          alternate_language: value.alternateLanguage,
          customer_group: value.customerGroup,
          organization_id: this.organizationId
        };
        for (let i = 0;i < this.records1.length;i++) {
          if (!isNullOrUndefined(this.records1[i]) && !isNullOrUndefined(this.records1[i].email) && this.records1[i].email.toLowerCase() === this.POI.email.toLowerCase() && this.records1[i]._id !== this.POI._id) {
            this._toastCtrl.error('POI email already exist');
            break;
          }
          if (!isNullOrUndefined(this.records1[i]) && !isNullOrUndefined(this.records1[i].userName) && this.records1[i].userName.toLowerCase() === this.POI.userName.toLowerCase() && this.records1[i]._id !== this.POI._id) {
            this._toastCtrl.error('POI UserName already exist');
            break;
          }
          if (i === this.records1.length - 1) {
            this.poisetupservice.updatePoiDetailService(newObject).subscribe(response => {
              this._toastCtrl.success('POI has been Updated Successfully');
              this.gotoPoiSetup();
            }, (error) => {
              if (error.status === 400) {
                this._toastCtrl.error(error._body);
              }
            });
          }
        }
      }
    }
  }

  getRandomNumber (): any {
    let random = Math.floor(new Date().valueOf() * Math.random());
    return random;
  }

  createCustomeGroupPopup () {
    let addUserDialogRef = this.dialog.open(ExelaCreateCustomerSetupComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.mode = 'add';
    addUserDialogRef.componentInstance.organizationId = this.organizationId;
    addUserDialogRef.afterClosed().subscribe((result) => {
      this.getCustomerGroupDetails();
    });
  }

  dialogOptions: any = {
    width: '450px'
  };

  getCustomerGroupDetails () {
    this.requestService.doGET('/api/reachout/customerGroups', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        if (!item.deleteFlag && item.active === true && item.organization_id === this.organizationId) {
          tmpRecords.push(item);
        }
      });
      this.records = tmpRecords;
    }, () => {
    });
  }

  getPoiDetails () {
    this.poisetupservice.getAllPoiDetailService().subscribe(Poi => {
      let tmpRecords = [];
      Poi.forEach((item: any) => {
        if ((!item.deleteFlag && this.organizationId === item.organization_id)) {
          tmpRecords.push(item);
        }
      });
      this.records1 = tmpRecords;
    }, () => {});
  }

  restrictNumeric (e: any) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s\-]/.test(input);
  }

  phoneNumberValid (event) {
    let PhoneNO = this.createPoiForm.controls['workPhone'].value;
    let regExp = /^\(?([0-9]{2,3})\)?((-){1,2})?([0-9]{10,15})$/;
           // var poe = "91-88778555575";
    if (regExp.test(PhoneNO)) {
      this.validPhoneNumber = true;
      return true;
    } else {
      const getemailControl = this.createPoiForm.get('workPhone');
      getemailControl.setValidators([Validators.required]);
      this.validPhoneNumber = false;
      getemailControl.updateValueAndValidity();
    }
  }

  addGender (gender) {
    this.selectGender = false;
  }

  langaugeSelect (event) {
    this.alternateLang();
    this.alternateLanguage.forEach((lang, index) => {
      if (event.value === lang.value) {
        this.alternateLanguage.splice(index, 1);
      }
    });
  }

  focusFunction () {
    this.showInstruction = true;
  }

  hide () {
    this.showInstruction = false;
  }

  ngOnDestroy () {}
}
