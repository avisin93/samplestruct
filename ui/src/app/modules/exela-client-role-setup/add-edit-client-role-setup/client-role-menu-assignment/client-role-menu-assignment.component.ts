import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';

import { SessionService } from '../../../shared/providers/session.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-role-menu-assignment-tab',
  templateUrl: './client-role-menu-assignment.component.html',
  styleUrls: ['./client-role-menu-assignment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientRoleMenuAssignmentTabComponent implements OnInit {

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  @Input('roleId') roleId: string = '';

  featureSetupForm: FormGroup;

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

  selectedSetupName: string = '';

  selectedSetupId: any;

  selectedSubMenuName: string = '';

  selectedSubMenuId: any;

  selectedFeatureName: string = '';

  selectedFeatureId: any;

  subMenus: Array<any> = [];

  features: Array<any> = [];

  constructor (private _router: Router,
        private route: ActivatedRoute,
        public _toastCtrl: ToastrService,
        private httpService: HttpService,
        private _fb: FormBuilder) {
    this.featureSetupForm = this._fb.group({
      role: new FormControl('', [Validators.required])
    });
  }

  ngOnInit () {
    console.log(this.mode);
    this.getSelectedMenusFromRole();

  }

  getSelectedMenusFromRole () {
    let reqParam = {
      'roleId': this.roleId
    };
    this.httpService.get(UrlDetails.$exelaGetSelectedMenusFromRoleUrl, reqParam).subscribe((response) => {
      this.getAllMenusForClient(response);
    }, (error) => {
      console.log(error);
      console.log('exception while loading client by id');
    });
  }

  getAllMenusForClient (selectedMenus) {
    let reqParam = {
      'roleId': this.roleId
    };
    this.httpService.get(UrlDetails.$exelaGetClientAssignedMenusUrl, reqParam).subscribe((response) => {
      response.forEach((item) => {
        item.submenus.forEach((submenu) => {
          let subsubmenu = submenu.submenus;
          delete submenu.submenus;
          submenu.features = subsubmenu;
        });
      });
      this.setupData = response;
      this.setMenuSelection(selectedMenus);
    }, (error) => {
      console.log(error);
      console.log('exception while loading client by id');
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    let tempSetupData = this.truncateNotSelectedMenus();
    tempSetupData.forEach((item) => {
      item.submenus.forEach((submenu) => {
        let subsubmenu = submenu.features;
        delete submenu.features;
        submenu.submenus = subsubmenu;
      });
    });
    let req = {
      id: this.roleId,
      menus: tempSetupData
    };
    this.httpService.save(UrlDetails.$exelaAssignMenusToRoleUrl, req).subscribe(response => {
      this._toastCtrl.success('Menus has been added Successfully');
    });
  }

  onSetupSelect (data: any) {
    console.log(data);
    this.selectedSetupName = data.name;
    this.selectedSetupId = data._id;
    this.subMenus = data.submenus;
    this.features = [];
  }

  onSubMenuSelect (subMenu: any) {
    this.selectedSubMenuName = subMenu.name;
    this.selectedSubMenuId = subMenu._id;
    this.features = subMenu.features;
  }

  onFeaturesSelect (feature: any) {
    this.selectedFeatureName = feature.name;
    this.selectedFeatureId = feature._id;
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
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

}
