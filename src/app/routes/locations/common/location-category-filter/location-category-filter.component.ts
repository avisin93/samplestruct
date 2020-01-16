import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
const swal = require('sweetalert');
declare var $: any;
import * as _ from 'lodash';
import { TriggerService } from '@app/common/services/trigger.service';
import { LocationCategoryFilterService } from './location-category-filter.service';
import { ManageCategorydata } from './location-category-filter.data.model';
import { CATEGORY_TYPE_CONST, EVENT_TYPES } from '@app/config/constants';
import { Common } from '@app/common/common';


@Component({
  selector: 'app-location-category-filter',
  templateUrl: './location-category-filter.component.html',
  styleUrls: ['./location-category-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [LocationCategoryFilterService]
})
export class LocationCategoryFilterComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  list: any[] = [];
  addFlag: Boolean = false;
  EditFlag: Boolean = false;
  categoryForm: FormGroup;
  showLoadingFlg: Boolean = false;
  EVENT_TYPES = EVENT_TYPES;
  catLocationName: any;
  CATEGORY_TYPE_CONST = CATEGORY_TYPE_CONST;
  @ViewChild('addModal') public addModal: ModalDirective;
  leafNodesArr: any[];
  categorysList: any;
  categoryList: any[];
  categoryListFlag: boolean;
  folderData = [];
  dataLists = [];
  keyList = [];
  nextArray = [];
  acitveChildIdsArr = [];
  CATEGORY_LIST_PARAMS: any = {
    'includeLocation': 'includeLocation',
    'parentId': 'parentId'
  };
  breadcrumbData: any = {
    title: 'common.labels.categorylist',
    subTitle: 'actors.freelancers.labels.categorySubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'common.labels.categorylist',
      link: ''
    }
    ]
  };
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(private locationCategoryFilterService: LocationCategoryFilterService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private triggerService: TriggerService) { }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/

  ngOnInit() {
    // this.setInitialDataList();
    if (this.dataLists.length === 0) {
      this.getInitialCategoryList();
    }
    this.hideAllRefreshIcons();
  }
  /*all life cycle events whichever required after inicialization of constructor*/


  /*method to initially get root level category list*/
  getInitialCategoryList() {
    this.showLoadingFlg = true;
    this.locationCategoryFilterService.getInitialCategoryList().subscribe((responseData: any) => {
      if (Common.checkStatusCode(responseData.header.statusCode)) {
        if (responseData.payload.results) {
          this.categoryListFlag = true;
          const categories = responseData.payload.results;
          const categoriesData = ManageCategorydata.getCategoryListDetails(categories, '');
          this.setInitialDataList(categoriesData);
          this.showLoadingFlg = false;
          this.hideAllRefreshIcons();
        }
      }
    });
  }
  /*method to initially get root level category list*/

  /* method to hide spinners,refresh icons & folder icons as per functionality*/
  hideSpinnerIcon(receivedFolderData) {
    $('.spinner_' + receivedFolderData.id).removeClass('fa-spin');
    $('.spinner_' + receivedFolderData.id).hide();
    this.hideAllRefreshIcons();
    $('.folder_' + receivedFolderData.id).show();
  }
  hideAllRefreshIcons() {
    setTimeout(() => {
      $('.fa-refresh').hide();
    }, 0);
  }
  hideFolderIcon(receivedFolderData) {
    $('.folder_' + receivedFolderData.id).hide();
    $('.spinner_' + receivedFolderData.id).show();
    $('.spinner_' + receivedFolderData.id).addClass('fa-spin');
  }
  /* method to hide spinners,refresh icons & folder icons as per functionality*/

  /*method to initially set root level category list*/
  setInitialDataList(categoriesData) {
    if (this.dataLists.length === 0) {
      const constList = [];
      for (let i = 0; i < categoriesData.length; i++) {
        // const tempDataArr = categoriesData[i];
        // tempDataArr['parentCategoryName'] = 'root';
        // constList.push(categoriesData[i]);
        // constList[i]['fullPath'] = categoriesData[i].name;
        // this.keyList[categoriesData[i].id] = [];
        categoriesData[i]['parentCategoryName'] = 'root';
        categoriesData[i]['fullPath'] = categoriesData[i].name;
        constList.push(categoriesData[i]);
        this.keyList[categoriesData[i].id] = [];
      }
      this.dataLists.push([constList]);
    }
  }
  /*method to initially set root level category list*/

  /*method to set an event*/
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /*method to set an event*/

  /*method to trigger an event to notify parent component and send leaf nodes of category*/
  setCategory() {
    this.calculateLeafNodeArray();
    this.setEventType({
      type: EVENT_TYPES.closeModal, prevValue: {},
      currentValue: this.leafNodesArr, dataLists: this.dataLists, keyList: Object.assign([], this.keyList)
    });
    this.bsModalRef.hide();
  }
  /*method to trigger an event to notify parent component and send leaf nodes of category*/

  /* method to close category model*/
  closeModal() {
    this.bsModalRef.content.dataLists = [];
    this.bsModalRef.hide();
  }
  /* method to close category model*/

  /* method to calculate chain of parent ID's of a selected category*/
  getAllChainedIds(receivedFolderData, rootIndex) {
    let FolderData = JSON.parse(JSON.stringify(receivedFolderData));
    const chainedIdsArray = [];
    chainedIdsArray.push(FolderData.id);
    for (let baseIndex = rootIndex; baseIndex > 0; baseIndex--) {
      if (FolderData.parentId !== '') {
        chainedIdsArray.push(FolderData.parentId);
        let categoryFoundFlag = false;
        for (let index = 0; index < this.dataLists.length; index++) {
          if (!categoryFoundFlag) {
            for (let subIndex = 0; subIndex < this.dataLists[index].length; subIndex++) {
              if (!categoryFoundFlag) {
                for (let subSubIndex = this.dataLists[index][subIndex].length - 1; subSubIndex >= 0; subSubIndex--) {
                  if (this.dataLists[index][subIndex][subSubIndex].id === FolderData.parentId) {
                    categoryFoundFlag = true;
                    FolderData = Object.assign([], this.dataLists[index][subIndex][subSubIndex]);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
    return chainedIdsArray;
  }
  /* method to calculate chain of parent ID's of a selected category*/

  /* method to calculate keys of category ID's of a selected category*/
  getKeyListsOfSelectedCategory(chainedIdsArray) {
    let requiredKeyList = this.keyList;
    for (let tempIndex = chainedIdsArray.length - 1; tempIndex >= 0; tempIndex--) {
      requiredKeyList = requiredKeyList[chainedIdsArray[tempIndex]];
    }
    return requiredKeyList;
  }
  /* method to calculate keys of category ID's of a selected category*/

  /* method triggered after selection of any category in the list*/
  OnCategoryClick(receivedFolderData, currentIndex, currentList, parentIndex, parentList, rootIndex, rootList, firstRecord) {

    // this part gets the ID's of current node and its all parent nodes in tempIdsArray
    // which is further used to update the main list to update main dataList.
    const chainedIdsArray = this.getAllChainedIds(receivedFolderData, rootIndex);
    const KeyListsOfSelectedCategory = this.getKeyListsOfSelectedCategory(chainedIdsArray);
    if (!receivedFolderData.active) {
      receivedFolderData['active'] = true;
      if (receivedFolderData.hasChildren) {
        this.hideFolderIcon(receivedFolderData);
        let params: HttpParams = new HttpParams();
        if (receivedFolderData.id) {
          params = params.append(this.CATEGORY_LIST_PARAMS.parentId, receivedFolderData.id);
          $('.folder-icon').addClass('ptr-disabled');
        }
        this.locationCategoryFilterService.getCategoryList(params).subscribe((responseData: any) => {
          if (Common.checkStatusCode(responseData.header.statusCode)) {
            if (responseData.payload.results) {
              this.categoryListFlag = true;
              const categories = responseData.payload.results;
              const categoriesData = ManageCategorydata.getCategoryListDetails(categories, receivedFolderData);
              const constIdList = _.map(categoriesData, 'id');
              // below loop is to push blank arrays in keyList
              for (let tempConstIndex = 0; tempConstIndex < constIdList.length; tempConstIndex++) {
                KeyListsOfSelectedCategory[constIdList[tempConstIndex]] = [];
              }
              if (categoriesData.length !== 0) {
                if (this.dataLists[rootIndex + 1]) {
                  this.dataLists[rootIndex + 1].push(categoriesData);
                } else {
                  this.dataLists.push([categoriesData]);
                }
              }
              this.setRemoveLeafNode(receivedFolderData, currentList, true);
              this.hideSpinnerIcon(receivedFolderData);
              this.openColapsePannel(rootIndex, parentIndex);
            }
          }
        });
      } else {
        this.setRemoveLeafNode(receivedFolderData, currentList, true);
        this.hideSpinnerIcon(receivedFolderData);
        this.openColapsePannel(rootIndex, parentIndex);
      }
    } else {
      delete receivedFolderData['active'];
      let removalArr = Object.assign([], this.keyList);
      for (let removalIndex1 = chainedIdsArray.length - 1; removalIndex1 >= 0; removalIndex1--) {
        removalArr = removalArr[chainedIdsArray[removalIndex1]];
      }
      this.removeEntriesFromMainList(removalArr);
      this.removeBlankArrays();
      this.setRemoveLeafNode(receivedFolderData, currentList, false);
      this.hideAllRefreshIcons();
      this.hideSpinnerIcon(receivedFolderData);
      this.openColapsePannel(rootIndex, parentIndex);
    }
  }
  /* method triggered after selection of any category in the list*/

  /* It removes bank arrays from main dataLists*/
  removeBlankArrays() {
    for (let index = this.dataLists.length - 1; index >= 0; index--) {
      if (this.dataLists[index].length === 0) {
        this.dataLists.splice(index, 1);
      }
    }
  }
  /* It removes bank arrays from main dataLists*/

  /* method to set or remove leaf nodes from main list*/
  setRemoveLeafNode(receivedFolderData, currentList, isActive) {
    if (isActive) {
      receivedFolderData['leafNode'] = true;
      for (let index = 0; index < this.dataLists.length; index++) {
        for (let subIndex = 0; subIndex < this.dataLists[index].length; subIndex++) {
          for (let subSubIndex = this.dataLists[index][subIndex].length - 1; subSubIndex >= 0; subSubIndex--) {
            if (this.dataLists[index][subIndex][subSubIndex].name === receivedFolderData.parentCategoryName) {
              delete this.dataLists[index][subIndex][subSubIndex]['leafNode'];
            }
          }
        }
      }
    } else {
      const currentActiveList = _.filter(currentList, 'active');
      if (currentActiveList.length === 0) {
        for (let index = 0; index < this.dataLists.length; index++) {
          for (let subIndex = 0; subIndex < this.dataLists[index].length; subIndex++) {
            for (let subSubIndex = this.dataLists[index][subIndex].length - 1; subSubIndex >= 0; subSubIndex--) {
              if (this.dataLists[index][subIndex][subSubIndex].name === receivedFolderData.parentCategoryName) {
                this.dataLists[index][subIndex][subSubIndex]['leafNode'] = true;
              }
            }
          }
        }
      }
      delete receivedFolderData['leafNode'];
    }
  }
  /* method to set or remove leaf nodes from main list*/

  /* method to open and close the last list if only one or two lists are present*/
  openColapsePannel(rootIndex, parentIndex) {
    for (let index22 = rootIndex; index22 < this.dataLists.length; index22++) {
      if (this.dataLists[index22] && this.dataLists[index22].length === 1) {
        // tslint:disable-next-line:max-line-length
        $('#acc-group_' + this.dataLists[index22][0][0]['parentId']).parents('.panel-collapse.collapse').addClass('in show');
        // tslint:disable-next-line:max-line-length
        $('#acc-group_' + this.dataLists[index22][0][0]['parentId']).parents('.panel-collapse.collapse').css('display', 'block');
      } else if (this.dataLists[index22] && this.dataLists[index22].length === 2) {
        // tslint:disable-next-line:max-line-length
        $('#acc-group_' + this.dataLists[index22][0][0]['parentId']).parents('.panel-collapse.collapse').removeClass('in show');
        // tslint:disable-next-line:max-line-length
        $('#acc-group_' + this.dataLists[index22][0][0]['parentId']).parents('.panel-collapse.collapse').css('display', 'none');
      }
    }
  }
  /* method to open and close the last list if only one or two lists are present*/

  /* method to remove selected category and its subCategories from the main list*/
  removeEntriesFromMainList(removalArr) {
    if (removalArr) {
      const nextRemovalArray = Object.keys(removalArr);
      for (let index4 = nextRemovalArray.length - 1; index4 >= 0; index4--) {
        for (let index = 0; index < this.dataLists.length; index++) {
          for (let subIndex = this.dataLists[index].length - 1; subIndex >= 0; subIndex--) {
            for (let subSubIndex = this.dataLists[index][subIndex].length - 1; subSubIndex >= 0; subSubIndex--) {
              if (this.dataLists[index][subIndex][subSubIndex].id === nextRemovalArray[index4]) {
                if (this.dataLists[index][subIndex][subSubIndex].active) {
                  delete this.dataLists[index][subIndex][subSubIndex]['active'];
                  delete this.dataLists[index][subIndex][subSubIndex]['leafNode'];
                }
                this.dataLists[index][subIndex].splice(subSubIndex, 1);
                if (this.dataLists[index][subIndex].length === 0) {
                  this.dataLists[index].splice(subIndex, 1);
                }
              }
            }
          }
        }
        if (!Common.isEmptyObject(removalArr[nextRemovalArray[index4]])) {
          this.removeEntriesFromMainList(removalArr[nextRemovalArray[index4]]);
        }
      }
    }
  }
  /* method to remove selected category and its subCategories from the main list*/

  /* method to sort all the leafNodses from mainDataLists ie: lraf Categories*/
  calculateLeafNodeArray() {
    this.leafNodesArr = [];
    for (let index = 0; index < this.dataLists.length; index++) {
      for (let subIndex = 0; subIndex < this.dataLists[index].length; subIndex++) {
        for (let subSubIndex = this.dataLists[index][subIndex].length - 1; subSubIndex >= 0; subSubIndex--) {
          if (this.dataLists[index][subIndex][subSubIndex].leafNode) {
            this.leafNodesArr.push(this.dataLists[index][subIndex][subSubIndex]);
          }
        }
      }
    }
  }
}
/* method to sort all the leafNodses from mainDataLists ie: lraf Categories*/
