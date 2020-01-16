import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../shared/providers/http.service';
import { UrlDetails } from '../../../models/url/url-details.model';
import { DynamicThemeService } from '../../shared/providers/dynamic-theme.service';
import { SessionService } from '../../shared/providers/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-theme',
  templateUrl: './add-edit-theme.component.html',
  styleUrls: ['./add-edit-theme.component.scss']

})

export class AddEditThemeComponent implements OnInit,OnDestroy {

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Site Design Setup',
      base: true,
      link: '/exela-storefront-setup',
      active: false
    }
  ];

  mode: string = '';
  heading: string = 'Add Theme';
  addEditThemeForm: FormGroup;
  testThemeTitle: string = 'Test Theme';
  testThemeFlag: boolean = false;
  themeId: string = '';
  fonts: Array<any> = [
        { value: 'Open Sans Regular', text: 'Open Sans Regular' },
        { value: 'Helvitica Regular', text: 'Helvitica Regular' },
        { value: 'Proxima Nova', text: 'Proxima Nova' },
        { value: 'Karla', text: 'Karla' }
  ];

  constructor (private _route: ActivatedRoute,
        private _fb: FormBuilder,
        private httpService: HttpService, private _toastCtrl: ToastrService, private router: Router) {
    this.addEditThemeForm = this._fb.group({
      themeName: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      font: new FormControl('', [Validators.required]),
      mainHeaderColor: new FormControl('', [Validators.required]),
      headerTextColor: new FormControl('', [Validators.required]),
      leftPanelColor: new FormControl('', [Validators.required]),
      leftNavigationColor: new FormControl('', [Validators.required]),
      leftNavigationHoverColor: new FormControl('', [Validators.required]),
      bodyTextColor: new FormControl('', [Validators.required]),
      mainHeadingColor: new FormControl('', [Validators.required]),
      primaryButtonColor: new FormControl('', [Validators.required]),
      primaryHoverButtonColor: new FormControl('', [Validators.required]),
      isActive: true,
      createdby: null,
      createdon: null,
      modifiedby: null,
      modifiedon: null

    });
  }

  ngOnInit () {
    this._route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      this.breadcrumbs.push({
        text: this.heading,
        base: false,
        link: '',
        active: true
      });
      if (this.mode === 'edit') {
        this.heading = 'Edit Theme';
        this._route.params.subscribe((param: any) => {
          this.themeId = param['id'];
          this.httpService.getAll(UrlDetails.$getStoreFrontTheme + param['id'] + '?' + Date.now()).subscribe(data => {
            this.setEditValues(data);
          }, () => {
            console.log('error while getting store front details');
          });
        });
      }
    });
  }

  saveTheme ({ value, valid }: { value: any, valid: boolean }) {
    DynamicThemeService.removeThemeStyling('test-dynamic-theme');
    if (!valid) {
      this.addEditThemeForm.markAsDirty();
      this.addEditThemeForm.get('font').markAsTouched();
    } else {
      this.addEditThemeForm.markAsPristine();
      if (this.mode === 'edit') {
        value.createdon = Date.now();
        this.httpService.update(UrlDetails.$updateThemeUrl + this.themeId, value).subscribe((data: any) => {
          this._toastCtrl.success('Theme updated successfully');
          this.gotoStoreFrontList();
        }, (error) => {
          console.log(error);
        });
      } else {
        value.modifiedon = Date.now();
        this.httpService.save(UrlDetails.$saveThemeUrl, value).subscribe((data: any) => {
          this._toastCtrl.success('Theme saved successfully');
          this.gotoStoreFrontList();
        }, (error) => {
          console.log(error);
        });

      }
    }
  }

  setEditValues (details: any) {
    this.addEditThemeForm.patchValue(details);
  }

  onColorSelection (details) {
    if (details) {
      let colorCode = details.colorCode.toUpperCase();
      let controlName = details.controlName;
      this.addEditThemeForm.get(controlName).setValue(colorCode);
      this.testThemeTitle = 'Test Theme';
    }
  }
  testTheme () {
    if (this.testThemeFlag === false) {
      let colors = [
        this.addEditThemeForm.get('mainHeaderColor').value,
        this.addEditThemeForm.get('leftPanelColor').value,
        this.addEditThemeForm.get('leftNavigationColor').value,
        this.addEditThemeForm.get('leftNavigationHoverColor').value,
        this.addEditThemeForm.get('headerTextColor').value,
        this.addEditThemeForm.get('mainHeadingColor').value,
        this.addEditThemeForm.get('bodyTextColor').value,
        this.addEditThemeForm.get('primaryButtonColor').value,
        this.addEditThemeForm.get('primaryHoverButtonColor').value
      ];
      let styleRules = DynamicThemeService.getThemeStylingRule(colors);
      DynamicThemeService.setThemeStyling(styleRules, 'test-dynamic-theme');
      this.testThemeTitle = 'Reset Theme';
      this.testThemeFlag = true;
    } else {
      this.testThemeTitle = 'Test Theme';
      this.testThemeFlag = false;
      DynamicThemeService.removeThemeStyling('test-dynamic-theme');
    }
  }

  cancel () {
    DynamicThemeService.removeThemeStyling('test-dynamic-theme');
    this.gotoStoreFrontList();
  }

  gotoStoreFrontList () {
    this.router.navigate([SessionService.get('base-role') + '/exela-storefront-setup']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  ngOnDestroy () {
    DynamicThemeService.removeThemeStyling('test-dynamic-theme');
  }
}
