import { defaultDatepickerOptions, CURRENCY_CONVERSION_CONST, FILE_TYPES } from '../config'
import * as _ from 'lodash';
declare var $: any;

export class Ng2DataTableMethods {

  /**
method to get data for current page
@param page as number
@param data as array
@param config as object of ng2datatable configuration
return Array type
  **/
  static changePage(page: any, data: Array<any>): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }


  /**
method to sort ng2tabledata with ascending/descending order depends on user selection
@param data as array
@param config as object of ng2datatable configuration
return Array type
  **/
  static changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }


  /**
method to filter data according to user entered data
@param data as array
@param config as object of ng2datatable configuration
@param columns as array of ng2datatable columns includes fields linke title,name,sort,filtering
return Array type
  **/
  static changeFilter(data: any, config: any, columns: any): any {

    let filteredData: Array<any> = data;
    columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          return item[column.name].toLowerCase().match(column.filtering.filterString.toLowerCase());
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      columns.forEach((column: any) => {
        if (item[column.name].toString().match(config.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  /**
method to filter data according to user entered data
@param event as event object to get user entered value & to get id of specific column
@param data as source data array
  **/
  static filterData(event, data) {
    let columnName = event.currentTarget.id;
    const val = event.target.value.toLowerCase();
    const filteredData = data.filter(function (d) {
      return d[columnName].toLowerCase().indexOf(val) !== -1 || !val;
    });
    return filteredData;
  }
}

export class DatePickerMethods {
  /*method to get today's date*/
  public static getTodayDate() {
    var today = new Date();
    return today;
  }
  /**
method to set default month to datepicker
@param event as event object to get jsdate object after date selection
  **/
  public static setDefaultMonth(event) {
    var defaultMonth = {
      defMonth: ''
    }
    let d: Date = new Date();
    if (event) {
      d = event.jsdate;
    }
    if (d) {
      var year = d.getFullYear();
      var month: any = d.getMonth() + 1;
      var monthLen = month.toString().length;
      if (monthLen == 1)
        month = '0' + month.toString()
      defaultMonth['defMonth'] = month.toString() + "-" + year.toString()
    }
    return defaultMonth;
  }
  /*disabled all dates previous than today And from-to date validation set*/
  public static onDateChangedFrom(event: any, endDate, allDatesEnable = false) {
    let d: Date = event.jsdate;
    // set previous date
    if (d) {
      d.setDate(d.getDate());
      let copy: any = DatePickerMethods.getCopyOfEndDateOptions(endDate);

      //if(!allDatesEnable) {
      copy.disableUntil = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 };
      //}

      return copy;
    } else {

      if (allDatesEnable) {
        return defaultDatepickerOptions;
      } else {
        return defaultDatepickerOptions;
      }
    }

  }

  public static onDateChangedTo(event: any, endDate, allDatesEnable = false) {
    let d: Date = event.jsdate;
    // set previous date
    if (d) {
      d.setDate(d.getDate());
      let copy: any = DatePickerMethods.getCopyOfEndDateOptions(endDate);
      var yesterday = new Date();

      if (!allDatesEnable) {
        copy.disableUntil = { year: yesterday.getFullYear(), month: yesterday.getMonth() + 1, day: yesterday.getDate() - 1 };
      }
      copy.disableSince = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
      return copy;
    } else {
      if (allDatesEnable) {
        return defaultDatepickerOptions;
      } else {
        return defaultDatepickerOptions;
      }
    }
  }
  /*disabled all dates previous than today And from-to date validation set*/
  /*enabled all dates  previous than today And from-to date validation set*/
  public static onChangedFromDate(event: any, endDate, allDatesEnable = false) {
    let d: Date = event.jsdate;
    // set previous date
    if (d) {
      d.setDate(d.getDate());
      let copy: any = DatePickerMethods.getCopyOfEndDateOptions(endDate);
      copy.disableUntil = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 };

      return copy;
    } else {
      return defaultDatepickerOptions;
    }
  }
  public static onChangedToDate(event: any, endDate, allDatesEnable = false) {
    let d: Date = event.jsdate;
    // set previous date
    if (d) {
      d.setDate(d.getDate());
      let copy: any = DatePickerMethods.getCopyOfEndDateOptions(endDate);
      var yesterday = new Date();
      copy.disableUntil = { year: 0, month: 0, day: 0 };
      copy.minYear = 1000;
      copy.disableSince = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
      return copy;
    } else {
      return defaultDatepickerOptions;
    }
  }
  /* enabled all dates  previous than today And from-to date validation set*/

  /*method to get copy of date options*/
  public static getCopyOfEndDateOptions(endDate): any {
    return JSON.parse(JSON.stringify(endDate));
  }

  static getIsoDateFromDateObj(datepickerDateObj) {
    if (datepickerDateObj && datepickerDateObj['date']) {
      let dateObj = datepickerDateObj['date'];
      var newDate = new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);
      newDate.setHours(0);
      newDate.setMinutes(0);
      return DatePickerMethods.getDateWithRemoveTimezoneOffset(newDate.toISOString()).toISOString();
    }
  }
  public static getDateWithRemoveTimezoneOffset(isoStringDate: any) {
    var offsetDate;
    if (isoStringDate) {
      var now = new Date(isoStringDate);
      offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    }
    return offsetDate;
  }
  public static getDateWithTimezoneAdding(isoStringDate: any) {
    var offsetDate;
    if (isoStringDate) {
      var now = new Date(isoStringDate);
      offsetDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    }
    return offsetDate;
  }
}

export class Common {
  static getCookieExpiredTime() {
    var today = new Date();
    let timestamp = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    return timestamp;
  }


  static getTodayDateObj() {
    var date = new Date();
    let datepickerObj = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      },
      jsdate: date,
      epoc: (Math.floor(date.getTime()) / 1000)
    }
    return datepickerObj;
  }

  /**
method to get data for current page
@param pageNO as page number to get data for that page
@param pageSize as number of items per pageNo
@param dataArr as  source data array
  **/
  static setPagedata(pageNo, pageSize, dataArr) {
    return dataArr.slice((pageNo - 1) * pageSize, pageNo * pageSize);
  }


  static fillArrayWithNumbers(n) {
    var arr = Array.apply(null, Array(n));
    return arr.map(function (x, i) { return i });
  }

  /**
  ** Get File with data url and filename
  **/
  static dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  static getQueryParamObj(fullUrlPath) {
    if (fullUrlPath) {
      let urlArr = fullUrlPath.split("?");
      let url = urlArr[1];
      if (url) {
        //Params obj
        var params = {};
        //To lowercase
        url = url.toLowerCase();
        //To array
        url = url.split('&');

        //Iterate over url parameters array
        var length = url.length;
        for (var i = 0; i < length; i++) {
          //Create prop
          var prop = url[i].slice(0, url[i].search('='));
          //Create Val
          var value = url[i].slice(url[i].search('=')).replace('=', '');
          //Params New Attr
          params[prop] = value;
        }
        return params;
      }
    }
  };

  /**
  ** Get Image object with image url
  **/
  static getJpegImageWithUrl(url, callback) {
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function () {
      var canvas = document.createElement('canvas');

      canvas.width = image.width; // or 'width' if you want a special/scaled size
      canvas.height = image.height; // or 'height' if you want a special/scaled size
      canvas.getContext('2d').drawImage(image, 0, 0);
      var imgObj = canvas.toDataURL('image/jpeg');

      callback(imgObj);
    };
    image.src = url;
  }
  /*method to get day before today*/
  static getPreviousDate() {
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  }

  /*method to check given object is empty or not*/
  static isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  /**
  ** created common method to get key Value array for dropdown
  **/
  static keyValueDropdownArr(arrValueLabel, key, value) {
    var dropdownArr = [];
    for (var i = 0; i < arrValueLabel.length; i++) {
      dropdownArr[arrValueLabel[i][key]] = arrValueLabel[i][value];
    }
    return dropdownArr;
  }



  /**
  For multiselect plugin we need values in id and text object array
  @param selectArr of array
  @param idName as array for key of id with passed array like indexing upto ['id']
  @param textName as array for key of with passed array like indexing upto ['i18n','name']
  return Array type
  **/
  static getKeyValueDynamicDropdownArr(selectArr, idNameArr, textNameIndexArr) {
    //var finalMultiSelectArr = [];
    var dropdownArr = [];
    for (var index = 0; index < selectArr.length; index++) {
      dropdownArr[index] = [];
      var idVal = selectArr[index];
      for (var idValIndex = 0; idValIndex < idNameArr.length; idValIndex++) {
        idVal = idVal[idNameArr[idValIndex]];
      }
      var textName = selectArr[index];
      for (var textIndex = 0; textIndex < textNameIndexArr.length; textIndex++) {
        textName = textName[textNameIndexArr[textIndex]]
      }

      dropdownArr[idVal] = textName;

    }
    return dropdownArr;
  }

  /**
  ** created common method to get dates between start and end date
  ** @param startDate as Date
  ** @param stopDate as Date
  **/
  static getBetweenDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = Common.addOneDay(currentDate, 1);
    }
    return dateArray;
  }
  /*method to add day after today*/
  static addOneDay(selectedDate, days) {
    var date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    return date;
  }
  static getDateObjData(date: any) {
    if (date) {
      var dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        var dateType = date;
        var datearray = dateType.split("/");
        var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
        dateObj = new Date(newdate);
      }
      var datepickerObj = {
        date: {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1,
          day: dateObj.getDate()
        },
        jsdate: dateObj,
        formatted: date,
        epoc: (Math.floor(dateObj.getTime()) / 1000)
      }
      return datepickerObj;
    }
    return "";
  }
  /**
  Check number is between a and b or not
  @param number as Number to check which number is between or not
  @param a as Number check for from number val
  @param b as Number check for to number val
  @param inclusive as Boolean for check between or equal
  **/
  static numberIsBetween(number, a, b, inclusive) {
    if (Number.isInteger(number) && Number.isInteger(a) && Number.isInteger(b)) {
      var min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
      return inclusive ? number >= min && number <= max : number > min && number < max;
    }
  }

  /**
  ** created common method to check date is between or not
  **/
  static dateIsBetween(from, to, check) {
    var fDate, lDate, cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if ((cDate <= lDate && cDate >= fDate)) {
      return true;
    }
    return false;
  }


  /**
  return confirmPopup Swal object
  @param textMsg as String which text should appear on popup
  @param confirmBtnText as String confirm button text
  @param cancelButtonText as String Cancel Button text
  @param swalType as String Swal popup type like warning
  return object of swal
  **/
  static swalConfirmPopupObj(textMsg, closeOnCancel = true, closeOnConfirm = false, confirmBtnText = 'Yes', cancelButtonText = 'No', swalType = 'warning', title = '') {
    var swalObj = {
      title: title,
      text: textMsg,
      type: swalType,
      showCancelButton: true,
      confirmButtonColor: '#ec2626',
      cancelButtonColor: '#146e1f',
      confirmButtonText: confirmBtnText,
      cancelButtonText: cancelButtonText,
      closeOnConfirm: closeOnConfirm,
      closeOnCancel: closeOnCancel,
      closeOnEsc: true
    }
    return swalObj;
  }


  /**
  function which we can use for getting dynamic messages and url like sprintf function of php
  for example sprintf('Latitude: %s, Longitude: %s, [Count: %d', 41.847, -87.661, 'two'])
  we can use %s or %d to pass as an argument to be appended
  **/
  static sprintf(string, argsArr) {
    var args = argsArr,
      i = 0;
    return string.replace(/%((%)|s|d)/g, function (m) {
      // m is the matched format, e.g. %s, %d
      var val = null;
      if (m[2]) {
        val = m[2];
      } else {
        val = args[i];
        // A switch statement so that the formatter can be extended. Default is %s
        switch (m) {
          case '%d':
            val = parseFloat(val);
            if (isNaN(val)) {
              val = 0;
            }
            break;
        }
        i++;
      }
      return val;
    });
  }

  static changeDropDownValues(serviceInstance, textArray, localizationObj = 'dropDownLabels') {
    const textArray1 = JSON.parse(JSON.stringify(textArray));
    serviceInstance.get(localizationObj).subscribe((res: string) => {
      for (let index = 0; index < textArray.length; index++) {
        textArray1[index].text = res[textArray[index].text];
      }
    });
    return textArray1;
  }

  /**
  For multiselect plugin we need values in id and text object array
  @param selectArr of array
  @param idName as array for key of id with passed array like indexing upto ['id']
  @param textName as array for key of with passed array like indexing upto ['i18n','name']
  return Array type
  **/
  static getMultipleSelectArr(selectArr, idNameArr, textNameIndexArr, disableFlagNameArr: any = [], disableFlagValue: any = '', typeArr: any = []) {
    var finalMultiSelectArr = [];
    for (var index = 0; index < selectArr.length; index++) {
      var idVal = selectArr[index];
      for (var idValIndex = 0; idValIndex < idNameArr.length; idValIndex++) {
        idVal = idVal[idNameArr[idValIndex]];
      }
      var textName = selectArr[index];
      for (var textIndex = 0; textIndex < textNameIndexArr.length; textIndex++) {
        textName = textName[textNameIndexArr[textIndex]]
      }
      var disableFlag = selectArr[index];
      for (var textIndex = 0; textIndex < disableFlagNameArr.length; textIndex++) {
        disableFlag = (disableFlag[disableFlagNameArr[textIndex]] != disableFlagValue) ? true : false
      }
      var typeName = selectArr[index];
      for (var textIndex = 0; textIndex < typeArr.length; textIndex++) {
        typeName = typeName[typeArr[textIndex]]
      }
      let obj = {
        id: idVal,
        text: textName,
        type: parseInt(typeName)
      };
      if (disableFlagNameArr.length > 0) {
        obj["disabled"] = disableFlag;
      }
      finalMultiSelectArr.push(obj);

    }
    return finalMultiSelectArr;
  }
  /**
  Get Assigned Date Picker value in date object like how we want to show in DatePicker
  @param isoFormattedDate as String
  return as object value will be like
  {
    date: {
      day: bookingStartDate.getDate(),
      month: bookingStartDate.getMonth() + 1,
      year: bookingStartDate.getFullYear()
    }
  }
  **/
  static getAssignDatePickerObjVal(isoFormattedDate) {
    if (isoFormattedDate) {
      var dateVal = new Date(isoFormattedDate);
      return {
        date: {
          day: dateVal.getDate(),
          month: dateVal.getMonth() + 1,
          year: dateVal.getFullYear()
        }
      };
    }
  }
  /*method to set offset to UTC*/
  static setOffsetToUTC(fromDate, toDate) {
    var date: any = {};
    if (fromDate) {
      var fromOffset = (-1) * fromDate.jsdate.getTimezoneOffset() * 60;
      var fromDateOffset = new Date((fromDate.epoc + fromOffset) * 1000);
      date['fromDate'] = fromDateOffset.toISOString();
    }
    if (toDate) {
      var toOffset = (-1) * toDate.jsdate.getTimezoneOffset() * 60;
      var toDateOffset = new Date((toDate.epoc + toOffset) * 1000);
      date['toDate'] = toDateOffset.toISOString();
    }
    return date;
  }
  static setOffsetToUTCMyRangeDatePicker(daterange) {

    var date: any = {};
    if (daterange) {
      var fromOffset = (-1) * daterange.beginJsDate.getTimezoneOffset() * 60;
      var fromDateOffset = new Date((daterange.beginEpoc + fromOffset) * 1000);
      date['fromDate'] = fromDateOffset.toISOString();
    }
    if (daterange) {
      var toOffset = (-1) * daterange.endJsDate.getTimezoneOffset() * 60;
      var toDateOffset = new Date((daterange.endEpoc + toOffset) * 1000);
      date['toDate'] = toDateOffset.toISOString();
    }
    return date;
  }
  static convertToDateRangePickerObject(startDate, endDate) {
    const obj = {
      'beginDate': Common.getAssignDatePickerObjVal(startDate).date,
      'endDate': Common.getAssignDatePickerObjVal(endDate).date
    };
    return obj;
  }
  /*method to set offset to UTC*/
  /*method to remove offset from UTC*/
  static removeOffsetFromUTC(date) {
    const localDateObj = new Date(date);
    const userTimezoneOffset = localDateObj.getTimezoneOffset() * 60000;

    const convertedDate = new Date(localDateObj.getTime() + userTimezoneOffset);
    return convertedDate;
    // var convertdLocalTime = new Date(date);
    // var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;
    // convertdLocalTime.setHours(convertdLocalTime.getHours() + hourOffset);
    // return convertdLocalTime;
  }
  /*method to remove offset from UTC*/


  /**
  ** method to check statuscode of httpresponse is equal to 200 or not
  ** @param response as httpresponse of webservice
  **/
  static checkStatusCode(response) {
    if (response === 200)
      return true;
    else
      return false;
  }

  /**
  ** method to check statuscode of httpresponse is in range 200-299
  ** @param response as httpresponse of webservice
  **/
  static checkStatusCodeInRange(statusCode) {
    if (statusCode >= 200 && statusCode <= 299)
      return true;
    else
      return false;
  }
  /**
method to parse JWT token
@param token as authtoken
return token data as object
**/
  static getRelativePathUrl(relativePathTo, url, pathArr) {
    let urlArr = [];
    let relativePathArr = [];
    if (url) {
      urlArr = url.split('/');
    }
    if (relativePathTo) {
      relativePathArr = relativePathTo.split('/');

      for (let index = 0; index < relativePathArr.length - 1; index++) {
        urlArr.splice(-1, 1);
      }
    }
    if (pathArr) {
      for (let index = 0; index < pathArr.length; index++) {
        urlArr.push(pathArr[index]);
      }
    }
    return urlArr.join('/');
  }
  static parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  /*method to get today's date */
  public static getTodayDate() {
    var today = new Date();
    return today;
  }
  /*method to get today's date */

  /**
method to set form data for posting multipart data
@param file as selected file
return formdata as object
**/
  public static setFormData(file) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }

  /**
method to convert value from default currency to other currency or viceversa
@param option as conversion type 
@param amount as value to be converted 
@param targetUnit as unit of target currency  
return numeric value
**/
  public static convertValue(option, amount, targetUnit) {
    let result = 0;
    switch (option) {
      case CURRENCY_CONVERSION_CONST.defaultToOthers:
        result = parseFloat(amount) * parseFloat(targetUnit);
        break;
      case CURRENCY_CONVERSION_CONST.othersToDefault:
        result = parseFloat(amount) / parseFloat(targetUnit);
        break;
    }
    return result;
  }

  /**
method to get type of selected file
@param file as selected file
return file type as string value
  **/
  public static getFileType(file) {
    let fileNameArr = file.name.split(".");
    let type = fileNameArr[fileNameArr.length - 1];
    return type;
  }

  /**
method to check valid file uploaded or not
@param filetype as type of selected type
return boolean value
  **/
  public static checkFileType(filetype) {
    let validtype = _.find(FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype)
      return true;
    else
      return false;

  }

  /*method to scroll to top position */
  public static scrollTOTop() {
    window.scrollTo(0, 0);
  }
  /*method to scroll to top position */

  /**
  * Scroll to invalid form control if field is invalid within form
  * and hide submit button loader if available
   */
  public static scrollToInvalidControl(selfObjInstance, formGroupInstance, spinnerFlagKey = "") {
    if (spinnerFlagKey) {
      selfObjInstance[spinnerFlagKey] = false;
    }
    let target;
    for (var i in formGroupInstance.controls) {
      if (!formGroupInstance.controls[i].valid) {
        target = formGroupInstance.controls[i];
        break;
      }
    }
    if (target) {
      if (spinnerFlagKey) {
        selfObjInstance[spinnerFlagKey] = false;
      }
      let el = $('.ng-invalid:not(form):first');
      if (el.offset() && el.offset().top) {
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
      }
    }
  }
  /** 
  checks given element is in viewport of user or not
  @param elem as html element
  **/
  static isInView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    if ($(elem).offset()) {
      var elemTop = $(elem).offset().top;
      return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
    }
  }
  /**
method to download file of any type
@param url as type of string
  **/
  static downloadFile(url) {
    let a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
