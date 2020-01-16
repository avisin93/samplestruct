import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { AddEditExelaProductMenuComponent } from './add-edit-exela-product-menu/add-edit-exela-product-menu.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-product-menu-setup-tab',
  templateUrl: './exela-product-menu-setup.component.html',
  styleUrls: ['./exela-product-menu-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaProductMenuSetupComponent implements OnInit {

  selectedRootMenu: any;
  selectedSubMenu: any;
  selectedFeature: any;

  selectedSetupName: any;
  selectedSetupId: any;
  selectedSetupDateCreated: any;

  selectedSubMenuName: any;
  selectedSubMenuId: any;
  selectedSubMenuDateCreated: any;

  selectedFeatureName: any;
  selectedFeatureId: any;
  selectedFeatureDateCreated: any;

  isModified: boolean = false;
  featuresPannel: boolean = true;

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
        private _fb: FormBuilder,
        public dialog: MatDialog) {
    this.menuSetupForm = this._fb.group({
      role: new FormControl('', [Validators.required])
    });
  }

  ngOnInit () {
    this.loadProductMenuById();
  }

  loadProductMenuById () {
    this.httpService.get(UrlDetails.$exela_getProductMenuUrl + '/' + this.productId, {}).subscribe((response) => {
      response.forEach((item) => {
        item.type = 'menu';
        item.submenus.forEach((submenu) => {
          let subsubmenu = submenu.submenus;
          submenu.type = 'submenu';
          delete submenu.submenus;
          submenu.features = subsubmenu;
        });
      });
      this.setupData = response;
    }, () => {
      console.log('exception while loading client by id');
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    if (this.isModified) {
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
        this._toastCtrl.success('Menu has been saved Successfully');
        let base = SessionService.get('base-role');
        this._router.navigate(['/' + base + '/exela-product-setup']);
      });

    } else {
      this._toastCtrl.error('Please add at least one menu to assign');
    }
  }

  subMenusPannel: boolean = false;
  onSetupSelect (data: any) {
    this.selectedRootMenu = data;
    this.selectedSetupName = data.name;
    this.selectedSetupId = data._id;
    this.selectedSetupDateCreated = data.createdon;
    this.subMenus = data.submenus;
    this.features = [];
    if (data['_id'] === undefined) {
      data['submenus'].forEach((submenu, index) => {
        if (submenu.active === true) {
          this.subMenusPannel = true;
          return;
        }
      });
    } else {
      for (let item of this.setupData) {
        if (item._id === data['_id']) {
          for (let submenu of item.submenus) {
            if (submenu.active === true) {
              this.subMenusPannel = true;
              break;
            } else {
              this.subMenusPannel = false;
            }
          }
        }
      }

    }

  }

  onSubMenuSelect (subMenu: any) {
    this.selectedSubMenu = subMenu;
    this.selectedSubMenuName = subMenu.name;
    this.selectedSubMenuId = subMenu._id;
    this.selectedSubMenuDateCreated = subMenu.createdon;
    this.features = subMenu.features;

    if (subMenu['_id'] === undefined) {
      subMenu['features'].forEach((feature, index) => {
        if (feature.active === true) {
          this.featuresPannel = true;
          return;
        }
      });
    } else {
      for (let item of this.setupData) {
        for (let submenu of item.submenus) {
          if (submenu._id === subMenu['_id']) {
            for (let feature of submenu.features) {
              if (feature.active === true) {
                this.featuresPannel = true;
                break;
              } else {
                this.featuresPannel = false;
              }
            }
          }
        }
      }
    }
  }

  onFeaturesSelect (feature: any) {
    this.selectedFeature = feature;
    this.selectedFeatureName = feature.name;
    this.selectedFeatureId = feature._id;
    this.selectedFeatureDateCreated = feature.createdon;
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }
  onDeleteMenu (data: {}) {
    this.isModified = true;
    data['active'] = false;

    if (data['_id'] === undefined) {

      if (data['features'] !== undefined && data['features'].length > 0) {
        data['features'].forEach((element, index) => {
          element['active'] = false;
        });

        this.featuresPannel = false;
        for (let submenu of this.selectedRootMenu['submenus']) {
          if (submenu.active === true) {
            this.subMenusPannel = true;
            break;
          } else {
            this.subMenusPannel = false;
          }
        }
      } else if (data['submenus'] !== undefined && data['submenus'].length > 0) {
        data['submenus'].forEach((element, index) => {
          element['active'] = false;
        });
        this.featuresPannel = false;
        this.subMenusPannel = false;
      } else {
        if (!('submenus' in data) && !('features' in data)) {
          for (let feature of this.selectedSubMenu['features']) {
            if (feature.active === true) {
              this.featuresPannel = true;
              break;
            } else {
              this.featuresPannel = false;
            }
          }
        } else {
          for (let submenu of this.selectedRootMenu['submenus']) {
            if (submenu.active === true) {
              this.subMenusPannel = true;
              break;
            } else {
              this.subMenusPannel = false;
            }
          }
        }

      }
    } else if (data['type'] === 'menu') {
      this.setupData.forEach((item,index) => {
        if (item._id === data['_id']) {
          item.submenus.forEach((submenu) => {
            submenu.active = false;
          });
        }
      });
      this.featuresPannel = false;
      this.subMenusPannel = false;
    } else if (data['type'] === 'submenu') {
      this.setupData.forEach((item) => {
        item.submenus.forEach((submenu) => {
          if (submenu._id === data['_id']) {
            submenu.features.forEach((feature) => {
              feature.active = false;
            });
          }
        });
      });
      for (let item of this.setupData) {
        for (let submenu of item.submenus) {
          if (submenu.active === true) {
            if (data['_id'] === submenu._id) {
              this.subMenusPannel = true;
              break;
            }
          } else {
            this.subMenusPannel = false;
          }
        }
      }
      this.featuresPannel = false;
    } else {
      for (let item of this.setupData) {
        for (let submenu of item.submenus) {
          for (let feature of submenu.features) {
            if (feature.active === true) {
              this.featuresPannel = true;
              break;
            } else {
              this.featuresPannel = false;
            }
          }
        }
      }
    }
  }

  addProductMenuPopup (level: string) {
    let addMenuDialogRef = this.dialog.open(AddEditExelaProductMenuComponent, this.dialogOptions);
    addMenuDialogRef.componentInstance.heading = 'Add Menu';
    addMenuDialogRef.componentInstance.saveBtnTitle = 'Add';
    addMenuDialogRef.componentInstance.mode = 'add';
    addMenuDialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        result.createdon = new Date();
        if (level === 'level1') {
          result['submenus'] = [];
          this.setupData.push(result);
        } else if (level === 'level1_submenu') {
          result['features'] = [];
          if (this.selectedRootMenu !== undefined) {
            this.selectedRootMenu.submenus.push(result);
            this.subMenusPannel = true;
          } else {
            this._toastCtrl.error('Select menu to add submenu');
          }
        } else if (level === 'level2') {
          result['features'] = [];
          this.selectedRootMenu.submenus.push(result);
        } else if (level === 'level2_submenu') {
          if (this.selectedSubMenu !== undefined) {
            this.selectedSubMenu.features.push(result);
            this.featuresPannel = true;
          } else {
            this._toastCtrl.error('Select submenu to add child');
          }
        } else if (level === 'level3') {
          this.selectedSubMenu.features.push(result);
        }
        this.isModified = true;
      }
    });
  }
  editProductMenuPopup (record: any, level: string) {
    let editMenuDialogRef = this.dialog.open(AddEditExelaProductMenuComponent, this.dialogOptions);
    editMenuDialogRef.componentInstance.heading = 'Edit Menu';
    editMenuDialogRef.componentInstance.saveBtnTitle = 'Save';
    editMenuDialogRef.componentInstance.mode = 'edit';
    editMenuDialogRef.componentInstance.setEditFormValues({
      name: record.name,
      url: record.url,
      link: record.link,
      icon: record.icon,
      key: record.key,
      sequence: record.sequence,
      isactive: record.isactive
    });
    editMenuDialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        record.name = result.name;
        record.url = result.url;
        record.link = result.link;
        record.icon = result.icon;
        record.key = result.key;
        record.sequence = result.sequence;
        record.isactive = result.isactive;
        this.isModified = true;
      }
    });
  }

}
