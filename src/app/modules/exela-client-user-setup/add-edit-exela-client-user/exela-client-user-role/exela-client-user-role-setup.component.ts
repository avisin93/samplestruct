import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-client-user-role-tab',
  templateUrl: './exela-client-user-role-setup.component.html',
  styleUrls: ['./exela-client-user-role-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaClientUserRoleComponent implements OnInit {

  selectedRootMenu: any;
  selectedSubMenu: any;
  selectedFeature: any;

  selectedSetupName: any;
  selectedSubmenuname: any;
  selectedFeatureName: any;

  @Input('productId') productId = '';

  menuSetupForm: FormGroup;

  roles: Array<any> = [
    {
      value: 'Client Admin', text: 'Client Admin'
    },
    {
      value: 'Client User', text: 'Client User'
    },
    {
      value: 'Super Admin', text: 'Super Admin'
    }
  ];

  setupData: Array<any> = [];

  selectedSetupmenuname: string = '';

  selectedSubMenumenuname: string = '';

  selectedFeaturemenuname: string = '';

  subMenus: Array<any> = [];

  features: Array<any> = [];

  dialogOptions: any = {
    width: '500px',
    height: '320px',
    panelClass: 'appModalPopup'
  };

  constructor (private _router: Router,
        public httpService: HttpService,
        public _toastCtrl: ToastrService,
        private route: ActivatedRoute,
        private loaderService: LoaderService,
        private _fb: FormBuilder) {
    this.menuSetupForm = this._fb.group({
      role: new FormControl('', [Validators.required])
    });
  }

  ngOnInit () {
    this.loadProductMenuById();
  }

  loadProductMenuById () {
    this.loaderService.show();
    this.httpService.get(UrlDetails.$exela_getProductMenuUrl + '/' + this.productId,{}).subscribe((response) => {
      response.forEach((item) => {
        item.submenus.forEach((submenu) => {
          let subsubmenu = submenu.submenus;
          delete submenu.submenus;
          submenu.features = subsubmenu;
        });
      });
      this.setupData = response;
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
      console.log('exception while loading client by id');
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    this.setupData.forEach((item) => {
      item.submenus.forEach((submenu) => {
        let subsubmenu = submenu.features;
        delete submenu.features;
        submenu.submenus = subsubmenu;
      });
    });
    let req = {
      id: this.productId,
      menu: this.setupData
    };
    this.httpService.save(UrlDetails.$exela_addOrUpdateMenusUrl, req).subscribe(response => {
      this._toastCtrl.success('Menu has been added Successfully');
    });
  }

  onSetupSelect (data: any) {
    this.selectedRootMenu = data;
    this.selectedSetupName = data.menuname;
    this.subMenus = data.submenus;
    this.features = [];
  }

  onSubMenuSelect (subMenu: any) {
    this.selectedSubMenu = subMenu;
    this.selectedSubmenuname = subMenu.menuname;
    this.features = subMenu.features;
  }

  onFeaturesSelect (feature: any) {
    this.selectedFeature = feature;
    this.selectedFeatureName = feature.menuname;
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }

  onDeleteMenu (data: {}) {
    data['active'] = false;
  }
}
