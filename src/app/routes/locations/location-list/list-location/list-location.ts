import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators, Common } from '@app/common';
import { LOCATION_TYPES, ZIP_NAME_TYPES_ARR } from '@app/config';
import * as _ from 'lodash';
import { HttpParams } from '@angular/common/http';
import { ListLocationDataModel } from './list-location.data.model';

declare var $: any;

@Injectable()
export class ListLocation {
    zipDetails: any = {};
    zipLocationsObj: any = {};
    atLeastOneImageSelected: boolean = false;
    ZIP_NAME_TYPES_ARR = ZIP_NAME_TYPES_ARR;
    ZIP_NAME_TYPE: any = Common.keyValueDropdownArr(ZIP_NAME_TYPES_ARR, 'text', 'id');
    /**
    * constructor method is used to initialize members of class
    */
    constructor(private fb: FormBuilder
    ) { }
    /**
    * Start of Zip creation functionality
    */
    createZipDetailForm(): FormGroup {
        return this.fb.group({
            projectId: ['', [CustomValidators.required]],
            projectName: ['', [CustomValidators.required]],
            zipDiscription: ['', [CustomValidators.required]],
            zipNameType: [this.ZIP_NAME_TYPE.selectProject],
            erpProject: ['']
        });
    }
    /**
    * It adds/removes current image from/to collection of images in zipLocationsObj object
    * @param value as boolean for getting checkbox value
    * @param imageinfo as object of location & image details
    */
    selectImageForZip(value, imageinfo) {
        if (value && imageinfo) {
            if (!this.zipLocationsObj[imageinfo.locationId]) {
                this.zipLocationsObj[imageinfo.locationId] = {
                    "locationId": imageinfo.locationId,
                    "locationName": imageinfo.locationName,
                    "parentCategoryId": imageinfo.parentCategoryId,
                    "parentCategoryName": imageinfo.parentCategoryName,
                    "images": [{
                        "id": imageinfo.imageId,
                        "big": imageinfo.big,
                        "small": imageinfo.small,
                        "medium": imageinfo.medium,
                        "orientation": imageinfo.orientation,
                        "name": imageinfo.imageName
                    }]
                };
            } else {
                let tempObj = this.zipLocationsObj[imageinfo.locationId];
                if (tempObj && tempObj.images) {
                    tempObj.images.push({
                        "id": imageinfo.imageId,
                        "big": imageinfo.big,
                        "small": imageinfo.small,
                        "medium": imageinfo.medium,
                        "orientation": imageinfo.orientation,
                        "name": imageinfo.imageName
                    });
                }
            }
        } else {
            let tempObj = this.zipLocationsObj[imageinfo.locationId];
            if (tempObj && tempObj.images && tempObj.images.length > 0) {
                let index = _.findIndex(tempObj.images, { 'id': imageinfo.imageId });
                tempObj.images.splice(index, 1);
                if (tempObj.images.length == 0) {
                    delete this.zipLocationsObj[imageinfo.locationId];
                }
            }
        }
        this.checkZipLocationsObjEmpty();
    }
    /**
    * It checks current image is selcted for zip or not
    * @param compInstance as instance of component(this object)
    * @param imageinfo as object of location & image details
    */
    checkImageselectedForZipOrNot(compInstance, imageinfo) {
        if (imageinfo) {
            let tempObj = this.zipLocationsObj[imageinfo.locationId];
            if (tempObj && tempObj.images && tempObj.images.length > 0) {
                let imageObj = _.find(tempObj.images, { 'id': imageinfo.imageId });
                compInstance.imageSelectedForZip = imageObj ? true : false;
            } else {
                compInstance.imageSelectedForZip = false;
            }
        }
    }
    /**
    * It converts zip locations object into array for view selection modal
    */
    convertZipLocationsObjIntoArr() {
        let zipLocationProps = Object.keys(this.zipLocationsObj);
        this.zipDetails.locations = [];
        let tempArr = [];
        for (let prop of zipLocationProps) {
            tempArr.push(this.zipLocationsObj[prop]);
        }
        this.zipDetails.locations = _.sortBy(tempArr, ['locationName']);
    }
    /**
    * It checks at lease one image is selected for zip creation or not
    */
    checkZipLocationsObjEmpty() {
        this.atLeastOneImageSelected = Common.isEmptyObject(this.zipLocationsObj) ? false : true;
    }
    /**
    * It clears zip locations array & object
    */
    clearData() {
        this.zipLocationsObj = {};
        this.zipDetails.locations = [];
        this.atLeastOneImageSelected = false;
    }
    /**
    * It sets/clears projectId field's (of zipDetailsForm) validity 
    */
    checkValidity(compInstance) {
        const formvalue = compInstance.zipDetailsForm.value;
        if (formvalue.zipNameType === this.ZIP_NAME_TYPE.other) {
            compInstance.zipDetailsForm.controls['projectId'].clearValidators();
        } else {
            compInstance.zipDetailsForm.controls['projectId'].setValidators([CustomValidators.required]);
        }
        compInstance.zipDetailsForm.patchValue({
            'projectId': "",
            'projectName': "",
            'zipDiscription': "",
            'erpProject': false
        })

        compInstance.zipDetailsForm.markAsUntouched();
        compInstance.zipDetailsForm.controls['projectId'].updateValueAndValidity();
    }
    /**
    * It sets selcted project details
    */
    setProjectDetails(compInstance, value) {
        if (value && (typeof (value) === 'string')) {
            const formvalue = compInstance.zipDetailsForm.value;
            let selectedProjectData = _.find(compInstance.tempProjectsList, { 'id': formvalue.projectId });
            if (selectedProjectData) {
                compInstance.zipDetailsForm.patchValue({
                    'projectId': selectedProjectData.id,
                    'erpProject': selectedProjectData.erpProject,
                    'projectName': selectedProjectData.projectName
                });
            }
        }
    }
    /**
    * It sets zip details object required while creating zip
    */
    proccedToCreatezip(compInstance) {
        compInstance.submmitedFormFlag = true;
        if (compInstance.zipDetailsForm.valid) {
            compInstance.submmitedFormFlag = false;
            compInstance.createZipFlag = true;
            compInstance.breadcrumbData = compInstance.zipBreadcrumbData;
            const formvalue = compInstance.zipDetailsForm.value;
            this.zipDetails = {
                projectId: formvalue.projectId,
                projectName: formvalue.projectName,
                erpProject: formvalue.erpProject,
                description: formvalue.zipDiscription,
                locations: []
            }
            compInstance.zipModal.hide();
            compInstance.zipDetailsForm.reset();
            compInstance.zipDetailsForm.controls['zipNameType'].setValue(this.ZIP_NAME_TYPE.selectProject);
        }
    }

    /**
    * End of Zip creation functionality
    */
    ///////////////////////////////////////////////////////////////////////////////////////////

    /**
    * Start ofLocation listing functionality
    */
    createFilterForm(): FormGroup {
        return this.fb.group({
            locationName: [''],
            locationTags: [''],
            state: [''],
            city: [''],
            category: [''],
            locationType: ['']
        });
    }

    /**
    * It sets orientation to image opened in preview
    */
    setOrientationToImage(compInstance, data) {
        let imageData = data.image;
        if (imageData.big) {
            const img = new Image();
            img.src = imageData.big;
            img.onload = function () {
                $('.ngx-spinner-wrapper').hide();
            }
        }

        const self = compInstance;
        $('.ngx-gallery-preview-img').addClass('hidden');
        $('.ngx-spinner-wrapper').show();
        setTimeout(() => {
            $('.ngx-gallery-preview-img').removeClass('orientation-' + self.currentImageOrientation);
            self.currentImageOrientation = imageData.orientation;
            $('.ngx-gallery-preview-img').addClass('orientation-' + self.currentImageOrientation);
            setTimeout(() => {
                $('.ngx-gallery-preview-img').removeClass('hidden');
            }, 500);
        }, 500);
    }
    /**
    * It removes orientation of current image on preview close event of gallery
    */
    previewClose(compInstance) {
        setTimeout(() => {
            $(".ngx-gallery-preview-img").removeClass("orientation-" + compInstance.currentImageOrientation);
        }, 50);

    }
    /**
  * It removes category from the category object
  * @param categoryName name of category to be removed
  */
    removeCategoryFromDataLists(compInstance, categoryName) {
        let tempCategoryName = '';
        if (compInstance.removeAllChildFlag) {
            for (let index1 = compInstance.dataLists.length - 1; index1 >= 0; index1--) {
                for (let index2 = compInstance.dataLists[index1].length - 1; index2 >= 0; index2--) {
                    for (let index3 = compInstance.dataLists[index1][index2].length - 1; index3 >= 0; index3--) {
                        if (categoryName === compInstance.dataLists[index1][index2][index3]['parentCategoryName']) {
                            compInstance.dataLists[index1].splice([index2], 1);
                            compInstance.removeAllChildFlag = false;
                            break;
                        }
                    }
                    if (!compInstance.removeAllChildFlag) {
                        break;
                    }
                }
                if (!compInstance.removeAllChildFlag) {
                    break;
                }
            }
        }
        for (let index1 = compInstance.dataLists.length - 1; index1 >= 0; index1--) {
            if (compInstance.dataLists[index1]) {
                for (let index2 = compInstance.dataLists[index1].length - 1; index2 >= 0; index2--) {
                    if (compInstance.dataLists[index1][index2]) {
                        for (let index3 = compInstance.dataLists[index1][index2].length - 1; index3 >= 0; index3--) {
                            // tslint:disable-next-line:max-line-length
                            if (compInstance.dataLists[index1] && compInstance.dataLists[index1][index2] && compInstance.dataLists[index1][index2][index3] && compInstance.dataLists[index1][index2][index3].name === categoryName) {
                                if (compInstance.dataLists[index1][index2][index3].parentCategoryName !== 'root') {
                                    tempCategoryName = compInstance.dataLists[index1][index2][index3].parentCategoryName;
                                    delete compInstance.dataLists[index1][index2][index3]['leafNode'];
                                    delete compInstance.dataLists[index1][index2][index3]['active'];
                                    let activeNodes = 0;
                                    for (let index4 = compInstance.dataLists[index1][index2].length - 1; index4 >= 0; index4--) {
                                        if (compInstance.dataLists[index1][index2][index4].active) {
                                            activeNodes++;
                                        }
                                    }
                                    if ((activeNodes === 0 || compInstance.dataLists[index1][index2].length === 0) && tempCategoryName !== 'root') {
                                        compInstance.dataLists[index1].splice(index2, 1);
                                        this.removeCategoryFromDataLists(compInstance, tempCategoryName);
                                    }
                                } else {
                                    delete compInstance.dataLists[index1][index2][index3]['active'];
                                    delete compInstance.dataLists[index1][index2][index3]['leafNode'];
                                }
                            }
                        }
                    }
                }
            }
        }
        this.removeBlabkArraysFromDataLists(compInstance);
    }
    /**
     * Removes blank arrays from category list
     */
    removeBlabkArraysFromDataLists(compInstance) {
        for (let index1 = compInstance.dataLists.length - 1; index1 >= 0; index1--) {
            if (compInstance.dataLists[index1] && compInstance.dataLists[index1].length === 0) {
                compInstance.dataLists.splice(index1, 1);
            }
        }
    }
    /**
   * Sets search query params
   */
    getSearchQueryParam(compInstance) {
        let params: HttpParams = new HttpParams();
        const queryParamObj = {};
        const formValues = compInstance.locationsFilterForm.value;
        if (formValues.locationName) {
            queryParamObj[compInstance.LOCATION_LIST_QUERY_PARAMS.locationName] = formValues.locationName.trim();
        }
        if (formValues.state) {
            const state = [];
            state[0] = formValues.state;
            queryParamObj[compInstance.LOCATION_LIST_QUERY_PARAMS.locationState] = formValues.state;
        }
        if (formValues.city) {
            const city = [];
            city[0] = formValues.city;
            queryParamObj[compInstance.LOCATION_LIST_QUERY_PARAMS.locationCity] = formValues.city;
        }

        queryParamObj[compInstance.LOCATION_LIST_QUERY_PARAMS.pageNo] = compInstance.currentPage;
        queryParamObj[compInstance.LOCATION_LIST_QUERY_PARAMS.pageSize] = compInstance.itemsPerPage;
        if (formValues.locationTags) {
            queryParamObj[compInstance.LOCATION_LIST_QUERY_PARAMS.locationTags] = formValues.locationTags;
        }
        const categoriesIds = _.map(compInstance.categorylist, 'id');
        if (categoriesIds) {
            queryParamObj[compInstance.LOCATION_LIST_QUERY_PARAMS.locationCategories] = categoriesIds;
        }

        if (formValues.locationType || formValues.locationType === 0) {
            queryParamObj[compInstance.LOCATION_LIST_QUERY_PARAMS.locationType] = formValues.locationType;
        }


        params = params.append(compInstance.LOCATION_LIST_QUERY_PARAMS.searchQuery, JSON.stringify(queryParamObj));


        return params;
    }
    /**
    * Sets location list data
    */
    setLocationsList(compInstance) {
        compInstance.showLoadingFlg = true;
        compInstance.locationsListService.getLocationsList(this.getSearchQueryParam(compInstance)).subscribe((response: any) => {
            if (response.header && response.payload) {
                if (Common.checkStatusCode(response.header.statusCode)) {
                    compInstance.showLoadingFlg = false;
                    compInstance.index = 1 + (20 * (compInstance.currentPage - 1));
                    if (response.payload.results) {
                        compInstance.locationsList = ListLocationDataModel.setLocationListData(response.payload.results);
                        this.renderTooltip(compInstance);
                        compInstance.totalItems = response.payload.totalItems;
                    } else {
                        compInstance.locationsList = [];
                        compInstance.totalItems = 0;
                    }
                } else {
                    compInstance.locationsList = [];
                    compInstance.totalItems = 0;
                    compInstance.showLoadingFlg = false;
                    compInstance.toastrService.error(response.header.message);
                }
            }
        },
            (err) => {
                compInstance.locationsList = [];
                compInstance.totalItems = 0;
                compInstance.showLoadingFlg = false;
                compInstance.toastrService.error(compInstance.commonLabelObj.errorMessages.error);
            });


    }
    /**
    * Renders category tooltip
    */
    renderTooltip(compInstance) {
        if (compInstance.locationsList) {
            for (let i = 0; i < compInstance.locationsList.length; i++) {
                compInstance.title[i] = '';
                for (let j = 0; j < compInstance.locationsList[i].categories.length; j++) {
                    if (compInstance.locationsList[i].categories[j].i18n) {
                        compInstance.title[i] = compInstance.title[i] + compInstance.locationsList[i].categories[j].i18n.name;
                        if (j < compInstance.locationsList[i].categories.length - 1) {
                            compInstance.title[i] = compInstance.title[i] + ' > ';
                        }
                    }
                }
            }
        }
    }
    /**
  * It sets texts wrt language selected.
  */
    setlocaleObj(compInstance) {
        compInstance.translateService.get('location.labels').subscribe((res: string) => {
            compInstance.locationLabels = res;
        });
        compInstance.translateService.get('common').subscribe((res: string) => {
            compInstance.commonLabelObj = res;
        });
    }
    /**
    * Translates dropdown values
    */
    getDropdownValues(compInstance) {
        compInstance.LOCATION_TYPES = Common.changeDropDownValues(compInstance.translateService, LOCATION_TYPES);
        compInstance.locationTypesKeyArr = Common.keyValueDropdownArr(compInstance.LOCATION_TYPES, 'id', 'text');
    }
    /**
     * It removes all children from selected category
     */
    closeCategoryName(compInstance, category) {
        const index = _.findIndex(compInstance.categorylist, ['id', category.id]);
        if (index !== -1) {
            compInstance.categorylist.splice(index, 1);
            this.removeCategoryFromDataLists(compInstance, category.name);
        }
        compInstance.removeAllChildFlag = true;
    }
    /**
       * sets search filter State dropdown data
       */
    setLocationStates(compInstance) {
        compInstance.locationsListService.getStates().subscribe((response: any) => {
            if (response.header && response.payload) {
                if (Common.checkStatusCode(response.header.statusCode)) {
                    compInstance.index = 1 + (20 * (compInstance.currentPage - 1));
                    if (response.payload.result) {
                        compInstance.statesList = response.payload.result.states;
                        for (let i = 0; i < compInstance.statesList.length; i++) {
                            if (compInstance.statesList[i] !== '') {
                                compInstance.states = compInstance.statesList[i];
                                compInstance.state.push(compInstance.states);
                            }
                        }
                    } else {
                        compInstance.statesList = [];
                    }
                } else {
                    compInstance.statesList = [];
                }
            }
        },
            (err) => {
                compInstance.statesList = [];
            });
    }
    /**
   * sets search filter City dropdown data
   */
    setLocationCities(compInstance) {
        compInstance.locationsListService.getCities().subscribe((response: any) => {
            if (response.header && response.payload) {
                if (Common.checkStatusCode(response.header.statusCode)) {

                    compInstance.index = 1 + (20 * (compInstance.currentPage - 1));
                    if (response.payload.result) {
                        compInstance.citiesList = response.payload.result.cities;
                        for (let i = 0; i < compInstance.citiesList.length; i++) {
                            if (compInstance.citiesList[i] !== '') {
                                compInstance.cities = compInstance.citiesList[i];
                                compInstance.city.push(compInstance.cities);
                            }
                        }
                    } else {
                        compInstance.citiesList = [];
                    }
                } else {
                    compInstance.citiesList = [];
                }
            }
        },
            (err) => {
                compInstance.citiesList = [];
            });
    }
    /**
    * Gets search filter Category dropdown data
    */
    setLocationCategories(compInstance) {
        compInstance.locationsListService.getLocationCategories().subscribe((response: any) => {
            if (response.header && response.payload) {
                if (Common.checkStatusCode(response.header.statusCode)) {
                    if (response.payload.results) {
                        compInstance.locationids = [];
                        compInstance.locationCategories = response.payload.results;
                        for (let i = 0; i < compInstance.locationCategories.length; i++) {
                            compInstance.locationids.push(compInstance.locationCategories[i]['id']);
                        }
                        compInstance.category = Common.getMultipleSelectArr(compInstance.locationCategories, ['id'], ['i18n', 'name']);
                    } else {
                        compInstance.locationCategories = [];
                    }
                } else {
                    compInstance.locationCategories = [];
                }
            }
        },
            (err) => {
                compInstance.locationCategories = [];
            });
    }
    /**
     * sets location tags from web service
     */
    setLocationTags(compInstance, value: string = '') {
      
        if (typeof value === 'string') {
            if (value) {
                value = value.trim();
              }
            let params: HttpParams = new HttpParams();
            if (value) {
                params = params.append('tag', value);
              }
              compInstance.tagsList = [];
              compInstance.isLoadingTagName = true;
            compInstance.locationsListService.getTags(params).subscribe((response: any) => {
                if (response.header && response.payload) {
                    if (Common.checkStatusCode(response.header.statusCode)) {
                        if (response.payload.result) {
                            compInstance.isLoadingTagName = false;
                            const tagsList = response.payload.result.tags;
                            compInstance.selectedTags.forEach((obj) => {
                                if (!tagsList.includes(obj)) {
                                    tagsList.push(obj);
                                }
                            });
                            compInstance.tagsList = tagsList;
                        } else {
                            compInstance.tagsList = [];
                        }
                        compInstance.isLoadingTagName = false;
                    } else {
                        compInstance.tagsList = [];
                    }
                }
            },
                (err) => {
                    compInstance.tagsList = [];
                    compInstance.isLoadingTagName = false;
                });
        }

    }
    /**
    * It adds tag into selectedTags Array
    */
    tagsSelected(compInstance, value) {
        if ((typeof value === 'string') && !compInstance.selectedTags.includes(value)) {
            compInstance.selectedTags.push(value);
        }
    }
    /**
    * It removes tag from selectedTags Array
    */
    tagRemoved(compInstance, value) {
        const index = compInstance.selectedTags.indexOf(value);
        if (index) {
            compInstance.selectedTags.splice(index, 1);
        }
    }
    /**
    * End of Location listing functionality
    */
}

