import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Common } from '../common';
import { COOKIES_CONSTANTS, LOCAL_STORAGE_CONSTANTS } from '../../config';
import { NavigationService } from './navigation.service';
import { LocalStorageService } from 'angular-2-local-storage';
const CryptoJS = require('crypto-js');

@Injectable()
export class EncriptionService {
    /**
    * constructor method is used to initialize members of class
    */
    constructor() { }

    /**
    * This method is used to encrypt data with a key
    */
    setEncryptedData(data: string, key) {
        return CryptoJS.AES.encrypt(data, key);
    }

    /**
    * This method is used to decrypt data with a key
    */
    getDecryptedData(data, key) {
        const bytes = CryptoJS.AES.decrypt(data.toString(), key);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    }
}
