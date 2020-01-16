import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { async } from 'async';
declare var window;

@Injectable()
export class FileUploadController {

  constructor (public _toastCtrl: ToastrService) { }

  readFile (input: any, callback?: (e: any, fileName?: string) => void) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      let fileName = input.files[0].name;
      reader.onload = (e: any) => {
        callback(e.target.result, fileName);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  readMultiplBinaryFiles (input: any, callback?: (fileDataArray: any[], fileNameArray: string[]) => void) {
    let fileDataArray = [];
    let fileNameArray = [];
    if (input.files && input.files.length > 0) {
      let duplicateFileList = new Array(input.files.length);
      duplicateFileList.fill(' ');
      async.eachOfSeries(duplicateFileList, (dupFile, index, innerCallback) => {
        const inputFile = input.files[index];
        fileNameArray.push(inputFile.name);
        let reader = new FileReader();
        reader.onload = (e: any) => {
          fileDataArray.push(e.target.result);
          innerCallback();
        };
        reader.readAsBinaryString(inputFile);
      }, () => {
        callback(fileDataArray, fileNameArray);
      });
    }
  }

  readBinaryFile (input: any, callback?: (e: any, fileName?: string) => void) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      let fileName = input.files[0].name;
      reader.onload = (e: any) => {
        callback(e.target.result, fileName);
      };
      reader.readAsBinaryString(input.files[0]);
    }
  }

  readFileAsBinaryString (input: any, callback?: (e: any, fileName?: string) => void) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      let fileName = input.files[0].name;
      reader.onload = (e: any) => {
        callback(e.target.result, fileName);
      };
      reader.readAsText(input.files[0]);
    }
  }

  readAsBuffer (input: any, callback?: (e: any, fileName?: string) => void) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      const fileName = input.files[0].name;
      reader.onload = (e: any) => {
        callback(e.target.result, fileName);
      };
      reader.readAsArrayBuffer(input.files[0]);
    }
  }

  readImageFile (input: any, imageSize: any,maxSize: any, callback?: (e: any, fileName?: string) => void) {
    if (input.files && input.files[0] && this.isFileImage(input.files[0])) {
      console.log('image file Size',Math.round(input.files[0].size / 1024));
      console.log('maxSize ===>',maxSize);
      console.log('imageSize.height ===>',imageSize.height);
      console.log('imageSize.width ===>',imageSize.width);
      let _URL = window.URL || window.webkitURL;
      let img = new Image();
      img.src = _URL.createObjectURL(input.files[0]);

      // Check image width & height
      img.onload = () => {
        if (imageSize.height != null && imageSize.width != null && img.width > imageSize.width && img.height > imageSize.height) {
          this._toastCtrl.error('Image dimension should be less than ' + imageSize.width + 'x' + imageSize.height);
        } else if (maxSize !== undefined && maxSize !== null && maxSize < input.files[0].size) {
          this._toastCtrl.error('Image size should be less than ' + Math.round(maxSize / 1024) + ' kb');
        } else {
          this.readFile(input, (result, fileName) => {
            callback(result, fileName);
          });
        }
      };
    } else {
      this._toastCtrl.error('Please select image to upload');
    }
  }

  // tslint:disable
  readAsBlob (file: File, index, opt_startByte, opt_stopByte, callback?: (e: any) => void) {
    let start = parseInt(opt_startByte) || 0;
    let stop = parseInt(opt_stopByte) || file.size - 1;
    let reader = new FileReader();
  // tslint:enable
    reader.onloadend = function () {
      let base64data = reader.result;
    };

    let blob = file.slice(start, stop + 1);
    reader.readAsDataURL(blob);
  }

  isFileImage (file) {
    return file && file['type'].split('/')[0] === 'image';
  }
}
