export class ReviewData {
    /**
    return Role details data as per formcontrol
    @param reviewDetails as Object
    **/
    static getReviewData(data) {
        var reviewServiceFormData = [];
        if (data) {
            for (let i = 0; i < data.locationImages.length; i++) {
                reviewServiceFormData.push({
                    "locationImageId": data.locationImages[i].id ? data.locationImages[i].id : "",
                    "locationImage": data.locationImages[i].thumbnailImageUrl ? data.locationImages[i].thumbnailImageUrl : "",
                    "tags": data.locationImages[i].tags ? ReviewData.getTags(data.locationImages[i].tags) : [],
                    "orignaslImageUrl": data.locationImages[i].orignaslImageUrl ? data.locationImages[i].orignaslImageUrl : "",
                    "imageOrientation": data.locationImages[i].imageOrientation ? data.locationImages[i].imageOrientation : ""  
                });
            }

        }
        return reviewServiceFormData;
    }
    static setReviewData(tagArr, locationImageId) {
        var reviewInputFormData;
        if (locationImageId) {
            reviewInputFormData = {
                'locationImageId': locationImageId,
                'tags': tagArr ? ReviewData.setTags(tagArr) : [],
            }
        }
        return reviewInputFormData;
    }
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
    static setTags(tagArrData) {
        var tagArray = [];
        for (let i = 0; i < tagArrData.length; i++) {
            tagArray.push(tagArrData[i].value);
        }
        return tagArray;
    }
}
