import * as _ from 'lodash';

export class ManageReviewDataModel {
    static myTagArray = [];
    /**
    return Role details data as per formcontrol
    @param reviewDetails as Object
    **/
    static getReviewData(data) {
        var reviewServiceFormData = [];
        if (data) {
            for (let i = 0; i < data.locationImages.length; i++) {
                reviewServiceFormData.push({
                    'locationImageId': data.locationImages[i].id ? data.locationImages[i].id : '',
                    'locationImage': data.locationImages[i].thumbnailImageUrl ? data.locationImages[i].thumbnailImageUrl : '',
                    'tags': data.locationImages[i].tags ? ManageReviewDataModel.getTags(data.locationImages[i].tags) : [],
                    'orignaslImageUrl': data.locationImages[i].orignaslImageUrl ? data.locationImages[i].orignaslImageUrl : '',
                    'imageOrientation': data.locationImages[i].imageOrientation ? data.locationImages[i].imageOrientation : ''
                });
            }
        }
        return reviewServiceFormData;
    }

    /**
    * Set final review data and add 'ischecked' field in object
    */
    static setAlltagsArrData(data) {
        var reviewServiceData = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                reviewServiceData.push({
                    'count': data[i].count ? data[i].count : '',
                    'tag': data[i].tag ? data[i].tag : '',
                    'isChecked': false
                });
            }
        }
        return reviewServiceData;
    }

    /**
    * Set all tags group data and add 'ischecked' field in array object
    */
    static reviewTagsModalData(data) {
        if (data) {
            for (let dataList = 0; dataList < data.length; dataList++) {
                for (let childrenList = 0; childrenList < data[dataList].children.length; childrenList++) {
                    const tempchildrenArr = data[dataList].children[childrenList];
                    tempchildrenArr.isChecked = false;
                }
            }
        }
        return data;
    }

    /**
    * Set review data for individual image tagging
    */
    static setReviewData(tagArr, locationImageId) {
        var reviewInputFormData;
        if (locationImageId) {
            reviewInputFormData = {
                'locationImageId': locationImageId,
                'tags': tagArr ? ManageReviewDataModel.setTags(tagArr) : [],
            }
        }
        return reviewInputFormData;
    }

    /**
    * Set review data for group image tagging
    */
    static setAllReviewData(tagArr, locationImageIdArr, checkedTagObj) {

        var reviewInputFormData;
        if (locationImageIdArr) {
            reviewInputFormData = {
                'locationImageIds': locationImageIdArr ? ManageReviewDataModel.setLocationIdsArr(locationImageIdArr) : [],
                'tags': tagArr ? ManageReviewDataModel.setMyTags(tagArr, checkedTagObj) : [],
            }
        }
        return reviewInputFormData;
    }

    /**
    * Set location id array for group image tagging
    */
    static setLocationIdsArr(locationIdsArr) {
        var locationIdArray = [];
        for (let i = 0; i < locationIdsArr.length; i++) {
            locationIdArray.push(locationIdsArr[i].id);
        }
        return locationIdArray;
    }

    /**
    * Get tags for get review data
    */
    static getTags(tagArrData) {
        var tagArr = [];
        if (tagArrData != null) {
            for (let i = 0; i < tagArrData.length; i++) {
                tagArr.push({
                    'display': tagArrData[i] ? tagArrData[i] : '',
                    'value': tagArrData[i] ? tagArrData[i] : '',
                });
            }
        }
        return tagArr;
    }

    /**
    * Set tags for individual image tagging
    */
    static setTags(tagArrData) {
        var tagArray = [];
        for (let i = 0; i < tagArrData.length; i++) {
            tagArray.push(tagArrData[i].value);
        }
        return tagArray;
    }

    /**
    * Set tag names array for group image tagging
    */
    static setMyTags(myTagArrData, checkedTagArrData) {
        const allTagsArr = [];
        for (let i = 0; i < myTagArrData.length; i++) {
            allTagsArr.push(myTagArrData[i].value);
        }
        const filterId = _.filter(checkedTagArrData, { children: [{ isChecked: true }] });
        for (let i = 0; i < filterId.length; i++) {
            const checkedTags = _.filter(filterId[i].children, { isChecked: true });
            for (let j = 0; j < checkedTags.length; j++) {
                allTagsArr.push(checkedTags[j].tag);
            }
        }
        return allTagsArr;
    }

    static locationImageIdArr(locationImageIdArrData) {
        var tagArray = [];
        for (let i = 0; i < locationImageIdArrData.length; i++) {
            tagArray.push(locationImageIdArrData[i].value);
        }
        return tagArray;
    }
}
