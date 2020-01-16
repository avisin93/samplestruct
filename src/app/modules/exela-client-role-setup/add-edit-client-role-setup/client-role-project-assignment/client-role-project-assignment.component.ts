import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckboxChange, MatSelectChange } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { StorageService } from '../../../shared/providers/storage.service';

@Component({
  selector: 'app-client-role-project-assignment-tab',
  templateUrl: './client-role-project-assignment.component.html',
  styleUrls: ['./client-role-project-assignment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientRoleProjectAssignmentTabComponent implements OnInit {

  @Input('organizationId') organizationId = '';

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  @Input('roleId') roleId: string = '';

  role: any = '';

  clientMenuSetupForm: FormGroup;

  projects: Array<any> = [];

  setupData: Array<any> = [];

  selectedSetupName: string = '';

  selectedSubMenuName: string = '';

  selectedFeatureName: string = '';

  subMenus: Array<any> = [];

  features: Array<any> = [];

  productId: string;

  constructor (private _router: Router,
        public _toastCtrl: ToastrService,
        private httpService: HttpService,
        private route: ActivatedRoute,
        private _fb: FormBuilder,
        private activatedRoute: ActivatedRoute) {
    this.clientMenuSetupForm = this._fb.group({
      project: new FormControl('', [Validators.required])
    });
  }

  ngOnInit () {
    this.activatedRoute.params.subscribe(params => {
      this.organizationId = params.organizationId;
      this.getAllProjects();
    });

    this.getRole();
  }

  getRole () {
    this.httpService.get(UrlDetails.$exelaGetRoleUrl + '/' + this.roleId, {}).subscribe(response => {
      this.role = response;
    }, (error) => {
      console.log(error);
    });
  }

  getAllProjects () {
        // this.organizationId = StorageService.get(StorageService.organizationId);
    let reqData = {
      organizationId: this.organizationId
    };
    this.httpService.get(UrlDetails.$exela_getAllProjectsUrl, reqData).subscribe(response => {
      response.forEach((item) => {
        this.projects.push({
          value: JSON.stringify(item),
          text: item.name
        });
      });
    }, (error) => {
      console.log(error);
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    let project = JSON.parse(value.project);
    let selectedQueues = [];
    this.setupData.forEach((q) => {
      if (q.selected) {
        selectedQueues.push(q);
      }
    });
    let reqData = {
      roleId: this.roleId,
      projectId: project._id,
      projectName: project.name,
      projectCode: project.code,
      queues: selectedQueues
    };
    this.httpService.save(UrlDetails.$exelaAddOrUpdateProjectQueueAccessUrl, reqData).subscribe(response => {
      this._toastCtrl.success('Project queue access updated Successfully');
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

  onSetupSelect (data: any) {
    console.log(data);
    this.selectedSetupName = data.name;
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
    this.selectedSubMenuName = subMenu.name;
    this.features = subMenu.features;
  }

  onFeaturesSelect (feature: any) {
    this.selectedFeatureName = feature.name;
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }

  onProjectChange (event: MatSelectChange) {
    this.resetMenuTree();
    let selectedPrj = JSON.parse(event.value);
    let rolePrj = this.role.projects.find((prj) => {
      return prj._id === selectedPrj._id;
    });
    if (rolePrj) {
      rolePrj.queues.forEach((item) => {
        selectedPrj.queues.forEach((q) => {
          if (item._id === q._id) {
            q.selected = true;
          }
        });
      });
    }
    let tmpQ = [];
    selectedPrj.queues.forEach(item => {
      if (item.active) {
        tmpQ.push(item);
      }
    });
    this.setupData = tmpQ;// selectedPrj.queues;
  }

  resetMenuTree () {
    this.setupData = [];
    this.selectedSetupName = '';
    this.selectedSubMenuName = '';
    this.selectedFeatureName = '';
    this.subMenus = [];
    this.features = [];
  }

  getAllMenusForProduct (selectedMenus) {
    this.httpService.get(UrlDetails.$exela_getProductMenuUrl + '/' + this.productId, {}).subscribe((response) => {
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

  getMenusForProduct () {
    this.httpService.get(UrlDetails.$exela_getMenuByClientIdAndProductIdUrl + '/' + this.organizationId + '/' + this.productId, {}).subscribe(response => {
      this.getAllMenusForProduct(response);
    }, (error) => {
      console.log(error);
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
