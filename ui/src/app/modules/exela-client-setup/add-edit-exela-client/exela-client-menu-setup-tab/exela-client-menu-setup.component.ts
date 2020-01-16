import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckboxChange, MatSelectChange } from '@angular/material';

import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-client-setup-menu-tab',
  templateUrl: './exela-client-menu-setup.component.html',
  styleUrls: ['./exela-client-menu-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaClientMenuTabComponent implements OnInit {

  @Input('organizationId') organizationId = '';

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  clientMenuSetupForm: FormGroup;

  products: Array<any> = [];

  setupData: Array<any> = [];

  selectedSetupName: string = '';

  selectedSetupId: any;

  selectedSubMenuName: string = '';

  selectedSubMenuId: any;

  selectedFeatureName: string = '';

  selectedFeatureId: any;

  subMenus: Array<any> = [];

  features: Array<any> = [];

  productId: string;

  constructor (private _router: Router,
        public _toastCtrl: ToastrService,
        private httpService: HttpService,
        private route: ActivatedRoute,
        private _fb: FormBuilder) {
    this.clientMenuSetupForm = this._fb.group({
      product: new FormControl('', [Validators.required])
    });
  }

  ngOnInit () {
    console.log(this.mode);
    this.getAssignedProduct();
  }

  getAssignedProduct () {
    this.httpService.get(UrlDetails.$exela_getClientProductUrl + '/' + this.organizationId, {}).subscribe(response => {
      response.forEach((item) => {
        this.products.push({
          value: item._id,
          text: item.productname
        });
      });
    }, () => {
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    let tempSetupData = this.truncateNotSelectedMenus();
    if (tempSetupData.length > 0) {
      tempSetupData.forEach((item) => {
        item.submenus.forEach((submenu) => {
          let subsubmenu = submenu.features;
          delete submenu.features;
          submenu.submenus = subsubmenu;
        });
      });
      let req = {
        id: this.organizationId,
        productid: this.productId,
        menus: tempSetupData
      };
      this.httpService.save(UrlDetails.$exela_addMenuToProductUrl, req).subscribe(response => {
        this._toastCtrl.success('Menus has been added Successfully');
      });

    } else {

      this._toastCtrl.error('Please add at least one menu to assign');
    }
  }

  truncateNotSelectedMenus () {
    let tempSetupData = [];
    this.setupData.forEach((item) => {
      if (item.selected) {
        tempSetupData.push(item);
      }
    });
    tempSetupData.forEach((mainMenu) => {
      let tmpSubMenus = [];
      mainMenu.submenus.forEach((subMenu) => {
        if (subMenu.selected) {
          tmpSubMenus.push(subMenu);
        }
      });

      tmpSubMenus.forEach((subsubMenu) => {
        let tmpSubSubMenu = [];
        subsubMenu.features.forEach((subsubMenu) => {
          if (subsubMenu.selected) {
            tmpSubSubMenu.push(subsubMenu);
          }
        });
        subsubMenu.features = tmpSubSubMenu;
      });
      mainMenu.submenus = tmpSubMenus;
    });
    return tempSetupData;
  }

  onSetupSelect (data: any) {
    console.log(data);
    this.selectedSetupName = data.link;
    this.selectedSetupId = data._id;
    this.subMenus = data.submenus;
    this.features = [];
  }

  menuChange (event: MatCheckboxChange, data: any) {
    data.selected = event.checked;
    this.selectOrDeselectSubMenus(data, event.checked);
  }

  selectOrDeselectSubMenus (data, isSelected) {
    if (data.submenus) {
      data.submenus.forEach((item) => {
        item.selected = isSelected;
        this.selectOrDeselectSubMenus(item, isSelected);
      });
    } else if (data.features) {
      data.features.forEach((item) => {
        item.selected = isSelected;
      });
    }
  }

  onSubMenuSelect (subMenu: any) {
    this.selectedSubMenuName = subMenu.link;
    this.selectedSubMenuId = subMenu._id;
    this.features = subMenu.features;
  }

  onFeaturesSelect (feature: any) {
    this.selectedFeatureName = feature.link;
    this.selectedFeatureId = feature._id;
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }

  onProductChange (event: MatSelectChange) {
    this.resetMenuTree();
    this.productId = event.value;
    this.getMenusForProduct();
  }

  resetMenuTree () {
    this.setupData = [];
    this.selectedSetupName = '';
    this.selectedSetupId = '';
    this.selectedSubMenuName = '';
    this.selectedSubMenuId = '';
    this.selectedFeatureName = '';
    this.selectedFeatureId = '';
    this.subMenus = [];
    this.features = [];
  }

  getAllMenusForProduct (selectedMenus) {
    this.httpService.get(UrlDetails.$exela_getProductMenuUrl + '/' + this.productId,{}).subscribe((response) => {
      response.forEach((item) => {
        item.submenus.forEach((submenu) => {
          let subsubmenu = submenu.submenus;
          delete submenu.submenus;
          submenu.features = subsubmenu;
        });
      });
      this.setupData = response;
      this.setMenuSelection(selectedMenus);

    }, () => {
      console.log('exception while loading client by id');
    });
  }

  getMenusForProduct () {
    this.httpService.get(UrlDetails.$exela_getMenuByClientIdAndProductIdUrl + '/' + this.organizationId + '/' + this.productId, {}).subscribe(response => {
      this.getAllMenusForProduct(response);
    }, () => {
    });
  }

  setMenuSelection (selectedMenus) {
    this.setupData.forEach((item) => {
      selectedMenus.forEach((selectedItem) => {
        if (item._id === selectedItem._id) {
          item.selected = true;
          item.submenus.forEach((subItem) => {
            selectedItem.submenus.forEach((selectedSubItem) => {
              if (subItem._id === selectedSubItem._id) {
                subItem.selected = true;
                subItem.features.forEach((subsubItem) => {
                  selectedSubItem.submenus.forEach((selectedSubSubItem) => {
                    if (subsubItem._id === selectedSubSubItem._id) {
                      subsubItem.selected = true;
                    }
                  });
                });
              }
            });
          });
        }
      });
    });
  }

}
