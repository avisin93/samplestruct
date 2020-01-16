import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-setup',
  templateUrl: './role-setup.component.html',
  styleUrls: ['./role-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RoleSetupComponent implements OnInit {

  roleSetupForm: FormGroup;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Role Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  role: any;
  module: any;

  modules: Array<any> = [];

  roles: Array<any> = [];

  allMenus: Array<any> = [];

  setupData: Array<any> = [];

  selectedSetupName: string = '';

  selectedSubMenuName: string = '';

  selectedFeatureName: string = '';

  subMenus: Array<any> = [];

  features: Array<any> = [];

  permissions: Array<any> = [];

  constructor (private _router: Router,
      public httpService: HttpService,
      public _toastCtrl: ToastrService,
      private _fb: FormBuilder) {
    this.roleSetupForm = this._fb.group({
      module: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required])
    });
  }

  ngOnInit () {
    this.getAllMenus();
    this.getAllRoles();
  }

  getAllMenus () {
    this.httpService.getAll('UrlDetails.$getAllModulesByClientIdUrl')// TODO Nikola
        .subscribe(response => {
          let tmpMenus = [];
          response.forEach((item: any) => {
            if (item.active === 'Y') {
              tmpMenus.push(item);
            }
          });
          this.modules = tmpMenus;
        });
  }

  getAllRoles () {
    this.httpService.getAll('UrlDetails.$getRolesUrl')// TODO Nikola
        .subscribe(response => {
          let tmpRole = [];
          response.forEach((item: any) => {
            if (item.active === 'Y') {
              tmpRole.push(item);
            }
          });
          this.roles = tmpRole;
        });
  }

  loadMenus ({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.role = value.role;
      this.module = value.module;
      this.getMenus();
    }
  }

  getMenus () {
    this.httpService.getAll('UrlDetails.$getMenuByRoleIdAndModuleIdURL' + this.role + '/' + this.module)// TODO Nikola
      .subscribe(response => {
        this.allMenus = response;
        this.getLevel1Menus();
      });
  }

  getLevel1Menus () {
    let menus = [];
    this.allMenus.forEach((item: any) => {
      if (item.parentMenuId === 0 || item.parentMenuId === '' || item.parentMenuId === null) {
        menus.push(item);
      }
    });
    this.getLevel2Menus(menus);
    this.setupData = menus;
  }

  getLevel2Menus (level1Menus: Array<any>) {
    let menus = [];
    level1Menus.forEach((item: any) => {
      item.submenus = [];
      this.allMenus.forEach((tmpMenu: any) => {
        if (item.menuId === tmpMenu.parentMenuId) {
          item.submenus.push(tmpMenu);
          this.getLevel3Menus(tmpMenu);
        }
      });
    });
    return menus;
  }

  getLevel3Menus (subMenu: any) {
    subMenu.features = [];
    this.allMenus.forEach((tmpMenu: any) => {
      if (subMenu.menuId === tmpMenu.parentMenuId) {
        subMenu.features.push(tmpMenu);
      }
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.roleSetupForm.controls['module'].markAsTouched();
      this.roleSetupForm.controls['role'].markAsTouched();
    }
  }

  onSetupSelect (data: any) {
    this.selectedSetupName = data.menuName;
    this.subMenus = data.submenus;
    this.features = [];
    this.permissions = [];
  }

  onSubMenuSelect (subMenu: any) {
    this.selectedSubMenuName = subMenu.menuName;
    this.features = subMenu.features;
  }

  onFeaturesSelect (feature: any) {
    this.selectedFeatureName = feature.menuName;
    this.permissions = feature.permissions;
  }

  assignMenu (event, menu) {
    let url = '';
    if (event.checked) {
      url = 'UrlDetails.$assignMenuToRoleUrl';// TODO Nikola
      menu.isPresent = true;
      menu.roleMenuId = null;
      menu.roleId = this.role;
    } else {
      url = 'UrlDetails.$unAssignMenuToRoleUrl';// TODO Nikola
      menu.isPresent = false;
    }
    delete menu.submenus;
    this.httpService.save(url, [menu])
          .subscribe(response => {
            this._toastCtrl.success('Updated Successfully !');
            this.getMenus();
          }, (error) => {
            this._toastCtrl.error('Something went wrong');
            console.log(error);
          });
  }
}
